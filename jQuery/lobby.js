// JavaScript Document

$(document).ready(function(){
	
	/*
	CLUB SEARCH
	*/
	$("#clubSearch").focus(function(){
		if(!$(this).hasClass('on')){
			$(this).val("");
			$(this).addClass('on');
			}
		});
		
	$("#clubSearch").blur(function(){
		if($(this).val().trim() == ""){
			$(this).val("Search for a club");
			$(this).removeClass('on');
			}
		});	
		
	$("#clubSearch").keyup(function(e){
		searchClub($(this).val().trim());
		});	
		
	function searchClub(query){
		if(query== ""){
			$('#clubs .club_name').parent().parent().show();
			}else{
				for(i=0;i<$('#clubs .club_name').size();i++){
					if($('#clubs .club_name').eq(i).html().toLowerCase().indexOf(query.toLowerCase()) == -1){
						$('#clubs .club_name').eq(i).parent().parent().hide();
						}else{
							$('#clubs .club_name').eq(i).parent().parent().show();
						}
				}
			}
		}
		
	/*
	Sort By
	*/	
	$('#sortBy').change(function(){
		var sortType = $(this).val();
		var sortBy;
		var isNum=false;
		var direction='asc';
		if(sortType == "club_name"){
			sortBy='div.club span.club_name';
		}else if(sortType == "genre"){
			sortBy='div.club span.genres';
		}else if(sortType == "capacity"){
			sortBy='div.club span.capacity';
			isNum=true;
			direction='desc';
		}else if(sortType == "wait"){
			sortBy='div.club span.dj_wait';
			isNum=true;
			}
			
		
		$("#clubs").jSort({
        		sort_by: sortBy,
        		item: 'a.clubEntry',
        		order: direction,
				is_num: isNum
   	 			});
				
		});
	});