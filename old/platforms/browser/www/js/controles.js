/* 
aplicacion.filter('getById', function() {
  return function(input, id) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (+input[i].id == +id) {
        return input[i];
      }
    }
    return null;
  }
});

aplicacion.factory('registroCantidadVentas',function(){
  var items = [];
  var itemsService = {};

  if (localStorage.getItem("laslilas_nro_ventas") === null) {
    localStorage.setItem("laslilas_nro_ventas",0);
  }

  itemsService.add = function() {
    var nro_vta = localStorage.getItem("laslilas_nro_ventas");
    var nueva_vta = (Number(nro_vta) + Number(1));
    localStorage.setItem("laslilas_nro_ventas", nueva_vta);
    items[0] = nueva_vta;
  };

  itemsService.list = function() {
    items[0] = localStorage.getItem("laslilas_nro_ventas");
      return items;
  };

  itemsService.delete = function() {
    var nro_vta = localStorage.getItem("laslilas_nro_ventas");
    var nueva_vta = (Number(nro_vta) - Number(1));
    if (nueva_vta < 0){
      nueva_vta = 0;
    }
    localStorage.setItem("laslilas_nro_ventas", nueva_vta);
    items[0] = nueva_vta;
  };

  return itemsService;
});

aplicacion.factory('registroVentas',function(){

  if (localStorage.getItem("laslilas_nro_ventas") >= 1){
    var items = JSON.parse(localStorage.getItem("laslilas_listado_ventas"));
  } else {
    var items = [];
  }
    
  var itemsService = {};
    
  itemsService.add = function(detalle) {
    var venta = {};
    var nro_vta = localStorage.getItem("laslilas_nro_ventas");
    ventaid = nro_vta;
    ventaid2 = "ventaid_" + nro_vta;
    detalle.ventaidparaborrar = nro_vta;
    venta[ventaid2] = detalle;
    items.push(venta);
    localStorage.setItem("laslilas_listado_ventas",JSON.stringify(items));
  };

  itemsService.delete = function(key) {
    delete items[key];
    localStorage.setItem("laslilas_listado_ventas",JSON.stringify(items));
  };

  itemsService.list = function() {
    var items = JSON.parse(localStorage.getItem("laslilas_listado_ventas"));
    return items;
  };
    
  return itemsService;
});

aplicacion.controller('carritoCtrl',['$scope','$location','$http','registroVentas','registroCantidadVentas', function($scope,$location,$http,registroVentas,registroCantidadVentas){

//localStorage.removeItem("laslilas_nro_ventas");
//localStorage.removeItem("laslilas_listado_ventas");
  
  listar();

  //listamos los pedidos
  function listar(){
    $scope.listado_ventas = registroVentas.list();

    var returnArr = [];
    angular.forEach($scope.listado_ventas, function(value,key) {
      angular.forEach(value, function(value2,key2) {
        value2.esteeselkeydelarray = key;
        returnArr.push(value2);
      });
    });
    $scope.listado_ventas = returnArr;

    $scope.no_ventas = true;
    if (returnArr.length >= 1){
      $scope.no_ventas = false;
    }

  }

  //para eliminar ventas
  $scope.borrarVenta = function(key){
    registroCantidadVentas.delete();
    registroVentas.delete(key);
    listar();
  }
}]);

aplicacion.controller('navegacionCtrl',['$scope','registroCantidadVentas', function($scope,registroCantidadVentas){
       $scope.ventasActuales = registroCantidadVentas.list();
}]);

aplicacion.controller('catalogoCtrl',['$scope','$location','$http', function($scope, $location,$http){
    //localStorage.setItem("rc2016_firstime","0");
     //localStorage.setItem("rc2016_nombre","");
     //localStorage.setItem("rc2016_email","");
    if (localStorage.getItem("rc2016_firstime") === null || localStorage.getItem("rc2016_firstime") == "0") {
      $scope.loginview = true;
    } else {  
      $scope.loginview = false;
    }

    $scope.submitForm = function() {
      localStorage.setItem("rc2016_firstime","1");
      localStorage.setItem("rc2016_nombre",$scope.user.name);
      localStorage.setItem("rc2016_email",$scope.user.email);
      window.location.reload();
    };

    //$scope.status= 'test';
    $http.get('razas.json').success(function(data){
      $scope.razas = data;

    });
  }]);

aplicacion.controller('subcatalogoCtrl',['$scope', '$routeParams', '$http','$sce','$rootScope',
    function($scope, $routeParams, $http,$sce,$rootScope) {
      $scope.id_raza = $routeParams.id_raza;
      $scope.nombre_raza = $routeParams.nombre_raza;
      $http.get('laslilas.json').success(function(data){
        $scope.catalogo = data;
      });
  }]);

aplicacion.controller('detalleCtrl',['$scope', '$routeParams', '$http','$sce','$rootScope','$filter','registroVentas','registroCantidadVentas',function($scope, $routeParams, $http,$sce,$rootScope,$filter,registroVentas,registroCantidadVentas) {
      $scope.id_toro = $routeParams.id_detalle;

      $http.get('laslilas.json').success(function(data){
        var found = $filter('getById')(data, $scope.id_toro);
        $scope.detalle = found;
      });
      //boton carrito agrega pedido
      $scope.botones_venta = true;
      $scope.agregarVenta = function (count){
        registroCantidadVentas.add();
        if ($scope.count < 1){
            $scope.count = 1;
        }
        $scope.detalle.cantidad_dosis = $scope.count;
        registroVentas.add($scope.detalle);
        $scope.botones_venta = false;
      };
      $scope.cant_dosis = function (tipo,count){
        if (tipo == "add"){
          $scope.count = count + 1;
        }
        if (tipo == "remove"){
          if (count <= 1){
            $scope.count = 1;
          } else {
            $scope.count = count - 1;
          }
        }
      }
}]);

aplicacion.controller('filtrosCtrl',['$scope', '$routeParams', '$http','$sce','$rootScope','$filter',
    function($scope, $routeParams, $http,$sce,$rootScope,$filter) {
      $http.get('laslilas.json').success(function(data){
        $scope.catalogo = data;
         for (var i = 0; i < $scope.catalogo.length; i++) {
            $scope.catalogo[i].precio = parseFloat($scope.catalogo[i].precio);
         };
      });
     $scope.order = function(predicate,reverse) {
    $scope.reverse = reverse;
    $scope.predicate = predicate;
  };


   $scope.colourIncludes = [];
    $scope.includeColour = function(colour) {
        var i = $.inArray(colour, $scope.colourIncludes);
        if (i > -1) {
            $scope.colourIncludes.splice(i, 1);
        } else {
            $scope.colourIncludes.push(colour);
        }
    }
    
    $scope.colourFilter = function(fruit) {
        if ($scope.colourIncludes.length > 0) {
            if ($.inArray(fruit.aptosvaquillonas, $scope.colourIncludes) < 0)
                return;
        }
        
        return fruit;
    }

  }]);
*/
aplicacion.controller('catalogoCtrl',['$scope','$location','$http', function($scope, $location,$http){

}]);

