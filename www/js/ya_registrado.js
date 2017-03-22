
function get_apps_estados(){
	console.log("get_apps_estados");
	var email_id =  localStorage.getItem('ganzua_registrado_email_user');
	var datos_completos = {};
	db.ref('ur_apps/'+email_id).once('value').then(function(snapshot) {
    	aplicaciones = snapshot.val();
	    $(".aplicaciones").html("");
	    $.each(aplicaciones, function(nombre_app, app_computer) { 
	    	
	    		$.each(app_computer, function(computerid_key, computerid_value) {
					insertar_card_computadora(nombre_app, computerid_value);
	    		});	
	    		/*//acá si tiene computerid, buscamos esa data
		    	$.each(app_computer, function(computerid_key, computerid_value) {
		    		var datos_computadora = {};
		    		if (computerid_value != "empty"){
		    			db.ref('computers/'+computerid_value).once('value').then(function(snapshot) {
		    				datos_computadora = snapshot.val();
		    			});
		    		} else {
		    			datos_computadora = {};
		    		}
		    		//traemos el nombre de lectura de la app
		    		db.ref('/apps/'+nombre_app).once('value').then(function(snapshot) {
		    			datos_completos = snapshot.val();
		    			insertar_card_computadora(datos_completos.app_lectura,datos_computadora);
		    		});
				});*/
	    	
	    });    
  });   
}

function insertar_card_computadora(nombre_app,computerid){
	console.log("insertar_card_computadora");
	var datos_computadora = {};
	if (computerid != "empty"){
		db.ref('computers/'+computerid).once('value').then(function(snapshot) {
			datos_computadora = snapshot.val();
		});
	} 	
	db.ref('/apps/'+nombre_app).once('value').then(function(snapshot) {
		datos_completos = snapshot.val();
		var card_html = crear_card_computadora_html(datos_completos.app_lectura,datos_computadora);
		$(".aplicaciones").append(card_html);
	});	
}

function crear_card_computadora_html(nombre_app,datos_computadora){
	console.log("crear_card_computadora_html");
	var computadora;
	var action;
	var card_id = nombre_app;
	var icon;
	if ($.isEmptyObject(datos_computadora)){
		computadora = "";
		icon = '<i class="material-icons pink-text">lock_outline</i>';
		action =	'<div class="card-action">'+
			               '<div class="left"><a href="#" class="escanear"> Log In </div>'+
			            '</div>';
	} else {
		icon = "";
		computadora =	'<div class="valign-wrapper">'+
			                    '<i class="material-icons large">important_devices</i>'+
			                      '<span class="card-title black-text valign" style="margin-left:0.5em;"><span>'+datos_computadora.platform+'</span>/<span>'+datos_computadora.browser+'</span></span>'+
			                '</div>'+
		                    '<div class="right-align">'+
		                      '<p>'+datos_computadora.fecha+'</p>'+
		                      '<p><span>'+datos_computadora.city+'</span>, <span>'+datos_computadora.region+'</span> (<span>'+datos_computadora.country+'</span>)</p> '+
		                    '</div>';

		action =	'<div class="card-action">'+
			               '<div class="left"><a href="#" class="logout" data-app="'+datos_computadora.app_id+'"> Logout from This <i class="material-icons">power_settings_new</i></a></div>'+
			            '</div>';
	}

	var card = '<div class="row">'+
	    '<div class="col s12"> '+
			'<div class="card" id="'+card_id+'">'+
	      		'<div class="card-content">'+
	      			'<span class="card-title  black-text">'+nombre_app+' '+icon+'</span>'+
			computadora +
			'</div>'+	
			action +
	      '</div>'+
	    '</div>'+
	  '</div>';

	return card;

}

$(document).on('click','.escanear',function(e) {
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
          "preferFrontCamera" : false, // iOS and Android
          "showFlipCameraButton" : false, // iOS and Android
          "prompt" : "Escaneá el Código de QR de la Aplicación!", // supported on Android only
          "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          "orientation" : "portrait" // Android only (portrait|landscape), default unset so it rotates with the device
      }
   );
}

function codigo_escaneado(computerid){
    db.ref('/computers/'+computerid).once('value').then(function(snapshot) {
    	computer = snapshot.val();
    	//chequeamos si el site que viene en la computadora está habilitado para el usuario
		chequear_ur_app_habilitada(computer);    
  });
}

function chequear_ur_app_habilitada(computer){
	var email_id =  localStorage.getItem('ganzua_registrado_email_user');
	db.ref('/ur_apps/'+email_id+'/'+computer.app_id).once('value').then(function(snapshot) {
		habilitado = snapshot.val();
		if ($.isEmptyObject(habilitado)){ 
			navigator.notification.alert("No estás habilitado para entrar a esa Aplicación", ganzu_alertCallback, "Atención", "cerrar");
		} else {
			set_ur_computerid(computer);
		}
	});
}

function ganzu_alertCallback(){
	window.location.reload();
}

function set_ur_computerid(computer){
	var email_id =  localStorage.getItem('ganzua_registrado_email_user');
	var email =  localStorage.getItem('ganzua_registrado_email');
	var deviceid =  localStorage.getItem('ganzua_registrado_deviceid');
	var fecha = Date.now();
	$.post('http://autowikipedia.es/ganzua/create_login_token', {email_id: email_id,deviceid: deviceid,fecha: fecha}, function(token) {
		db.ref('ur_apps/'+email_id+'/'+computer.app_id).set({
	          computerid: computer.computerid,
	    });  
	    /*db.ref('tokens_de_acceso/'+email_id+'/'+computer.app_id).set({
	          computerid: computer.computerid,
	          token: token,
	          email_id: email_id,
	          email: email,
	          deviceid: deviceid,
	          fecha: fecha,    	
	    });*/
		db.ref('tokens_de_acceso').push({
			computerid: computer.computerid,
			token: token,
			email_id: email_id,
			email: email,
			deviceid: deviceid,
			fecha: fecha,    	
		});	
	});
}

//cuando se actualizan los datos de ingreso, actualizamos las cards
var email_id =  localStorage.getItem('ganzua_registrado_email_user');
db.ref('ur_apps/'+email_id).on('value', function(snapshot) {
	get_apps_estados();
});

$(document).on('click','.logout',function(e) {
    e.preventDefault();
	var app_id = $(this).data("app");
	desloguear(app_id);
});

function desloguear(app_id){
	var email_id =  localStorage.getItem('ganzua_registrado_email_user');
		db.ref('ur_apps/'+email_id+'/'+app_id).set({
	          computerid: "empty",
	    });	
}