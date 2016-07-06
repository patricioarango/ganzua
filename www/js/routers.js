 var aplicacion = angular.module('App', ['ngRoute','ngAnimate']);
 aplicacion.config(function ($compileProvider){
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    }).config(function ($routeProvider) {
    $routeProvider
        .when('/', {
              templateUrl : 'main.html',
              controller  : 'mainController'
          })
        .when('/profile', {
              templateUrl : 'profile.html',
              controller  : 'profileController'
          });         
  });
