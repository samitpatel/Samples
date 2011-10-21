# Create your views here.
from django.shortcuts import render_to_response, redirect
from django.views.decorators.csrf import csrf_protect
from django.core.context_processors import csrf
from django.template.context import RequestContext
from station.models import *
from login.models import User
from django.http import HttpResponse
from django.utils import simplejson
from django.core.serializers.json import DjangoJSONEncoder


def userInfo(request):
    user = User.objects.get(id = request.session['user'])
    response_dict = {}
    response_dict.update({'firstName':user.firstName})
    response_dict.update({'lastName':user.lastName})
    response_dict.update({'email':user.email})
    json = simplejson.dumps(response_dict, ensure_ascii=False)
    return HttpResponse( json, mimetype='application/javascript')


@csrf_protect
def station(request,station_name):
    
    station = Station.objects.get(name = station_name)
    user = User.objects.get(id = request.session['user'])
    response_dict = {}
    response_dict.update(csrf(request))
    response_dict.update({'station_name':station_name})
     
    try:
        Listener.objects.get(user = user, station = station)
        
    except Listener.DoesNotExist:
            
        if station and user:
            entry = Listener(user = user, station = station)
            entry.save()
    
    request.session['station'] = station.id
    
    
#    This checks whether the user is present on the djlist. If he is present the 'self' will be set
#    to 'self' otherwise its blank.
    try:
        DJList.objects.get(user = user, station = station)
        response_dict.update({'self': user.id})
    except DJList.DoesNotExist:
        response_dict.update({'self': ''})
       
    response_dict.update({'listeners': getTotalListeners(station.id)})
    response_dict.update({'capacity': station.capacity})    
    response_dict.update({'currentSong': getCurrentSong(station.id)})
    response_dict.update({'chats': getChats(station.id)})
    response_dict.update({'pastSongs': getPastSongs(station.id)})
    response_dict.update({'djList': getDJList(station.id)})
    response_dict.update({'library': getLibrary(user.id)})
    response_dict.update({'sicks': getSicks(station.id)})
    response_dict.update({'currentDJ': CurrentDJ(request)})
    
    return render_to_response('station.html', response_dict, context_instance = RequestContext(request))



def getCurrentSong(stationID):
    try:
        entry = CurrentSong.objects.get(station__id = stationID)
        return entry.song
    except CurrentSong.DoesNotExist:
        return {}

def getTotalListeners(stationID):
    listeners = Listener.objects.filter(station__id = stationID).count()
    return listeners


def getChats(stationID):
    chats = Chat.objects.filter(station__id = stationID).values('id', 'user__facebookid','user__firstName','user__lastName','message')
    return list(chats)


def getPastSongs(stationID):
    pastSongs = PastSong.objects.filter(station__id = stationID).values('song__id', 'song__title', 'song__artist', 'song__duration')
    return list(pastSongs)


def getDJList(stationID):
    djList = DJList.objects.filter(station__id = stationID).values('user__id', 'user__firstName', 'user__lastName').order_by('timestamp')
    return list(djList)


def currentTime(request):
    json = simplejson.dumps(datetime.datetime.now(), cls=DjangoJSONEncoder)
    return HttpResponse( json, mimetype='application/javascript') 


def getLibrary(userID):
    library = Library.objects.filter(user__id = userID).values('id', 'song__title', 'song__artist', 'song__duration').order_by('song__title')
    return list(library)


def getSicks(stationID):
    entry = CurrentSong.objects.get(station__id = stationID)
    users = SickAndKick.objects.filter(station__id = stationID, song__id = entry.song.id, sick = True).values('user__id', 'user__facebookid', 'user__firstName', 'user__lastName')
    return list(users)
        


def profileChange(request):
    user = User.objects.get(id = request.session['user'])
    if request.method == 'POST':
        name = request.POST['name']
        name = name.split(None,1)
        firstName = name[0]
        
        if len(name) == 2:
            lastName = name[1]
        else:
            lastName = ''
            
        email = request.POST['email']
        
        user.firstName = firstName
        user.lastName = lastName
        user.email = email
        user.save()
        
        return HttpResponse(True)


