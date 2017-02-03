
function get_apps_estados(){
	var email_id =  localStorage.getItem('ganzua_registrado_email_user');
	db.ref('/'+email_id).once('value').then(function(snapshot) {
    aplicaciones = snapshot.val();
    $.each(aplicaciones, function(index, app) {
    	$.each(app, function(index, value) {
    		$(".aplicaciones").html('<div class="card" id="devices_card">'+
              '<div class="row">'+
                '<div class="col s12"> '+
                  '<div class="card-content">'+
                  	'<span class="card-title">'+value+'</span>'+
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
    	} 
    }    
  });   
}