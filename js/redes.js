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
						messages.setAttribute("id", idmsg);
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
	function makeApiCallContact(uid) {
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
					var borrar="<button type='button' class='btn btn-danger borrar'>BORRAR</button>";
					//console.log(uid)
					$("#"+uid).children(".borrar").hide();
					var heading = "<div id ='"+uid+"'>"+img+name+genere+borrar+"</div>";
					$('#content').append(heading);
					makeApiCallActivities(uid);
				}
			});
	
		});
	};

	function addmark(lon, lat, idmsg, markers){
		var markercoord=[];
		//latlon=new google.maps.LatLng(lat, lon)
		//mapholder=document.getElementById('map')
		console.log("lon"+lon+"lat"+lat+"idmsg"+idmsg);
		id=idmsg
		var id=L.marker([lat,lon]).bindPopup(lat+"lon"+lon).addTo(map);
		markercoord.push(id);
		markercoord.push(idmsg);
		markercoordlist.push(markercoord);
		markers.addLayer(id);
		console.log(markers)
			//.bindPopup(idmsg).openPopup();



		//var popup = L.popup();
		
	}

	function onMapClick(e){
		marker=new L.Marker(e.latlng);
		map.removeLayer(marker);
	}

	function onRemove(map){
		map.removeLayer(markers);
	}

	function photoflickr(id, lat, lon){
		var NominatimAPI = 'http://nominatim.openstreetmap.org/reverse?json_callback=?';
	$.getJSON( NominatimAPI, {
		lat: lat,
		lon: lon,
		zoom: 27,
		addressdetails: 1,
		format: "json"
	})
	.done(function( data1 ) {
		var content = "<div id='addr" + id + "' class='markerinfo'><div class='address'><div>Lon: " + lon + "</div><div>Lat: " + lat + "</div><div>Address: " + data1.display_name + "</div></div><div class='imagenes'></div></div>"
		$("#markersinfo").append(content);
		var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
		$.getJSON( flickerAPI, {
			tags: data1.address.city,
			tagmode: "any",
			format: "json"
		})
		.done(function( data2 ) {
			$.each( data2.items, function( i, item ) {
				$( "<img/>" ).attr( "src", item.media.m ).appendTo("#addr"+id+" "+".imagenes");
			});
		});
	});
	}

	function selectmsg(id, lat, lon, markers){
	//map.removeLayer(markercoordlist[1].id markers[lat,lon]);
	console.log("here id "+id+" "+markers[markercoordlist[id]]);

		var myIcon = L.icon({
    iconUrl: 'images.png',
    iconRetinaUrl: 'images.png',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
    shadowUrl: 'marker-shadow.png',
    shadowRetinaUrl: 'marker-shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]
});
		map.removeLayer(L.marker([lat,lon]));// ,{icon: myIcon}).addTo(map);
		console.log("here");
		photoflickr(id, lat, lon);
		//L.marker([lat, lon]).removeFrom(map);//setIcon(iconUrl:"layers.png");
	}

$(document).ready(function(){
	crear_mapa();
	markers=new L.FeatureGroup();
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
	setTimeout(function(){
		var savedidlist = localStorage.getItem('idlist');
		if ((savedidlist==null) || (savedidlist.split(",")=="")){
			idlist=[]
		}else{
			idlist=savedidlist.split(",")
			$.each( idlist, function( index, value ) {
				makeApiCallContact(value);
				makeApiCallActivities(value);
			})
		}
	},1000)

	$("#formBody").submit( function(e) {
		e.preventDefault();
		if($("#rf_name").val() == ""){
			alert("El campo no puede estar vacío.");
		}else{
			hideform=true;
			$("#formContainer").hide("slow");
			uid = $("input").val();
			$("input").val("");
			idlist.push(uid);
			localStorage.setItem("idlist", idlist);
			makeApiCallContact(uid);
		};
	});
	
	


	$("#content").on('click', '.imagen',function() {  
		id=$(this).parent().attr("id");
		if($("#"+id).children(".activities").is(":hidden")){
			$("#"+id).children(".activities").show();
			$(this).parent().children(".activities").children(".msg").each(function(i){
				var lon = $(this).children(".location").children(".longitud").html();
				var lat = $(this).children(".location").children(".latitud").html();
				if (lon!=undefined && lat!=undefined){
					addmark(lon, lat, $(this).attr("id"), markers);
				}
			})
			map.addLayer(markers);
		}else{
			$("#"+id).children(".activities").hide();
			onRemove(map);
		}
	});

	$("#content").on("mouseenter", ".imagen", function(){
		if($(".borrar").is(":hidden")){
		$(".borrar").show();
	}else{
		$(".borrar").hide();
	}
	})
	
	$("#content").on('click', '.borrar',function() {  
		id=$(this).parent().attr("id");
		$("#"+id).remove();
		//id.remove();
		idlist.splice(idlist.indexOf(id,1));
		localStorage.setItem('idlist', idlist);
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
			selectmsg(id, lat, lon,markers);
		}else{
			console.log("hide");
			$("#"+id).children(".location").hide();
			$("#markersinfo").html("");
			var lon = $(this).children(".location").children(".longitud").html();
			var lat = $(this).children(".location").children(".latitud").html();
			L.marker([lat,lon]).addTo(map);
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