def getPlaylists(request):
    user = User.objects.get(id = request.session['user'])
    playlists = Playlist.objects.filter(user__id = user.id).values('id', 'name')
    # Make a json whatsit to send back.
    json = simplejson.dumps(list(playlists), ensure_ascii=False)

    # And send it off.
    return HttpResponse( json, mimetype='application/javascript')


def playlistPanel(request):
    return render_to_response('createPlaylist.html')



def addictCure(request):
    
    user = User.objects.get(id = request.session['user'])
    
    if request.method == 'GET' and 'action' in request.GET:
        addictedToID = request.GET['addictedToID']
        action = request.GET['action']
        
        if action == 'addict':
            try:
                entry = Addict.objects.get(user = user, addictedTo__id = addictedToID)
            except Addict.DoesNotExist:
                addicted = User.objects.get(id = addictedToID)
                entry = Addict(user = user, addictedTo = addicted)
                entry.save()
        else:
            try:
                entry = Addict.objects.get(user = user, addictedTo__id = addictedToID)
                entry.delete()
            except Addict.DoesNotExist:
                pass
        
        return HttpResponse('')
    
    else:
        return HttpResponse('Error: Inappropriate request')
            
            

def currentDJ(request):
    
    user = User.objects.get(id = request.session['user'])
    station = Station.objects.get(id = request.session['station'])
    
    try:
        entry = CurrentDJ.objects.get(station = station)
        dj = entry.user
    except CurrentDJ.DoesNotExist:
        entry = CurrentDJ(user = user, station = station)
        entry.save()
        dj = user
        
    json = simplejson.dumps(djInfo(station.id,dj), ensure_ascii=False)
    
    return HttpResponse( json, mimetype='application/javascript')
    


def nextDJ(request):
    
    station = Station.objects.get(id = request.session['station'])    
    
    djListCount = DJList.objects.filter(station = station).count()
    
    if djListCount != 0:
        entry = DJList.objects.filter(station = station).order_by('timestamp')[0]
        nextDJ = entry.user
        entry.remove()
        #HAVE TO ADD THE USER IN DJLIST UPDATES..

    else:
        entry = CurrentDJ.objects.get(station = station)
        nextDJ = entry.user
    
    json = simplejson.dumps(djInfo(station.id,nextDJ), ensure_ascii=False)
    return HttpResponse( json, mimetype='application/javascript')


    
def djInfo(stationID,dj): 
    
    
    response_dict = {}   
    mostStations = {}
    addicts = Addict.objects.filter(addictedTo = dj).count()
    streaks = 1
#    songs = PastSong.objects.filter(user = dj, station__id = stationID)[:1]
#    print songs
#    if songs[0].user.id == songs[1].user.id:
#        streaks = 2
#    else:
#        streaks = 1
#    mostStations = Station.objects.raw('SELECT lobby_station.id, name, count(lobby_station.id) as cnt FROM station_pastsong INNER JOIN lobby_station ON station_pastsong.station_id = lobby_station.id GROUP BY station_id ORDER BY cnt DESC')
    response_dict.update({'id': dj.id})
    response_dict.update({'facebookid': dj.facebookid})
    response_dict.update({'firstName': dj.firstName})
    response_dict.update({'lastName': dj.lastName})
    response_dict.update({'addicts': addicts})
    response_dict.update({'streaks': streaks})
    response_dict.update({'mostStations' : list(mostStations)})
   
    return response_dict



def getSondIDFromMedianetID(request):
    if request.method == 'GET' and 'medianetID' in request.GET:
        medianetID = request.GET['medianetID']
        try:
            song = Song.objects.get(medianetID = medianetID)
            return HttpResponse(song.id)
        except Song.DoesNotExist:
            return HttpResponse(-1)
    else:
        return HttpResponse(-2)


