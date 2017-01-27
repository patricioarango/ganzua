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
            var registrado = "0";
            mostrar_card("principal_card");
        } else {
            var registrado = localStorage.getItem("ganzua_registrado");
        }
        //firebase cloud notification 
        window.FirebasePlugin.onTokenRefresh(function(token) {
                // save this server-side and use it to push notifications to this device
                console.log(token);
                window.localStorage.setItem("ganzua_fire_msg_token",token);
                //guardar_token(token);
              }, function(error) {
                window.FirebasePlugin.getToken(function(token) {
                    // save this server-side and use it to push notifications to this device
                    console.log(token);
                    window.localStorage.setItem("ganzua_fire_msg_token",token);
                    //guardar_token(token);
                  }, function(error) {
                    console.error(error);
                  });                
                console.error(error);
              });

        window.FirebasePlugin.onNotificationOpen(function(notification) {
          console.log(notification);
          console.log("aca recibimos la notificacion");
                            console.log("llego el mensaje");
                  localStorage.setItem("ganzua_registrado",1);
                  console.log('e.payload');
                  console.log(e.payload.data.uid);
                  grabar_datos_usuario(e.payload.data.uid);
        }, function(error) {
          console.error(error);
        });
    }//deviceready    
};//app

function insertar_id(url,deviceid){
    console.log("estoy adentro de insertar_id");
    window.localStorage.setItem("ganzua_deviceid",deviceid);
    mostrar_card(['principal_card']);    
    
    $.post(url, function(data) {
        if (data == "ok"){
            console.log("insercion deviceid correcta");
            window.localStorage.setItem("ganzua_deviceid",deviceid);
            mostrar_card(['principal_card']);
        }
    });
}

function mostrar_card(cards_a_mostrar){
  $("#loading").hide();
  //cards de sitio
  cards = ["principal_card","no_authorized_card","user_card","devices_card","escanear_card"];
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
    verificar_usuario();
});

function verificar_usuario(){
  console.log("guardando usuario firebase anonimo");
  var uid = window.localStorage.getItem("ganzua_uid");
  var deviceid = window.localStorage.getItem("ganzua_fire_msg_token");
  db.ref("appusers/"+uid).set({
    uid: uid,
    deviceid: deviceid,
    //email: email
  });
  window.location.href = "http://autowikipedia.es/ganzua_signup/index/" + uid;  
}

var config = {
  apiKey: "AIzaSyBvt5tGBZb3uaqZnjLmAOWFPtJcGd1nSGo",
  authDomain: "ganzua-eea1d.firebaseapp.com",
  databaseURL: "https://ganzua-eea1d.firebaseio.com",
  storageBucket: "ganzua-eea1d.appspot.com",
};
  var appfire = firebase.initializeApp(config);
  var db = appfire.database();

appfire.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});

firebase.auth().onAuthStateChanged(function(user) {
  console.log("logueando usuario anonimo");
  if (user) {
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    window.localStorage.setItem("ganzua_uid",uid);
  } else {
    // User is signed out.
    // ...
  }
  // ...
});