(function() {
  var app = angular.module('initDB', ['ngSanitize']);
  var db;
  var shortName = 'rc2016_ajs';
  var version = '1.0';
  var displayName = 'rc2016_ajs';
  var maxSize = 65535;

  
  db = window.openDatabase(shortName, version, displayName, maxSize);

  app.controller('StoreController', function($scope, $http){
    var self = this;
console.log("aca");
    
        $scope.products = [
    {'name': 'Nexus S',
     'snippet': 'Fast just got faster with Nexus S.',
     'age': 1},
    {'name': 'Motorola XOOM™ with Wi-Fi',
     'snippet': 'The Next, Next Generation tablet.',
     'age': 2},
    {'name': 'MOTOROLA XOOM™',
     'snippet': 'The Next, Next Generation tablet.',
     'age': 3}
  ];

      
  })



})();