def addChat(request):
    
    user = User.objects.get(id = request.session['user'])
    station = Station.objects.get(id = request.session['station'])
    response_dict = {}
    
    if request.method == 'POST' and 'chat' in request.POST:
        chat = request.POST.get('chat', None)
        entry = Chat(user = user, station = station, message = chat)
        entry.save()
        response_dict.update({'id' : entry.id})
        response_dict.update({'fid':user.facebookid})
        response_dict.update({'firstName':user.firstName})
        response_dict.update({'lastName':user.lastName})
        response_dict.update({'success':True})
        
    else:
        response_dict.update({'success':False})

    # Make a json whatsit to send back.
    json = simplejson.dumps(response_dict, ensure_ascii=False, cls=DjangoJSONEncoder)

    # And send it off.
    return HttpResponse( json, mimetype='application/javascript')



def addToDJList(request):
    
    user = User.objects.get(id = request.session['user'])
    station = Station.objects.get(id = request.session['station'])
    response_dict = {}
    response_dict.update({'userid': user.id, 'firstName': user.firstName, 'lastName': user.lastName})
    
    if request.method == 'GET':
        
        try:
            DJList.objects.get(user__id = user.id, station__id = station.id)
        except DJList.DoesNotExist:
            entry = DJList(user = user, station = station)
            entry.save()
        
        try:
            updateEntry = DJListUpdate.objects.get(user = user, station = station)
            updateEntry.timestamp = datetime.datetime.now() 
            updateEntry.isAdded = True
            updateEntry.save()
            response_dict.update({'timeStamp': updateEntry.timestamp})
        
        except DJListUpdate.DoesNotExist:    
            newEntry = DJListUpdate(user = user, station = station)
            newEntry.save()
            response_dict.update({'timeStamp': newEntry.timestamp}) 
             
#            deleteEntry = DJListUpdate.objects.filter(user = user, station = station).exclude(id = updateEntry.id)
#            deleteEntry.delete()
#            response_dict.update({'updateID': updateEntry.id})
        
        response_dict.update({'success': True})
            
    else:
        response_dict.update({'success':False})

    # Make a json whatsit to send back.
    json = simplejson.dumps(response_dict, ensure_ascii=False, cls=DjangoJSONEncoder)

    # And send it off.
    return HttpResponse( json, mimetype='application/javascript')
  
  
    
def removeFromDJList(request):
    
    user = User.objects.get(id = request.session['user'])
    station = Station.objects.get(id = request.session['station'])
    response_dict = {}
    
    if request.method == 'GET':
        entry = DJList.objects.get(user__id = user.id, station__id = station.id)
        entry.delete()
        
        try: 
            updateEntry = DJListUpdate.objects.get(user = user, station = station)
            updateEntry.timestamp = datetime.datetime.now() 
            updateEntry.isAdded = False
            updateEntry.save()
            response_dict.update({'timeStamp': updateEntry.timestamp})
            
        except DJListUpdate.DoesNotExist:
            newEntry = DJListUpdate(user = user, station = station, isAdded = False)
            newEntry.save()
            response_dict.update({'timeStamp': newEntry.timestamp})  
 
        response_dict.update({'success':True})
        
    else:
        response_dict.update({'success':False})

    # Make a json whatsit to send back.
    json = simplejson.dumps(response_dict, ensure_ascii=False, cls=DjangoJSONEncoder)

    # And send it off.
    return HttpResponse( json, mimetype='application/javascript')



