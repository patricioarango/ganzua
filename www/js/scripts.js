$("#escanear").on('click',function(e) {
    e.preventDefault();
    getQrCode();
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

$(".pedir_email").hide();

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
        loguear_usuario_firebase();
       }
    });
    if (res === false){
      console.log("habla con el capo para que te habilite");
      cards_a_mostrar(['no_authorized_card']);
    }     
  });
}

function loguear_usuario_firebase(){
  console.log("guardando usuario firebase");
  var uid = window.localStorage.getItem("ganzua_uid");
  var deviceid = window.localStorage.getItem("ganzua_deviceid");
  var email = window.localStorage.getItem("ganzua_email");
  db.ref("appusers").set({
    uid: userId,
    deviceid: deviceid,
    email: email
  });
  window.location.href = "http://autowikipedia.es/google_login/index/" + uid;  
}

function mostrar_card(cards_a_mostrar){
  //cards de sitio
  cards = ["principal_card","no_authorized_card","user_card","devices_card","escanear_card"];
  $.each(cards, function(i, card) {
     $("#"+card).hide();
  });

  $.each(cards_a_mostrar, function(i, card) {
     $("#"+card).show();
  });  
}





