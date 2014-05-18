$(function() {
	$( "#tabs" ).tabs({
		collapsible: true
	});
});

var clientId = '723696862579-1d0lvs6pl2pjii76b4jjbvi6d79ioii9.apps.googleusercontent.com';
	var apiKey = 'AIzaSyAK4rM-onc6FhAUZy6e7Bmqsxvha4PGW2s';
	var scopes = 'https://www.googleapis.com/auth/plus.me';
	var uid;

	var umark=[];
	markercoordlist=[];
	
function crear_mapa(){
	map = L.map('map', {
		zoom: 13
 	});
 	map.setView([40.2838, -3.8215],2);
 
	var osm = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map); 
	/*function selectorunselect(e){
		$.each( markercoordlist, function( index, value ) {
			console.log("index"+index+"value"+value)
			if (jQuery.inArray(e.feature.id, value)!=-1){ //en index 0 esta el id
				if ($("#"+value[1]).css("background-color")=="rgb(255, 255, 255)"){
					$("#"+value[1]).css("background-color", "#E0E3F1")
					$("#"+value[1]).children(".location").show("slow")
					getaddressphoto(value[1]);
					if ($("#markersinfo").is(":hidden")){
						$("#markersinfo").show();
					}
				}else{
					$("#"+value[1]).css("background-color", "rgb(255, 255, 255)")
					$("#"+value[1]).children(".location").hide("slow")
					$("#addr"+value[1]).remove();
					if ($("#markersinfo").html()==""){
						$("#markersinfo").hide();
					}
				}
			}
		});
	}*/
	//se añaden todas las marcas que se necesiten
	

	// segunda parte
		function onMapClick(e) {
			L.marker(e.latlng).addTo(map);
    		alert("You clicked the map at " + e.latlng);
		}
		map.on('click', onMapClick);
}
	function createnode(elem, id, nameclass, html){
		var item = document.createElement(elem);
		item.setAttribute("id",id);
		item.setAttribute('class', nameclass);
		item.innerHTML = html;
		return item
	}

	function makeApiCallActivities(uid){
		var markercoord=[];
		gapi.client.load('plus','v1', function(){
			var request=gapi.client.plus.activities.list({
				'collection': 'public',
				'userId': uid
			});
			
			umark.push(uid);
			request.execute(function(resp){
				var activities=document.createElement('div');
				activities.setAttribute('class', 'activities');
				for(i=0; i<resp.items.length;i++){
					idmsg++;
					var messages=document.createElement('div');
					divmessages=createnode("div", "", "contentmsg", resp.items[i].title);
					messages.appendChild(divmessages);
					if(resp.items[i]["location"]!=undefined){
						messages.setAttribute("class", "msg");
						messages.setAttribute("id", "msg"+idmsg);
						eleminfo=createnode("div", "", "locationinfo", "Localización")
						messages.appendChild(eleminfo);
						elem=createnode("div", "", "location", "")
						item=createnode("div", "", "latitud", resp.items[i].location.position.latitude)
						elem.appendChild(item);
						item=createnode("div", "", "longitud", resp.items[i].location.position.longitude)
						marcas=L.marker([resp.items[i].location.position.latitude, resp.items[i].location.position.longitude]);
						umark.push(marcas);
						elem.appendChild(item);
						messages.appendChild(elem);
					}else{
						messages.setAttribute("class", "msg");
						messages.setAttribute("id", "msg"+idmsg)
					}
					activities.appendChild(messages);
				}
				$("#" + uid ).append(activities);
				$("#" + uid ).children(".activities").children(".msg").children(".location").hide();
				$("#" + uid ).children(".activities").hide();
			})
		})
	}

	//muesta el usuario
	function makeApiCallContact() {
		gapi.client.setApiKey(apiKey);
		gapi.client.load('plus', 'v1', function(){
			var request = gapi.client.plus.people.get({
				'userId': uid
			});
			//perfil
			request.execute(function(resp) {
				if (resp.error){
					console.log(resp.error)
					$('#content').append("<p>Id does not exist: no image, name and genere</p>");
				}else{
					var img = "<img src='"+resp.image.url+"'class='imagen'>";
					var name = "<span> "+resp.displayName+" -";
					var genere = "- "+resp.gender+"</span>";
					var borrar="<div class=borrar>BORRAR</div>";
					//console.log(uid)
					var heading = "<div id ='"+uid+"'>"+img+name+genere+borrar+"</div>";
					$('#content').append(heading);
					makeApiCallActivities(uid);
				}
			});
	
		});
	};

	function addmark(lon, lat, idmsg){
		var markercoord=[];
		//latlon=new google.maps.LatLng(lat, lon)
		//mapholder=document.getElementById('map')
		console.log("lon"+lon+"lat"+lat+"idmsg"+idmsg);
		var marca=L.marker([lat, lon]).addTo(map);
		markercoord.push(marca);
		markercoord.push(idmsg);
		markercoordlist.push(markercoord);
			//.bindPopup(idmsg).openPopup();



		//var popup = L.popup();
		
	}

$(document).ready(function(){
	crear_mapa();
	
	idmsg=0;
	var hideform=true;
	$("#gplus").click(function() {
		if (hideform){
			console.log("show")
			$("#formContainer").show("slow");
			hideform=false;
		}else{
			console.log("hide")
			$("#formContainer").hide("slow");
			hideform=true;
		}
	});

	$("#formBody").submit( function(e) {
		e.preventDefault();
		if($("#rf_name").val() == ""){
			alert("El campo no puede estar vacío.");
		}else{
			hideform=true;
			$("#formContainer").hide("slow");
			uid = $("input").val();
			$("input").val("");
			makeApiCallContact();
		};
	});
	
	function onRemove(map){
		map.remove();
		crear_mapa();
	}


	$("#content").on('click', '.imagen',function() {  
		id=$(this).parent().attr("id");
		if($("#"+id).children(".activities").is(":hidden")){
			$("#"+id).children(".activities").show();
			$(this).parent().children(".activities").children(".msg").each(function(i){
				var lon = $(this).children(".location").children(".longitud").html();
				var lat = $(this).children(".location").children(".latitud").html();
				if (lon!=undefined && lat!=undefined){
					addmark(lon, lat, $(this).attr("id"));
				}
			})
		}else{
			$("#"+id).children(".activities").hide();
			onRemove(map);
		}
	});
	
	$("#content").on('click', '.borrar',function() {  
		id=$(this).parent().attr("id");
		$("#"+id).remove();
		//id.remove();
		onRemove(map);
	});

	$("#content").on('click', '.msg',function() {  
		id=$(this).attr("id");
		console.log(id);
		if($("#"+id).children(".location").is(":hidden")){
			console.log("show");
			$("#"+id).children(".location").show();
			var lon = $(this).children(".location").children(".longitud").html();
			var lat = $(this).children(".location").children(".latitud").html();
			console.log(lon);
			console.log(lat);
		}else{
			console.log("hide");
			$("#"+id).children(".location").hide();
		}
	});
	
	//para el formulario que salga con la biblioteca flowuplabels
	(function(){
		$('.FlowupLabels').FlowupLabels({
			/*
			These are all the default values
			You may exclude any/all of these options
			if you won't be changing them
			 */
			// Handles the possibility of having input boxes prefilled on page load
			feature_onInitLoad: false, 

			// Class when focusing an input
			class_focused: 		'focused',
			// Class when an input has text entered
			class_populated: 	'populated'	
		});
	})(); 
});