def addToPlaylist(request):
    
    user = User.objects.get(id = request.session['user'])
    response_dict = {}
    response_dict.update(csrf(request))
    
    if request.method == 'POST' and 'playlistID' in request.POST:
        
        playlistID = request.POST['playlistID']
        
        if 'id' in request.POST:
            id = request.POST['id']
            
            entry = Library.objects.get(id = id, user__id = user.id,)
            try:
                playlist = Playlist.objects.get(id = playlistID)
                entry.playlist = playlist
            except Playlist.DoesNotExist:
                pass
            
            entry.save()
        
        elif 'medianetID' in request.POST:
            
            medianetID = request.POST['medianetID']
            title = request.POST['title']
            artist = request.POST['artist']
            duration = request.POST['duration']
            
            try:
                song = Song.objects.get(medianetID = medianetID)
                songID = song.id
            except Song.DoesNotExist:
                song = Song(medianetID = medianetID, title = title, artist = artist, duration = duration)
                song.save()
                songID = song.id
                
            try:
                playlist = Playlist.objects.get(id = playlistID)
            except Playlist.DoesNotExist:
                playlist = None        
            
            try:
                entry = Library.objects.get(user__id = user.id, song__id = songID) 
                entry.playlist = playlist
            except Library.DoesNotExist:
                entry = Library(user = user, song = song, playlist = playlist)   
            
            entry.save()
            response_dict.update({'id': entry.id})
        
        response_dict.update({'success':True})
        
    else:
        response_dict.update({'success':False})

    # Make a json whatsit to send back.
    json = simplejson.dumps(response_dict, ensure_ascii=False)

    # And send it off.
    return HttpResponse( json, mimetype='application/javascript')
     
     
     
def addSongToLibrary(request):
    
    user = User.objects.get(id = request.session['user'])
    response_dict = {}
    response_dict.update(csrf(request))
    
    if request.method == 'POST' and 'songID' in request.POST:
        songID = request.POST['songID']
        song = Song.objects.get(id = songID)
        try:
            entry = Library.objects.get(user__id = user.id, song__id = songID) 
        except Library.DoesNotExist:
            entry = Library(user = user, song = song)   
            entry.save()
        
        response_dict.update({'id': entry.id})
        response_dict.update({'success':True})
    
    else:
        response_dict.update({'success':False})

    # Make a json whatsit to send back.
    json = simplejson.dumps(response_dict, ensure_ascii=False)

    # And send it off.
    return HttpResponse( json, mimetype='application/javascript') 



def createPlaylist(request):
            
    user = User.objects.get(id = request.session['user'])
    response_dict = {}
    
    if request.method == 'POST' and 'name' in request.POST:
        playlistName = request.POST['name']
        entry = Playlist(user = user, name = playlistName)
        entry.save()
        response_dict.update({'playlistID':entry.id})
        response_dict.update({'success':True})
    
    else:
        response_dict.update({'success':False})

    # Make a json whatsit to send back.
    json = simplejson.dumps(response_dict, ensure_ascii=False)

    # And send it off.
    return HttpResponse( json, mimetype='application/javascript') 




def getPlaylistSongs(request):
    
    user = User.objects.get(id = request.session['user'])
    songs = {}
    
    if request.method == 'GET' and 'id' in request.GET:
        playlistID = request.GET['id']
        
        if int(playlistID) != 0:
            songs = Library.objects.filter(playlist__id = playlistID, user__id = user.id).values('id','song__title','song__artist','song__duration').order_by('song__title')
        else:
            songs = Library.objects.filter(user__id = user.id).values('id','song__title','song__artist','song__duration').order_by('song__title')
    
    # Make a json whatsit to send back.
    json = simplejson.dumps(list(songs), ensure_ascii=False)

    # And send it off.
    return HttpResponse( json, mimetype='application/javascript') 




def deleteSongFromLibrary(request):
    
    user = User.objects.get(id = request.session['user'])
    response_dict = {}
    response_dict.update(csrf(request))
    
    if request.method == 'GET' and 'id' in request.GET:
        try:
            id = request.GET['id']
            song = Library.objects.get(id = id, user__id = user.id)
            song.delete()
            response_dict.update({'success':True})
            
        except Library.DoesNotExist:
            response_dict.update({'success':False})

    else:
        response_dict.update({'success':False})
        
    # Make a json whatsit to send back.
    json = simplejson.dumps(response_dict, ensure_ascii=False)

    # And send it off.
    return HttpResponse( json, mimetype='application/javascript') 
    
    
 
