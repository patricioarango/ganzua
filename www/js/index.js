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
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        estaLogueado();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    } 
};


$("#escanear").on('click',function(e) {
    e.preventDefault();
    getQrCode();
});

$("#loguearUsuario").on('click',function(e) {
    e.preventDefault();
    loguearUsuario();
});

function getQrCode(){
        console.log("aca");
        cordova.plugins.barcodeScanner.scan(
      function (result) {
          alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
      }, 
      function (error) {
          alert("Scanning failed: " + error);
      },
      {
          "preferFrontCamera" : true, // iOS and Android
          "showFlipCameraButton" : true, // iOS and Android
          "prompt" : "Place a barcode inside the scan area", // supported on Android only
          "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          "orientation" : "portrait" // Android only (portrait|landscape), default unset so it rotates with the device
      }
   );
}


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("logueado");
    console.log(user);
  } else {
    console.log(" no logueado mantenido");
  }
});

function loguearUsuarioGoogle(){
  $("body").addClass('fondo');
  window.plugins.googleplus.login(
          {},
          function (obj) { 
            mostrarPerfil(obj);
          },
          function (msg) {
            loguearUsuarioGoogle();
          }
  );
}

function estaLogueado(){
      window.plugins.googleplus.trySilentLogin(
          {},
          function (obj) { 
            mostrarPerfil(obj);
          },
          function (msg) {
            loguearUsuarioGoogle();
          }
      );  
}

function desloguearUsuario(){
  firebase.auth().signOut().then(function(result) {
    console.log(result);
      console.log("aca");
      window.location.reload();
  });
}

function mostrarPerfil(data){

}

function showIndex(){

}

function showProfile(){

}
