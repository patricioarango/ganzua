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

$("#google_login").on('click', function(event) {
  event.preventDefault();
  window.plugins.googleplus.login(
            {},
            function (obj) { 
              alert(obj);
            },
            function (msg) {
              alert(msg);
            }
    );
});

function estaLogueado(){ console.log("loguewsfdf");
      window.plugins.googleplus.trySilentLogin(
          {},
          function (obj) { console.log("aca");
            mostrarPerfil(obj);
          },
          function (msg) {
            loguearUsuarioGoogle();
          }
      );  
}