def deleteSongFromPlaylist(request):
    
    user = User.objects.get(id = request.session['user'])
    response_dict = {}
    response_dict.update(csrf(request))
    
    if request.method == 'GET' and 'id' in request.GET:
        try:
            id = request.GET['id']
            song = Library.objects.get(id = id, user__id = user.id)
            song.playlist = None
            song.save()
            response_dict.update({'success':True})
            
        except Library.DoesNotExist:
            response_dict.update({'success':False})

    else:
        response_dict.update({'success':False})
        
    # Make a json whatsit to send back.
    json = simplejson.dumps(response_dict, ensure_ascii=False)

    # And send it off.
    return HttpResponse( json, mimetype='application/javascript') 


def sick(request):
    
    json = simplejson.dumps(sickKickAction(request, True), ensure_ascii=False,  cls = DjangoJSONEncoder)
    return HttpResponse( json, mimetype='application/javascript')
    
def kick(request):
    
    json = simplejson.dumps(sickKickAction(request, False), ensure_ascii=False,  cls = DjangoJSONEncoder)
    return HttpResponse( json, mimetype='application/javascript')

def sickKickAction(request, action):
    
    response_dict = {}
    user = User.objects.get(id = request.session['user'])
    station = Station.objects.get(id = request.session['station'])
    
    if request.method == 'GET':
        
        entry = CurrentSong.objects.get(station = station)
        song = entry.song
        
        try:
            entry = SickAndKick.objects.get(user = user, station = station, song = song)
            if action and entry.sick:
                response_dict.update({'updated': False})
            else:
                entry.sick = action
                entry.save()
                response_dict.update({'updated': True})
                
        except SickAndKick.DoesNotExist:    
            entry = SickAndKick(user = user, station = station, song = song, sick = action)
            entry.save()
            response_dict.update({'updated': True})
            
        try:
            updateEntry = SickUpdate.objects.get(user = user, station = station)
            updateEntry.timestamp = datetime.datetime.now() 
            updateEntry.isSick = action
            updateEntry.save()
            response_dict.update({'timeStamp': updateEntry.timestamp})
        
        except SickUpdate.DoesNotExist:    
            newEntry = SickUpdate(user = user, station = station, isSick = action)
            newEntry.save()
            response_dict.update({'timeStamp': newEntry.timestamp}) 
        

        response_dict.update({'success': True})            
        response_dict.update({'id' : user.id})
        response_dict.update({'fid' : user.facebookid})
        response_dict.update({'firstName' : user.firstName})
        response_dict.update({'lastName' : user.lastName})
        return response_dict

    else:    
        return response_dict.update({'success': False})
    
    
    
    
def stationUpdates(request):
        
    response_dict = {}
    user = User.objects.get(id = request.session['user'])
    station = Station.objects.get(id = request.session['station'])
    chats = {}
    
    response_dict.update({'timeStamp': datetime.datetime.now()})
    
    if request.method == 'GET':
        
        chatID = request.GET['chatID']
        djListTimeStamp = request.GET['djListTimeStamp']
        sickTimeStamp = request.GET['sickTimeStamp']
        
        if chatID != '':
            chats = Chat.objects.filter(id__gt = chatID, station__id = station.id).values('id', 'user__facebookid', 'user__firstName', 'user__lastName', 'message').order_by('id')
        
        if djListTimeStamp != '':
            djListUpdates = DJListUpdate.objects.filter(timestamp__gt = djListTimeStamp, station = station).values('user__id', 'user__firstName', 'user__lastName', 'isAdded', 'timestamp').order_by('timestamp')
            
        if sickTimeStamp != '':
            sickUpdates = SickUpdate.objects.filter(timestamp__gt = sickTimeStamp, station = station).values('user__id', 'user__facebookid', 'user__firstName', 'user__lastName', 'isSick').order_by('timestamp')
        
        response_dict.update({"djList" : list(djListUpdates)}) 
        response_dict.update({"sicks" : list(sickUpdates)})    
        response_dict.update({"chats" : list(chats)})
        response_dict.update({'user': user.id})
        response_dict.update({'success': True})
        
    else:
        response_dict.update({'success': False})

    json = simplejson.dumps(response_dict, ensure_ascii=False, cls=DjangoJSONEncoder)

    return HttpResponse( json, mimetype='application/javascript') 
        
        
        
  

