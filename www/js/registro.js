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
        }, function(error) {
          console.error(error);
        });
};//app

function guardar_token(token){
    //var token = window.localStorage.getItem("fire_msg_token"); 
   db.ref('/tokens/tokenid_'+token).set(token);  
}

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