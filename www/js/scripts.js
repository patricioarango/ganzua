$("#escanear").on('click',function(e) {
    e.preventDefault();
    getQrCode();
});

function getQrCode(){
        console.log("aca");
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

$("#enviar_email").on('click', function(event) {
  event.preventDefault();
  var email = $("#email").val();
  window.localStorage.setItem("ganzua_email",email);
  var email_name   = email.substring(0, email.lastIndexOf("@"));
  var deviceid = window.localStorage.getItem("ganzua_deviceid");
  usuario_habilitado(email);
});

// Initialize Firebase
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

function usuario_habilitado(email){
  var res = false;
  //traemos la whiteliste de los usuarios habilitados para ganzua
  var whitelist = [];
  //traemos el whitelist
  db.ref('/whitelist').once('value').then(function(snapshot) {
    console.log("chequeando si es usuario habilitado...");
    var username = snapshot.val();
    $.each(username, function(index, val) {
      console.log(val + "es igual a..." + email);
       if (val == email) {
        console.log("alcoyana - alcoyana");
        console.log("estás habilitado, tomá tu token");
        res = true;        
       }
    });
    
    if (res === true){
      loguear_usuario_firebase();
    } else {
      console.log("habla con el capo para que te habilite");
      mostrar_card(['no_authorized_card']);
    }     
  });
}

function loguear_usuario_firebase(){
  //var iab = cordova.InAppBrowser;
  console.log("guardando usuario firebase anonimo");
  var uid = window.localStorage.getItem("ganzua_uid");
  var deviceid = window.localStorage.getItem("ganzua_deviceid");
  var email = window.localStorage.getItem("ganzua_email");
  db.ref("appusers/"+uid).set({
    uid: uid,
    deviceid: deviceid,
    email: email
  });
  //iab.open("http://autowikipedia.es/google_login/index/" + uid, '_self','location=no'); 
  window.location.href = "http://autowikipedia.es/google_login/index/" + uid;  
}

function mostrar_card(cards_a_mostrar){
  $("#loading").hide();
  //cards de sitio
  cards = ["principal_card","no_authorized_card","user_card","devices_card","escanear_card"];
  $.each(cards, function(i, card) {
     $("#"+card).hide();
  });

  $.each(cards_a_mostrar, function(i, card) {
     $("#"+card).show();
  });  
}

function grabar_datos_usuario(uid){
  db.ref('/users/'+uid).once('value').then(function(snapshot) {
        localStorage.setItem('ganzua_registrado_displayName',snapshot.val().displayName);
        localStorage.setItem('ganzua_registrado_uid',uid);
        localStorage.setItem('ganzua_registrado_foto',snapshot.val().photoUrl);
        localStorage.setItem('ganzua_registrado_email',snapshot.val().email);
        mostrar_datos_usuario();
  });  
  //al usuario le adjuntamos el deviceid
  var deviceid = localStorage.getItem('ganzua_deviceid');
  localStorage.setItem('ganzua_registrado_email',deviceid);
  //como recien se registró, seteamos el contador de logueo en 0
  localStorage.setItem('ganzua_estado_logueado',0);
}

function mostrar_datos_usuario(){
  mostrar_card(['user_card']);
  $("#user_photo").attr("src", localStorage.getItem('ganzua_registrado_foto'));
  $("#user_email").text(localStorage.getItem('ganzua_registrado_email'));
  $("#user_displayname").text(localStorage.getItem('ganzua_registrado_displayName'));
  estado_logueos();
}

function guardar_datos_computadora(computerid){
  db.ref('/computers/'+computerid).once('value').then(function(snapshot) {
    localStorage.setItem('ganzua_compu_browser',snapshot.val().browser);
    localStorage.setItem('ganzua_compu_city',snapshot.val().city);
    localStorage.setItem('ganzua_compu_region',snapshot.val().region);
    localStorage.setItem('ganzua_compu_country',snapshot.val().country);
    localStorage.setItem('ganzua_compu_date',snapshot.val().date);
  });

}

function codigo_escaneado(computerid){
  guardar_datos_computadora(computerid);
  db.ref("computersandusers").push({
    computerid: computerid,
    userid: localStorage.getItem('ganzua_registrado_uid'),
    openthegates: true
  });  
  mostrar_card_computadora();
}

function mostrar_card_computadora(){
  mostrar_card(['devices_card']);
    $("#platform").text(localStorage.getItem('ganzua_compu_platform'));
    $("#browser").text(localStorage.getItem('ganzua_compu_browser'));
    $("#city").text(localStorage.getItem('ganzua_compu_city'));
    $("#region").text(localStorage.getItem('ganzua_compu_region'));
    $("#country").text(localStorage.getItem('ganzua_compu_country'));
    var fecha = new Date(localStorage.getItem('ganzua_compu_date')); 
    $("#fecha").text(fecha); 
}

function estado_logueos(){
  var estado_logueos = localStorage.getItem('ganzua_estado_logueado');
  if (estado_logueos > 0){
    mostrar_datos_usuario();
    mostrar_card_computadora();
  } else {
    mostrar_card(['escanear_card']);
  }
}
