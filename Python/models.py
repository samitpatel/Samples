from django.db import models
from lobby.models import Station
from login.models import User
from xmlrpclib import datetime

# Create your models here.
class Listener(models.Model):
    user = models.ForeignKey(User, verbose_name='User')
    station = models.ForeignKey(Station, verbose_name='Station')
    
    def __unicode__(self):
        return '%s is listening to station %s' % (self.user, self.station)
    
class Addict(models.Model):
    user = models.ForeignKey(User, verbose_name='User', related_name='addict_user')
    addictedTo = models.ForeignKey(User, verbose_name='Addicted To', related_name = 'addict_addictedTo') 
    
    def __unicode__(self):
        return '%s is addicted to %s' % (self.user,self.addictedTo)

class Chat(models.Model):
    user = models.ForeignKey(User, verbose_name='User')
    station = models.ForeignKey(Station, verbose_name='Station')
    message = models.TextField(verbose_name='Message')
    
class Song(models.Model):   
    medianetID = models.BigIntegerField(verbose_name='Medianet ID')
    title = models.CharField(max_length=256, verbose_name='Title')
    album = models.CharField(max_length=256, verbose_name='Album', blank=True)
    artist = models.CharField(max_length=256, verbose_name='Artist')
    duration = models.CharField(max_length = 10, verbose_name='Duration')
    
    def __unicode__(self):
        return self.title
    
class PastSong(models.Model):
    station = models.ForeignKey(Station, verbose_name='Station')
    user = models.ForeignKey(User, verbose_name='User')
    song = models.ForeignKey(Song, verbose_name='Song')
    
class Playlist(models.Model):
    user = models.ForeignKey(User, verbose_name='User')
    name = models.CharField(max_length=256, verbose_name='Playlist name')
    
    def __unicode__(self):
        return self.name
        
class Library(models.Model):
    user = models.ForeignKey(User, verbose_name='User')
    song = models.ForeignKey(Song, verbose_name='Song')
    playlist = models.ForeignKey(Playlist, verbose_name='Playlist', blank=True, null=True)

class CurrentDJ(models.Model):
    station = models.ForeignKey(Station, verbose_name='Station')
    user = models.ForeignKey(User, verbose_name='User')
    
class DJList(models.Model):
    user = models.ForeignKey(User, verbose_name='User')
    station = models.ForeignKey(Station, verbose_name='Station')
    timestamp = models.DateTimeField(auto_now = True) 
    
class DJListUpdate(models.Model):
    user = models.ForeignKey(User, verbose_name = 'User')
    station = models.ForeignKey(Station, verbose_name = 'Station')
    isAdded = models.BooleanField(default = True)
    timestamp = models.DateTimeField(auto_now = True)
    
    
class SickAndKick(models.Model):
    user = models.ForeignKey(User, verbose_name='User')
    station = models.ForeignKey(Station, verbose_name='Station')
    song = models.ForeignKey(Song, verbose_name='Song')
    sick = models.BooleanField(default = True, verbose_name='Sick')
    
class SickUpdate(models.Model):
    user = models.ForeignKey(User, verbose_name = 'User')
    station = models.ForeignKey(Station, verbose_name = 'Station')
    isSick = models.BooleanField(default = True)
    timestamp = models.DateTimeField(auto_now = True)    

class CurrentSong(models.Model):
    station = models.ForeignKey(Station, verbose_name='Station')
    song = models.ForeignKey(Song, verbose_name='Song')
    
      
class Badge(models.Model):
    name = models.CharField(max_length=256, verbose_name='Name')
    imagePath = models.CharField(max_length=256, verbose_name='Image path')
    level = models.BigIntegerField(verbose_name='Level')
    
    
    