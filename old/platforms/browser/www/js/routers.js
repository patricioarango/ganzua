 var aplicacion = angular.module('App', ['ngRoute','ngAnimate']);
 aplicacion.config(function ($compileProvider){
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    }).config(function ($routeProvider) {
    $routeProvider
        .when('/', {
              templateUrl : 'catalogo.html',
              controller  : 'catalogoCtrl'
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