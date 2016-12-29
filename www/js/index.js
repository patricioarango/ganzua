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
//variable para registro unico
//localStorage.setItem("ganzua_registrado",0);
if (localStorage.getItem("ganzua_registrado") === null) {
    var registrado = "0";
} else {
    var registrado = localStorage.getItem("ganzua_registrado");
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
    },onDeviceReady: function() {
        window.FirebaseAuthPlugin.signIn(function(token) {
                // save this server-side and use it to push notifications to this device
                console.log(token);
                
              },function(error) {
                         
                console.error(error);
              });
    }
};//app

