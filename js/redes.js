$(function() {
    $( "#tabs" ).tabs({
    	collapsible: true
    });
  });
$(document).ready(function(){
	
	var clientId = '723696862579-1d0lvs6pl2pjii76b4jjbvi6d79ioii9.apps.googleusercontent.com';
	var apiKey = 'AIzaSyAK4rM-onc6FhAUZy6e7Bmqsxvha4PGW2s';
	var scopes = 'https://www.googleapis.com/auth/plus.me';
	var uid;
	
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

    $("#formBody").submit( function(e) {    // Con esto establecemos la acción por defecto de nuestro botón de enviar.
    	e.preventDefault();
        if($("#rf_name").val() == ""){
        	alert("El campo no puede estar vacío.");
        }else{
        	//esconder el formulario
        	hideform=true;
        	$("#formContainer").hide("slow");
        	//coger los datos del formulario
        	uid = $("input").val();
			$("input").val("");
			handleClientLoad();
		};
    });
	function handleClientLoad() {
		gapi.client.setApiKey(apiKey);
		window.setTimeout(checkAuth, 1);
	}

	function checkAuth() {
		gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
	}

	function handleAuthResult(authResult) {
		var authorizeButton = document.getElementById('authorize-button');
		if (authResult && !authResult.error) {
		//	authorizeButton.style.visibility = 'hidden';
			makeApiCall();
		} else {
			authorizeButton.style.visibility = '';
			authorizeButton.onclick = handleAuthClick;
		}
	}

	function handleAuthClick(event) {
		gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
		return false;
	}

	// Load the API and make an API call.Display the results on the screen.
	function makeApiCall() {
		console.log("makeApiCall")
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
					//console.log(uid)
					var heading = "<div id ='"+uid+"'>"+img+name+genere+"</div>";
					$('#content').append(heading);
				}
			});
			/*Actividad*/
			var request2 = gapi.client.plus.activities.list({
				'collection': 'public',
				'userId': uid,
			});
			request2.execute(function(resp) {
				var listing = $('<ul>');
				for (i=0;i<resp.items.length;i++) {
					var item = $('<li>');
					listing.append(item);
					item.attr('id', resp.items[i].id);
					item.html(resp.items[i].title)
					if (resp.items[i]['location'] != undefined) {
						console.log("here")
						var item = document.createElement('li');
						listing.appendChild(item);
						item.appendChild(document.createTextNode(resp.items[i].location.position.latitude))
						var item = document.createElement('li');
						listing.appendChild(item);
						item.appendChild(document.createTextNode(resp.items[i].location.position.longitude))
					}
					$('#comments').append(listing);
				}
			});
		});
	};
	$("#content").on('click', '.imagen',function() {   
		alert("here")
    });
    
	//para el formulario que salga con la biblioteca flouplabels
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




