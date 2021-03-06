/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */ 

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
    },onDeviceReady: function() {
        if (localStorage.getItem("ganzua_registrado") === null) {
            var registrado = 0;
             mostrar_card(['principal_card']);
        } else {
            var registrado = localStorage.getItem("ganzua_registrado");
            mostrar_datos_usuario_certificado();
        }

        if (registrado == 0) {
        $("#enviar_email").hide();  
        //firebase cloud notification 
        window.FirebasePlugin.onTokenRefresh(function(token) {
                // save this server-side and use it to push notifications to this device
                console.log(token);
                window.localStorage.setItem("ganzua_fire_msg_token",token);
                var uid = window.localStorage.getItem("ganzua_uid");
                guardar_usuario_anonimo(uid);
                //guardar_token(token);
              }, function(error) {
                window.FirebasePlugin.getToken(function(token) {
                    // save this server-side and use it to push notifications to this device
                    console.log(token);
                    window.localStorage.setItem("ganzua_fire_msg_token",token);
                    var uid = window.localStorage.getItem("ganzua_uid");
                    guardar_usuario_anonimo(uid);
                    //guardar_token(token);
                  }, function(error) {
                    console.error(error);
                  });                
                console.error(error);
              });
        }

            //aca manejamos la notificacion post logueo en google
            window.FirebasePlugin.onNotificationOpen(function(notification) {
              /*console.log(notification);
              console.log("notification.subtitle");
              console.log(notification.subtitle);
              console.log("notification.email_domain");
              console.log(notification.email_domain);*/
              
            }, function(error) {
              console.error(error);
            });
    }//deviceready    
};//app

function mostrar_card(cards_a_mostrar){
  $("#loading").hide();
  //cards de sitio
  cards = ["principal_card","no_authorized_card","user_card","escanear_card"];
  $.each(cards, function(i, card) {
     $("#"+card).hide();
  });

  $.each(cards_a_mostrar, function(i, card) {
    console.log("mostrando... #"+card);
     $("#"+card).show();
  });  
}

$("#enviar_email").on('click', function(event) {
  event.preventDefault();
  var uid = window.localStorage.getItem("ganzua_uid");
  window.location.href = "http://autowikipedia.es/ganzua_signup/pre_certificacion_usuario/" + uid;
  //navigator.app.exitApp(); 
});

function guardar_usuario_anonimo(uid){
  $("#enviar_email").show();
  console.log("guardando usuario firebase anonimo");
  var deviceid = window.localStorage.getItem("ganzua_fire_msg_token");
  db.ref("usuarios_anonimos/"+uid).set({
    uid: uid,
    deviceid: deviceid,
    //email: email
  });
}

var config = {
  apiKey: "AIzaSyBvt5tGBZb3uaqZnjLmAOWFPtJcGd1nSGo",
  authDomain: "ganzua-eea1d.firebaseapp.com",
  databaseURL: "https://ganzua-eea1d.firebaseio.com",
  storageBucket: "ganzua-eea1d.appspot.com",
};
  var appfire = firebase.initializeApp(config);
  var db = appfire.database();



appfire.auth().onAuthStateChanged(function(user) {
  console.log("logueando usuario anonimo");
  if (user) {
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    window.localStorage.setItem("ganzua_uid",uid);
    //guardar_usuario_anonimo(uid);
  } else {
      appfire.auth().signInAnonymously().catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  }
  // ...
});

  //aca esperamos que se inserte los usuarios registrados
  db.ref('/usuarios_registrados').on('value', function(snapshot) {
    if (window.localStorage.getItem("ganzua_registrado") === null) {
      var usuarios_registrados = snapshot.val();

      //traemos el email del usuario_anonimo para ver si el insert corresponde a este anonimo
      var email_user;
      var id_usuario_anonimo = window.localStorage.getItem("ganzua_uid");
      db.ref('/usuarios_anonimos/'+id_usuario_anonimo+'/email_user').once('value').then(function(snapshot) {
        email_user = snapshot.val(); 
        console.log("email_user"); 
        console.log(email_user); 
        
        if (email_user){ console.log("empieza comparacion");
          $.each(usuarios_registrados, function(index, usuario) {
            $.each(usuario, function(index, val) {
              if (val == email_user) {
                console.log("alcoyana - alcoyana");
                window.localStorage.setItem("ganzua_registrado",1);
                certificar_usuario(email_user);     
              }
            });
          });
        }        
      }); 
    }  
  });

function certificar_usuario(email_user){
  console.log("certificar_usuario");
  var deviceid = window.localStorage.getItem("ganzua_fire_msg_token");
  db.ref('/usuarios_registrados/'+email_user).once('value').then(function(snapshot) {
    var usuario = snapshot.val();
        localStorage.setItem('ganzua_registrado_displayName',usuario.displayName);
        localStorage.setItem('ganzua_registrado_google_id',usuario.google_id);
        localStorage.setItem('ganzua_registrado_foto',usuario.photoUrl);
        localStorage.setItem('ganzua_registrado_email',usuario.email);
        localStorage.setItem('ganzua_registrado_email_user',usuario.email_user);
        localStorage.setItem('ganzua_registrado_deviceid',deviceid);
        
        //como recien se registró, seteamos el contador de logueo en 0
        localStorage.setItem('ganzua_estado_logueado',0);
        get_apps_habilitadas_para_usuario_certificado();        
  });  
}

function get_apps_habilitadas_para_usuario_certificado(){
  var email_id =  localStorage.getItem('ganzua_registrado_email_user');
  db.ref('/whitelist/'+email_id).once('value').then(function(snapshot) {
    aplicaciones = snapshot.val();
    //primero borramos para que no queden apps viejas
    db.ref("ur_apps/"+email_id).remove();

    $.each(aplicaciones, function(index, app) {
      //buscamos la data de cada app
      db.ref('/apps/'+app).once('value').then(function(snapshot) {
      var app_data = snapshot.val();
      grabar_datos_usuario_servidor(app_data.app_url);    
      
          db.ref("ur_apps/"+email_id+"/"+app_data.app_id).set({
            computerid: "empty",
          }); 
      }); 
    });    
  });   
 mostrar_datos_usuario_certificado();
} 

function grabar_datos_usuario_servidor(app_url){
  console.log("respuesta registrar usuario db");
  var email = localStorage.getItem('ganzua_registrado_email');
  var deviceid = localStorage.getItem('ganzua_registrado_deviceid');
  $.post(app_url+'/ganzua_login/registrar_deviceid_usuario', {email: email, deviceid: deviceid}, function(data) {
    console.log(data);
  }).fail(function(error){ 
    console.log(error.responseText);
    Materialize.toast(error.responseText.texto, 4000); 
  });
}

function mostrar_datos_usuario_certificado(){
  mostrar_card(['user_card']);
  console.log("mostrar_card(['user_card']");
  $("#escanear_card").show();
  if (localStorage.getItem('ganzua_registrado_foto') != "sinfoto"){
    $("#user_photo").attr("src", localStorage.getItem('ganzua_registrado_foto'));
  }
  $("#user_email").text(localStorage.getItem('ganzua_registrado_email'));
  $("#user_displayname").text(localStorage.getItem('ganzua_registrado_displayName'));
  //get_apps_estados();
}