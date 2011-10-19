// JavaScript Document
var playlists = new Array();
var lastDJListUpdateTime;
var lastSickUpdateTime;
var selfUpdateCall;
var emailRegex = /\b(^(\S+@).+((\.com)|(\.net)|(\.edu)|(\.mil)|(\.gov)|(\.org)|((\.fm))|(\..{2,2}))$)\b/gi;
$(document).ready(function(){
		
	/*
	get the list of playlists
	*/
	$.getJSON('/getPlaylists/',
				function(data){playlists=data; playlists.push({id:0, name:'My Library'});}
	);
	
	/*
	The current DJ
	*/
	getCurrentDJ();
	function getCurrentDJ(){
		$.getJSON('/currentDJ/', djInfo);
	}
	
	/*
	get the current time
	*/
	$.getJSON('/getCurrentTime/',function(data){ lastDJListUpdateTime = data; lastSickUpdateTime = data;})
	/*
	The Next DJ
	*/
	function getNextDJ(){
		$.getJSON('/nextDJ/', djInfo);
	}
	
	function djInfo(data){
		$('#currentDJImage').find('img').attr('src', "https://graph.facebook.com/"+data.facebookid+"/picture?type=normal");
		$('#currentDJName').html(data.firstName+" "+data.lastName);
		$('.currentDJ').attr('id',data.id);
		$('#currentDJAddicts').html(data.addicts);
		$('#currentDJStreaks').html(data.streaks);
		/*summary = "Usually found in the ";
		$.each(data.mostStations, function(i){
				summary += this.name;
				if(i == data.mostStations.length-1){
					summary += " and ";
				}else{
					summary += ",";
				}
				
			});	
			
		$('#DJSummary').html(summary+".");
		*/
	}
	
	/*
	Addicted
	*/
	$('#addictCureButton').click(function(){
		id = $('.currentDJ').attr('id');
		
		if($(this).hasClass('addicted')){
			action = 'cured';
		}else{
			action = 'addict';
		}
		
		$.ajax({
				url : '/addictCure/',
				data: {addictedToID:id, action: action},
				type: 'GET',
				success: function(data){
							if(data == ''){
								if(action == 'addict'){
									$('#addictCureButton').addClass('addicted').html('Cured');
								}else{
									$('#addictCureButton').removeClass('addicted').html('Addicted');
								}
							}
						}
				});
		});
	
	
	/*
	SWITCHING BETWEEN DJ LIST AND PAST SONGS
	*/
	$("#djListButton").click(function(){
		if(!$(this).hasClass('red')){
			$(this).removeClass('gray').addClass('red');
			$("#pastSongsButton").removeClass('red').addClass('gray');
			$('#pastSongsPanel').hide();
			$('#djListPanel').show();
			}
		});
		
	$("#pastSongsButton").click(function(){
		if(!$(this).hasClass('red')){
			$(this).removeClass('gray').addClass('red');
			$('#djListButton').removeClass('red').addClass('gray');
			$('#pastSongsPanel').show();
			$('#djListPanel').hide();
			}
		});	
		
	/*
	Checks if the user is in djlist
	*/	
	if($('#djList').find('div.self').size() != 0){
		$('#addToDJList').addClass('added');
		$('#addToDJList').html('Remove from list');
	}	
	
	/*
	Add to DJ list
	*/	
	$('#addToDJList').click(function(){
		selfUpdateCall = true;
		updates();
		
		var $this = $(this);
		
		if($this.hasClass('added')){
			$.getJSON("/removeFromDJList/", removeFromList);
		}else{
			$.getJSON("/addToDJList/", addToList);
		}
				
		
		function removeFromList(data){
			
			if(eval(data.success)){
				
				lastDJListUpdateTime = data.timeStamp;
				$this.removeClass('added');
				$this.html('Add to list');
				
				$('#djList').find('div.self').remove();
				/*if($('#djList').children().size() != 1 && $('#djList').children(':last').hasClass('self')){
						uid = $('#djList').find('.self').attr('updateid');
					}
				
				$('#djList').find('div.self').remove();
				$('#djList').children(':last').attr('updateid',uid);*/
			
				for(i=0; i < $('#djList').find("span.number").size();i++){
					$('#djList').find("span.number").eq(i).html((i+1)+'.');
					}
			}else{
				console.log("Error : Can't remove DJ from list")
			}	
		}
				
		function addToList(data){
					
			if(eval(data.success)){
				
				lastDJListUpdateTime = data.timeStamp;
				$this.addClass('added');
				$this.html('Remove from list');
				var dj = $("<div class='position clearfix self' id='"+data.userid+"'>"+
								"<div class='position_number'>"+
									"<span class='number'>"+($('#djList').children().size()+1)+".</span>"+
								"</div>"+
								"<div class='position_name'><span class='name'>"+data.firstName+" "+data.lastName+"</span></div>"+
								"<div class='delete'></div>"+
							"</div>");
				
				$('#djList').append(dj);
				
				}else{
					console.log("Error : Can't add DJ from list")
				}	
		}				
	});
		
	/*
	SORTABLE PLAYLIST
	*/	
	
	$("#songSearchResult").sortable({
			revert:true,
			disabled:true,
			connectWith : "#playlistSongs",
			delay: 350
		});
	$("#playlistSongs").sortable({
			revert:true,
			delay: 350
	});
	$("#librarySongs").sortable({
			revert:true,
			connectWith : "#playlistSongs",
			delay: 350
		});
	$( "#songSearchResult, #playlistSongs, #librarySongs" ).disableSelection();
	
	function enableSortable(){
		$( "#songSearchResult").sortable("option", "connectWith", 'div#playlistSongs');
		$( "#songSearchResult").sortable('enable');
		$( "#playlistSongs").sortable('enable');
		$( "#librarySongs").sortable("option", "connectWith", 'div#playlistSongs');
		$( "#librarySongs").sortable('enable');
	}
	
	/*
	Action to be performed on dropping
	*/
	$('div#playlistSongs').droppable({
		//accept:'#songSearchResult > div',
		drop:function(event,ui){
				
				$song = ui.draggable;
				$song.find("div.song_up").removeClass('librarySongUp').addClass('playlistSongUp').unbind('click').bind('click',function(){songUp($(this));});
				
				}
		});
		
	
	
		
	/*
	Driving the panels
	*/	
	
	$('#addMusicButton').click(function(){
		if($(this).hasClass('done')){
			$("#panelDriver").removeClass('upload_playlist').addClass('main_playlist');
			$(this).removeClass('done');
			$('#editPlaylistButton').show();
			$(this).html('Add Music');
		}else{
			if(playlists.length > 1){
				nextPlaylist = getNextPlaylist('down',0);
				$('#editPlaylistHeader').find('span').attr('id',nextPlaylist.id).html(nextPlaylist.name);
			}else{
				$('#editPlaylistHeader').find('span').attr('id',0).html('My Library');
			}
			$("#panelDriver").removeClass('edit_playlist, main_playlist').addClass('upload_playlist');
			$(this).addClass('done');
			$('#editPlaylistButton').hide();
			$(this).html('Done');
		}
		});
	
	$('#editPlaylistButton').click(function(){
		if($(this).hasClass('done')){
			$("#panelDriver").removeClass('edit_playlist').addClass('main_playlist');
			$(this).removeClass('done');
			$('#addMusicButton').show();
			$(this).html('Edit Playlists');
		}else{
			if(playlists.length > 1){
				nextPlaylist = getNextPlaylist('down',0);
				populatePlaylistSongs(nextPlaylist);
			}else{
				$('#editPlaylistHeader').find('span').attr('id','').html('');
				$('#playlistSongs').html('');
			}
			
			$("#panelDriver").removeClass('upload_playlist, main_playlist').addClass('edit_playlist');
			$(this).addClass('done');
			$('#addMusicButton').hide();
			$(this).html('Done');
		}
		});


	//Edit Profile Changes
	$("#editProfileButton").click(function(){
		$.getJSON('/getUserInfo/',function(user){
			$('#displayName').val(user.firstName+" "+user.lastName);
			$('#email').val(user.email);
		});
		TopUp.display('#editProfilePanel',{topUp: '#accountLabel', width:350, effect:'show', overlayClose: 1, shaded: 1, type: 'dom', title: 'Edit Profile', layout: 'flatlook', resizable : 0});
		//return false;
	});
	
	$('#closeEditProfilePanel').click(function(){
		closeEditProfilePanel();
	});
	
	function closeEditProfilePanel(){
		TopUp.close(function(){
			$('#displayName').val('');
			$('#email').val('');
			$('#displayName').css({'background-color':'#EFEFEF'});
			$('#email').css({'background-color':'#EFEFEF'});
		});
	}
	
	$("#submitProfileChanges").click(function(){
		submitProfileChanges();
	});
	
	function submitProfileChanges(){
		name = $('#displayName').val();
		email = $('#email').val();
		var isValidEmail = email.match(emailRegex);
		console.log(isValidEmail);
		if(name == ''){
			$('#displayName').css({'background-color':'pink'});
		}
		if(isValidEmail){
			$.post('/editProfile/', {'name':name, 'email':email}, function(data){
				if(data){
					closeEditProfilePanel();
					makeNameChanges(name);
				}else{
					console.log('Error: profile editing failed');
				}
			});
		}else{
			$('#email').css({'background-color':'pink'});
		}
	}
	
	function makeNameChanges(name){
		
	}
	
	
	//Add Playlist
	$("#showCreatePlaylistPanel").click(function(){
		TopUp.display('#createPlaylistPanel',{topUp: '#showCreatePlaylistPanel', width:350, effect:'show', overlayClose: 1, shaded:1, type: 'dom', title: 'Create Playlist', layout: 'flatlook', resizable : 0});
		return false;
	});
	
	$("#createPlaylistButton").click(function(){
		createPlaylist();
	});
	
	$('#closePlaylistPanel').click(function(){
		closePlaylistPanel();
	});
	
	function closePlaylistPanel(){
		TopUp.close(function(){
			$('#playlistName').val('');
		});
	}
		
	function createPlaylist(){
		name = $('#playlistName').val();
		$.ajax({
				url : '/createPlaylist/',
				type : 'POST',
				data : {'name':name},
				dataType : 'json',
				success : function(data){
								if(eval(data.success)){
									$('#playlistSongs').html('');
									$('#editPlaylistHeader').find('span').attr('id',data.playlistID).html(name);
									playlists.push({id:data.playlistID, name:name});
									//THIS CLOSES THE LIGHTBOX
									closePlaylistPanel();
								}else{
									window.alert('fail');
								}
							}
				});
	}
	
	function lightBoxClose(){
		$.facebox.close;
	}
		
	/*
	SONG SEARCH IN LIBRARY
 	*/
	$("#librarySearch").focus(function(){
		if(!$(this).hasClass('on')){
			$(this).val("");
			$(this).addClass('on');
			}
		});
		
	$("#librarySearch").blur(function(){
		if($(this).val().trim() == ""){
			$(this).val("Search Library");
			$(this).removeClass('on');
			}
		});	
		
	$("#librarySearch").keyup(function(e){
		searchLibrarySongs($(this).val().trim());
		});		
		
	function searchLibrarySongs(query){
		if(query == ""){
			$('#librarySongs > .playlist_song').show();
			}else{
				for(i = 0; i < $('#librarySongs').children().size(); i++){
					if($('#librarySongs .song_title').eq(i).html().toLowerCase().indexOf(query.toLowerCase()) == -1){
						$('#librarySongs .song_title').eq(i).parent().hide();
						}else{
							$('#librarySongs .song_title').eq(i).parent().show();
						}
				}
			}
		}	
		
		
/*
Chatting functions
*/		
	$("#chatInput").keyup(function(e){
		if(e.keyCode == 13 && $(this).val() != ""){
			var chat = $(this).val();
			
			$.ajax({
				url : '/chat/',
				type : 'POST',
				data : {'chat':chat},
				dataType : 'json',
				success : function(data){addChat(data,chat)}
				});
			
		}
		});	
		
	function addChat(data,chat){
		
				if(data){
					if(eval(data.success)){
						var chatMessage = $("<div class='message clearfix' id='"+data.id+"'>"+
								"<div class='message_img'>"+
									"<img src='https://graph.facebook.com/"+data.fid+"/picture?type=square' width=25 height=25/>"+
								"</div>"+
								"<div class='message_text'>"+
									"<span class='messager'>"+data.firstName+" "+data.lastName+": </span>"+
									"<span>"+chat+"</span>"+
								"</div>"+
							"</div>");
						
						$('#chatMessages').append(chatMessage);
						$('#chatInput').val('');
					}
				}else{
					window.alert("error\n"+data)
				}
		}	
		
	/*
	Add a song button 
	*/	
	$('#addCurrentSongButton').click(function(){
		var songID = $('.current_song').attr('id');
		var songArtist = $('#currentArtist').html();
		var songTitle = $('#currentTitle').html(); 
		var songTime = $('#currentDuration').html(); 
		addSongToLibrary(songID,songArtist,songTitle,songTime);
		});

	
	$('.addPastSongButton').click(function(){
		var songID = $(this).parent().attr('id');
		var songArtist = $(this).siblings().find('.past_artist').html();
		var songTitle = $(this).siblings().find('.past_song_title').html(); 
		var songTime = $(this).siblings().find('.past_song_time').html();
		addSongToLibrary(songID,songArtist,songTitle,songTime);
		});	
	
	/*This function accepts is designed for two additions. type 'medianet' adds a new songs from medianet search
	and type 'librarysong' add songs from existing library.
	*/
	function addSongToPlaylist(type,id,artist,title,duration){	
		
		isSongAdded = false;
		
		if(type == 'medianet'){
			medianetid = id;
			$.ajax({url:'/getSondIDFromMedianetID/',
					data:{medianetID:id},
					type:'GET',
					async: false,
					success:function(data){id=eval(data);}
					});
		}
		
		if(id > 0){
			for(i = 0; i < $('#playlistSongs').children().size(); i++){
				if( id == $('#playlistSongs').children().eq(i).attr('id')){
					isSongAdded = true;
				}
			}
		}
		
		if(id == -2){
			isSongAdded = true;
		}
		
		if(!eval(isSongAdded)){
		
			if(type == 'medianet'){
				id = medianetid;
				data = {medianetID: id,
						title: title,	
						artist: artist,
						duration: duration,
						playlistID: $('#editPlaylistHeader').find('span').attr('id')}
			}else{
				data = {id: id,
						playlistID: $('#editPlaylistHeader').find('span').attr('id')}
			}
		
		
			$.ajax({
					url: '/addSongToPlaylist/',
					type: 'POST',
					data: data,
					dataType: 'json',
					success: addToView
				});
				
			function addToView(data){
						
						if(eval(data.success)){
							if(type == 'medianet'){
								id = data.id;
								className = 'librarySongUp';
							}else{
								className = 'playlistSongUp';
							}
							
							var $song = $("<div class='playlist_song clearfix ui-state-default' id='"+id+"'>"+
											"<div class='song_up "+className+"'></div>"+
											"<div class='song_artist'>"+artist+"</div>"+
											"<div class='song_title'>"+title+"</div>"+
											"<div class='song_time'>"+duration+"</div>"+
											"<div class='delete'></div>"+
										"</div>");
							
							$song.find('.delete').bind('click',function(){deleteSong($(this).parent());});
							$song.find('.song_up').bind('click',function(){songUp($(this));});					
							$('#playlistSongs').append($song);
							
							if(type == 'medianet'){
								
								isSongAdded = false
								for(i = 0; i < $('#librarySongs').children().size(); i++){
									if( id == $('#librarySongs').children().eq(i).attr('id')){
										isSongAdded = true;
									}
								}
								if(!eval(isSongAdded)){
									$song = $song.clone();
									$song.find('.song_up').unbind('click');
									$song.find('.librarySongUp').bind('click',function(){librarySongUp($(this));});		
									$song.find('.delete').bind('click',function(){deleteSong($(this).parent());});
									$('#librarySongs').append($song);
								}
							}
							enableSortable();
							
						}else{
							console.log('Failed to add a song');
						}
			}		
		}	
	}	
	

function addSongToLibrary(id,artist,title,duration){	
		
		$.ajax({
				url: '/addSongToLibrary/',
				type: 'POST',
				data: {	songID: id},
				dataType: 'json',
				success: addToView
				});
				
		function addToView(data){
		
			if(eval(data.success)){
				
				if($("#librarySongs").find("div#"+data.id).size() == 0){
					
					var $song = $("<div class='playlist_song clearfix ui-state-default' id='"+data.id+"'>"+
										"<div class='song_up librarySongUp'></div>"+
										"<div class='song_artist'>"+artist+"</div>"+
										"<div class='song_title'>"+title+"</div>"+
										"<div class='song_time'>"+duration+"</div>"+
										"<div class='delete'></div>"+
									"</div>");
								
					$song.find('.song_up').unbind('click');
					$song.find('.librarySongUp').bind('click',function(){librarySongUp($(this));});					
					$song.find('.delete').bind('click',function(){deleteSong($(this).parent());});
					$('#librarySongs').append($song);
					enableSortable();
				}
			}else{
				console.log('Error: cant add current song to library');
			}
			
		}
		
	}	
		
		
	/*
	Song up or add to playlist
	*/	
	$('.librarySongUp').click(function(){
		librarySongUp($(this));
		});
		
	function librarySongUp($this){
		if($('#playlistSongs').is(":visible")){
			if(playlists.length > 1){
				var id = $this.parent().attr('id');
				var songArtist = $this.parent().find('.song_artist').html();
				var songTitle = $this.parent().find('.song_title').html(); 
				var songTime = $this.parent().find('.song_time').html();
				addSongToPlaylist('librarySong',id,songArtist,songTitle,songTime);
			}
		}else{
			songUp($this);
		}
	}
	
	
	$('.playlistSongUp').click(function(){
		songUp($(this));
		});
	/*$('.song_up').click(function(){
		songUp($(this));
		});
	*/
	function songUp($this){
		$this.parent().parent().prepend($this.parent());
		}
		
	/*
	delete a song
	*/	
	$('.delete').click(function(){
		deleteSong($(this).parent());
		});	
	
	function deleteSong($this){
		var id = $this.attr("id");
		
		if($this.parent().attr('id') == 'playlistSongs'){
			url = '/deleteSongFromPlaylist/';
		}else{
			url = '/deleteSongFromLibrary/';
		}
		
		$.ajax({url : url,
				data: {id:id},
				type: 'GET',
				dataType:'json',
				success: function(data){
							if(eval(data.success)){
								if($this.parent().attr('id') == 'librarySongs'){
									$('#playlistSongs').find('div.playlist_song#'+id).remove();
								}
								$this.remove();
							}else{
								console.log('Error : failed to delete a song.');
							}
						}
				});
		}	
	
/*******************************************/
	
/*VOLUME CONTROL*/

	$("#slider").slider({
			orientation: "horizontal",
			range: "min",
			value: 80,
			min: 0,
			max: 100,
			slide: function( event, ui ) {
				////window.alert(ui);
				
				//flowplayer().setVolume(ui.value);
				//$("#jPlayer").jPlayer("unmute");
				//$("#mute").html("MUTE");
				//$("#jPlayer").jPlayer("volume",ui.value/100);
			}
		});
	
	//slider button	
	var handle = $("<div class='volume_marker'></div>");
	$(".ui-slider-handle").append(handle);	

	$("#zeroVolume").click(function(){
			$("#slider").slider("value",0);
		});
	$("#fullVolume").click(function(){
			$("#slider").slider("value",100);
			});


		
/************************************/
/*MEDIANET SEARCH */

	$("#medianetSearch").keyup(function(e){
		if($(this).val() == ""){
			$("#uploadPanel").show();
			$("#songSearchResult").hide();
			}
		else if(e.keyCode == 13){
			$("#uploadPanel").hide();
			$("#songSearchResult").show();
			searchSongs($(this).val());
			}
		});	
		
	$("#medianetSearch").focus(function(){
		if($(this).val() == "Search Our Library"){
			$(this).val("");
			}
		});
		
	$("#medianetSearch").blur(function(){
		if($(this).val().trim() == ""){
			$(this).val("Search Our Library");
			}
		});

function searchSongs(query){
				
				$("#songSearchResult").html("");
     			
     			$.ajax({ 
     				type: "GET", 
     				url: "/songSearch/?query=" + query, 
     				dataType: "json", 
     				success: function(data){
						
						
						$.each(data.Tracks, function(i,song){
							
							
							var medianetID = song.MnetId;
							var songTitle = song.Title;
							var songArtist = song.Artist.Name;
							var duration = song.Duration;
							
							var songEntry = $("<div class='playlist_song clearfix ui-state-default' id='"+medianetID+"'>"+
												"<div class='song_add addSearchedSong'></div>"+
												"<div class='song_artist'>"+songArtist+"</div>"+
												"<div class='song_title'>"+songTitle+"</div>"+
												"<div class='song_time'>"+duration+"</div>"+
											"</div>");
							
							
						
							songEntry.find("div.song_add").bind("click",function(){addSongToPlaylist('medianet',medianetID,songArtist,songTitle,duration);});
							$("#songSearchResult").append(songEntry);
						});
						enableSortable();
					}
					});

		}



$('.next').click(function(){

	currentid = $(this).parent().siblings('span').attr('id');
	direction = $(this).attr('id');
	nextPlaylist = getNextPlaylist(direction,currentid);
	$parent = $(this).parent().parent();
	
	if(nextPlaylist == null){
		return false;
	}
	
	if(eval(nextPlaylist.id) == 0 && $parent.attr('id') == 'editPlaylistHeader'){
		nextPlaylist = getNextPlaylist(direction,nextPlaylist.id);
	}
	
	populatePlaylistSongs(nextPlaylist);

});

function populatePlaylistSongs(nextPlaylist){
	
	id = nextPlaylist.id;
	name = nextPlaylist.name;

	$.getJSON('/getPlaylistSongs/', {id:id},
				function(data){
					if($('#playlistSongs').is(":visible")){
						$('#playlistSongs').html('');
					}else{
						$('#librarySongs').html('');
					}
					
					$.each(data , function(){
					
						var $song = $("<div class='playlist_song clearfix ui-state-default' id='"+this.id+"'>"+
										"<div class='song_up playlistSongUp'></div>"+
										"<div class='song_artist'>"+this.song__artist+"</div>"+
										"<div class='song_title'>"+this.song__title+"</div>"+
										"<div class='song_time'>"+this.song__duration+"</div>"+
										"<div class='delete'></div>"+
									"</div>");
							
						$song.find('.playlistSongUp').bind('click',function(){songUp($(this));});
						$song.find('.delete').bind('click',function(){deleteSong($(this).parent());});
						
						if($('#playlistSongs').is(":visible")){
							$('#playlistSongs').append($song);
						}else{
							$('#librarySongs').append($song);
						}		
						
					});
					enableSortable();
					if($('#playlistSongs').is(":visible")){
							$('#editPlaylistHeader').find('span').attr('id', id).html(name);
						}else{
							$('#playlistHeader').find('span').attr('id', id).html(name);
						}
					
				});
}

function getNextPlaylist(direction,id){
	var nextPlaylist;
	found = false;
	
	if(playlists.length == 1){
		return null;
	}
	
	if(direction == 'up'){
		playlists.reverse();
	}
	
	$.each(playlists, function(i){
		if(eval(found)){
					nextPlaylist = this;
					return false;
				}
		if(id == this.id){
				if(i == playlists.length-1){
					$.each(playlists, function(i){
						nextPlaylist = this;
						return false;
					});
				}
				found = true;	
		}		
	});
	if(direction == 'up'){
		playlists.reverse();
	}
	return nextPlaylist;
}




/*
Function for Sick and Kick
*/
/*
$.getJSON('/getSicks/', {songID : $('.current_song').attr('id')}, function(data){
	if(eval(data.success)){
		$.each(data.users, function(){
			$entry = $("<a id='"+this.user__id+"'><img src='https://graph.facebook.com/"+this.user__facebookid+"/picture?type=normal' title='"+this.user__firstName+" "+this.user__lastName+"' class='reflect rheight33 ropacity30' /></a>");
	
			$('#sickKickPeople').append($entry);
		});
	addReflections();
	}
});*/

$('#sickButton').click(function(){
	sickKickAction('sick');
});

$('#kickButton').click(function(){
	sickKickAction('kick');
});

function sickKickAction(action){
	updates();
	
	$.getJSON("/"+action+"/",
					
					function(data){
						
						if(eval(data.success) && eval(data.updated)){		
								
								lastSickUpdateTime = data.timeStamp;
								
								if(action == 'sick' && $('#sickKickPeople').find('a#'+data.id).size() == 0){
									$entry = $("<a id='"+data.id+"'><img src='https://graph.facebook.com/"+data.fid+"/picture?type=normal' title='"+data.firstName+" "+data.lastName+"' class='reflect rheight33 ropacity30' /></a>");
									/*$entry = $("<li class='item' id='"+data.id+"'>"+
												"<img src='https://graph.facebook.com/"+data.fid+"/picture?type=normal' class='reflect rheight33 ropacity30' />"+
												"<div class='saying'>Rock On</div>"+
											"</li>");
									*/
									$('#sickKickPeople').append($entry);	
									addReflections();
								}
								
								if(action == 'kick'){
									$('#sickKickPeople').find('a#'+data.id).remove();
								}
							}
						}	
			);
}




/*
GETS UPDATES FOR CHAT AND DJ LIST
*/
setInterval(updates, 5000);
function updates(){
	
	if($("#chatMessages").children().size() == 0){
		chatID = 0;
	}else{
		chatID = $("#chatMessages").children(':last').attr('id');
	}
	
	$.ajax({url:'/updates/', async:false, dataType:'json', data:{chatID : chatID, djListTimeStamp : lastDJListUpdateTime, sickTimeStamp : lastSickUpdateTime}, success : reflectUpdates});
}

function reflectUpdates(data){
	
	count = $('#djList').children().size();
	
	if(eval(data.success)){
		
		lastDJListUpdateTime = data.timeStamp;
		lastSickUpdateTime = data.timeStamp;
		chats = data.chats;
		djListUpdates = data.djList;
		sicks = data.sicks;
		
		$.each(chats,function(){
			
			var chatMessage = $("<div class='message clearfix' id='"+this.id+"'>"+
								"<div class='message_img'>"+
									"<img src='https://graph.facebook.com/"+this.user__facebookid+"/picture?type=square' width=25 height=25/>"+
								"</div>"+
								"<div class='message_text'>"+
									"<span class='messager'>"+this.user__firstName+" "+this.user__lastName+": </span>"+
									"<span>"+this.message+"</span>"+
								"</div>"+
							"</div>");
			
			$('#chatMessages').append(chatMessage);
		});
		
		$.each(djListUpdates,function(i){
			
			$dj = $('#djList').find("div#"+this.user__id);

			if(eval(this.isAdded)){
			
				if($dj.size() == 0){
					var dj = $("<div class='position clearfix' id='"+this.user__id+"'>"+
									"<div class='position_number'>"+
										"<span class='number'>"+(count+i)+".</span>"+
									"</div>"+
									"<div class='position_name'><span class='name'>"+this.user__firstName+" "+this.user__lastName+"</span></div>"+
									"<div class='delete'></div>"+
								"</div>");
			
					$('#djList').append(dj);
				}
				
			}else{
			
				$dj.remove();
				if($dj.hasClass('self')){ $('#addToDJList').html('Add to list'); }	
					
			}
		});
		
		$.each(sicks, function(){
			if(this.isSick){
				if($('#sickKickPeople').find("a#"+this.user__id).size() == 0){
					$entry = $("<a id='"+this.user__id+"'><img src='https://graph.facebook.com/"+this.user__facebookid+"/picture?type=normal' title='"+this.user__firstName+" "+this.user__lastName+"' class='reflect rheight33 ropacity30' /></a>");
				}
				$('#sickKickPeople').append($entry);
			}else{
				$('#sickKickPeople').find("a#"+this.user__id).remove();
			}
		});
		
	}else{
		console.log('Error: Station updation error');
	}
}


});
	