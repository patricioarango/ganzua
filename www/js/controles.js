aplicacion.controller('mainController',['$scope','$location','$http', function($scope, $location,$http){
	$scope.loguearUsuarioGoogle = function(){
	window.plugins.googleplus.login(
          {},
          function (obj) { 
            alert(obj);
          },
          function (msg) {
            loguearUsuarioGoogle();
          }
  	);	
	}
}]);

aplicacion.controller('profileController',['$scope', '$routeParams', '$http','$sce','$rootScope',
    function($scope, $routeParams, $http,$sce,$rootScope) {

}]);







