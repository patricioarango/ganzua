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

//login 
var lock = null;
$(document).ready(function() {
   lock = new Auth0Lock('At7v7fYN08g5FK3MY3c7LRmg44kgnNzN', 'patricioarango.auth0.com', {
       auth: { 
           params: { scope: 'openid email' } //Details: https://auth0.com/docs/scopes
       }
   });
});



$("#google_login").on('click', function(event) {
  lock.show();
});

lock.on("authenticated", function(authResult) {
  lock.getProfile(authResult.idToken, function(error, profile) {
    if (error) {
      // Handle error
      return;
    }
    console.log(profile);
    console.log('id_token', authResult.idToken);
    localStorage.setItem('id_token', authResult.idToken);
  });
});



function estaLogueado(){ 
 
}


$("#google_deslogin").on('click', function(event) {
    event.preventDefault();

});