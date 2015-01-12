'use strict';

angular.module('reports', ['chart.js']);

//Routers
myApp.config(function($stateProvider) {
  $stateProvider.state('reports', {
	url: '/reports',
    templateUrl: 'partials/reports/reports.html',
	data:{
		auth:true
	}
  });
  
});

//Factories
myApp.factory('reportsServices', ['$http', function($http) {

    var factoryDefinitions = {
      getCustomersReports: function() {
        return $http.get('partials/reports/mock/customers_reports.json').success(function(data) { return data; });
      },
	  getOrdersReports: function() {
        return $http.get('partials/reports/mock/orders_reports.json').success(function(data, status, headers, config) { return data; });
      }
	}
	
    return factoryDefinitions;
  }
]);

//Controllers
myApp.controller('customersReportsController', ['$scope', 'reportsServices', function($scope, reportsServices) {
	reportsServices.getCustomersReports().then(function(result){
		$scope.data = result.data;	
	});
}]);

myApp.controller('ordersReportsController', ['$scope', 'reportsServices', function($scope, reportsServices) {
	reportsServices.getOrdersReports().then(function(result){
		$scope.data = result.data;	
	});
}]);