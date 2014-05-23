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
					var img = "<img src='"+resp.image.url+"'class='media-object dp img-circle imagen'>";
					var name = "<span> "+resp.displayName+" -";
					var genere = "- "+resp.gender+"</span>";
					var borrar='<button type="button" class=" borrar btn btn-labeled btn-danger"><span class="btn-label"><i class="glyphicon glyphicon-trash"></i></span>Trash</button>';
					//console.log(uid)
              		var abajo='<i class="glyphicon glyphicon-chevron-down text-muted"></i>';
					var heading = "<div id ='"+uid+"'>"+img+name+genere+"</div>";
					$('#content').append(heading);
					$('#'+uid).append(borrar);
					$('#'+uid).append(abajo);
					$("#"+uid).children(".borrar").hide();
					makeApiCallActivities(uid);
				}
			});
	
		});
	};

	function addmark(lon, lat, idmsg, markers){
		var markercoord=[];
		id=idmsg
		var id=L.marker([lat,lon]).bindPopup("lat "+lat+" lon "+lon).addTo(map);
		markercoord.push(id);
		markercoord.push(idmsg);
		markercoordlist.push(markercoord);
		markers.addLayer(id);
		id.on("click", function(e){
			$.each(markercoordlist, function(index, value){
				if (jQuery.inArray(id, value)!=-1){
					idm=value[1];
					if($("#"+idm).children(".location").is(":hidden")){			
						$("#"+idm).css("background-color", "#AFEEEE")
						$("#"+idm).children(".location").show();
						var longitud=$("#"+idm).children(".location").children(".longitud").html();
						var latitud=$("#"+idm).children(".location").children(".latitud").html()
						$("#foto").show();
						photoflickr(idm, latitud, longitud);		
					}else{
						$("#"+idm).css("background-color", "")
						$("#"+idm).children(".location").hide();
						$("#markersinfo").html("");
						$("#foto").hide();
					}
				}
			})		
		})		
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

	function selectmsg(value, index){
		var marker=markercoordlist[index][0];
		marker.openPopup(marker.getLatLng());
		id=value[1];
		$("#"+id).css("background-color", "#AFEEEE")
		var longitud=$("#"+id).children(".location").children(".longitud").html();
		var latitud=$("#"+id).children(".location").children(".latitud").html()
		photoflickr(id, latitud, longitud);
	}

	function unselectmsg(value, index){
		console.log(value+"index"+index)
		var marker=markercoordlist[index][0];
		console.log(marker);
		marker.closePopup(marker.getLatLng());
		id=value[1];
		$("#"+id).css("background-color", "")
		var longitud=$("#"+id).children(".location").children(".longitud").html();
		var latitud=$("#"+id).children(".location").children(".latitud").html()
		$("#markersinfo").html("");
	}

$(document).ready(function(){
	$("#mapa").hide();
	$("#foto").hide();
	crear_mapa();
	markers=new L.FeatureGroup();
	idmsg=0;
	var hideform=true;

	$('.cycle').cyclotron();

    //$(".cycle").css('cursor', 'url(http://i.imgur.com/FrQFOJo.png),auto');

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
			add=true;
			$.each(idlist,function(index,value){
				console.log("index"+index+"value"+value+"uid"+uid);
				if(uid==value){
					add=false;
				};
			})
			if (add){
				idlist.push(uid);
				localStorage.setItem("idlist", idlist);
				makeApiCallContact(uid);	
			}else{
				alert("user ya añadido");
			}
			
		};
	});
	
	

	$("#content").on("click", ".imagen", function(){
		id=$(this).parent().attr("id");
		if($("#"+id).children(".borrar").is(":hidden")){
			$("#"+id).children(".borrar").show();
		}else{
			$("#"+id).children(".borrar").hide();
		}
		console.log(id);
	})
	
	$("#content").on('click', '.borrar',function() {  
		id=$(this).parent().attr("id");
		$("#"+id).remove();
		idlist.splice(idlist.indexOf(id,1));
		localStorage.setItem('idlist', idlist);
	});

	$("#content").on('click', '.glyphicon', function(){
		id=$(this).parent().attr("id");
		if($("#"+id).children(".activities").is(":hidden")){
			$("#"+id).children(".activities").show();
			$("#mapa").show();
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
			markers=new L.FeatureGroup();
			$("#mapa").hide();
		}		
	})

	$("#content").on('click', '.msg',function() {  
		id=$(this).attr("id");
		$.each(markercoordlist, function(index, value){
			if (jQuery.inArray(id, value)!=-1){
				if($("#"+id).children(".location").is(":hidden")){			
					$("#"+id).children(".location").show();
					console.log(id)
					$("#foto").show();
					selectmsg(value, index);					
				}else{
					$("#"+id).children(".location").hide();
					unselectmsg(value, index);
					$("#foto").hide();
				}
			}
		})		
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

