
function get_apps_estados(){
	var email_id =  localStorage.getItem('ganzua_registrado_email_user');
	db.ref('ur_apps/'+email_id).once('value').then(function(snapshot) {
    	aplicaciones = snapshot.val();
	    $(".aplicaciones").html("");
	    $.each(aplicaciones, function(index, app) { console.log("app");
	    		$(".aplicaciones").append('<div class="card" id="devices_card">'+
	              '<div class="row">'+
	                '<div class="col s12"> '+
	                  '<div class="card-content">'+
	                  	'<span class="card-title  black-text">'+index+'</span>'+
	                    '<div class="valign-wrapper">'+
	                      '<i class="material-icons large">important_devices</i>'+
	                      '<span class="card-title black-text valign" style="margin-left:0.5em;"><span id="platform">Windows</span>/<span id="browser">Chrome</span></span>'+
	                    '</div>'+
	                    '<div class="right-align">'+
	                      '<p id="fecha">Martes 17 de Julio de 2016</p>'+
	                      '<p><span id="city">CABA</span>, <span id="region">Buenos Aires</span> (<span id="country">Argentina</span>)</p> '+
	                    '</div>'+              
	                  '</div>'+
	                '</div>'+
	              '</div>'+
	              '<div class="row">'+
	                '<div class="card-action col s12">'+
	                  '<div class="white-text right"><a href="#"> Logout from This <i class="material-icons">power_settings_new</i></a></div>'+
	                '</div>'+
	              '</div>'+
	            '</div>');
	    	
	    	$.each(app, function(index, value) {
	    		//console.log("aca la data de cada app");
	    		//console.log(value);
	    	}); 
	    });    
  });   
}


$("#escanear").on('click',function(e) {
    e.preventDefault();
    getQrCode();
});

function getQrCode(){
        cordova.plugins.barcodeScanner.scan(
      function (result) {
          codigo_escaneado(result.text);
        /*
          alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
        */        
      }, 
      function (error) {
          alert("Scanning failed: " + error);
      },
      {
          "preferFrontCamera" : true, // iOS and Android
          "showFlipCameraButton" : true, // iOS and Android
          "prompt" : "Escanea el codigo de barras del sitio", // supported on Android only
          "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          "orientation" : "portrait" // Android only (portrait|landscape), default unset so it rotates with the device
      }
   );
}

function codigo_escaneado(computerid){
    db.ref('/computers/'+computerid).once('value').then(function(snapshot) {
    	app = snapshot.val();
    	//chequeamos si el site que viene en la computadora está habilitado para el usuario
		chequear_ur_app_habilitada(app);    
  });
}

function chequear_ur_app_habilitada(app){
	var email_id =  localStorage.getItem('ganzua_registrado_email_user');
	db.ref('/ur_apps/'+email_id+'/'+app.site).once('value').then(function(snapshot) {
		habilitado = snapshot.val();
		if ($.isEmptyObject(habilitado)){ 
			navigator.notification.alert("No estás habilitado para entrar a esa Aplicación", ganzu_alertCallback, "Atención", "cerrar");
		} else {
			set_ur_computerid(app);
		}
	});
}

function ganzu_alertCallback(){
	return true;
}

function set_ur_computerid(app){
	var email_id =  localStorage.getItem('ganzua_registrado_email_user');
	db.ref('ur_apps/'+email_id+'/'+app.site).set('value')set({
          estado: "Supuestamente logueado",
          computerid: app.computerid,
          token: "token_generado",
          fecha: "fecha"
    });  
    db.ref('tokens_de_acceso/'+email_id+'/'+app.site).set('value')set({
          estado: "Supuestamente logueado",
          computerid: app.computerid,
          token: "token_generado",
          email_id: email_id,
          fecha: "fecha"    	
    });  
}