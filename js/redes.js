
$(document).ready(function(){
	$(function() {
	var mostrarform=true;
	$("#gplus").click(function() {
		if (mostrarform){
			console.log("show")
			$("div" ).show("slow");
			mostrarform=false;
		}else{
			console.log("hide")
			$("div").hide("slow");
			mostrarform=true;
		}
	});
	});
    $("#enviar").click( function() {     // Con esto establecemos la acción por defecto de nuestro botón de enviar.
        if($("#nombre").val() == ""){
        alert("El campo Apellidos no puede estar vacío.");
        }else{
        	nombre=$("#nombre").focus().val();
        	alert(nombre+"lo que sale");
    	}
    });    
});

