 var aplicacion = angular.module('App', ['ngRoute','ngAnimate']);
 aplicacion.config(function ($compileProvider){
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    }).config(function ($routeProvider) {
    $routeProvider
        .when('/', {
              templateUrl : 'catalogo.html',
              controller  : 'catalogoCtrl'
          })
        .when('/subcatalogo/:id_raza/nombre_raza/:nombre_raza', {
              templateUrl : 'subcatalogo.html',
              controller  : 'subcatalogoCtrl'
          })
          .when('/detalle/:id_detalle', {
              templateUrl : 'detalle.html',
              controller  : 'detalleCtrl'
          })
          .when('/filtros', {
              templateUrl : 'filtros.html',
              controller  : 'filtrosCtrl'
          })
          .when('/carrito', {
              templateUrl : 'carrito.html',
              controller  : 'carritoCtrl'
          });         
  });

/*angular.module('App', [])
.config(function ($compileProvider){
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})
.config(function ($routeProvider) {

    $routeProvider
    .when('/', {
        controller: TestCtrl,
        templateUrl: 'catalogo.html'
    })
    .when('/view', {
        controller: ViewCtrl,
        templateUrl: 'partials/view.html'
    });
});*/