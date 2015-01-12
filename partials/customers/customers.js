'use strict';

angular.module('customers', ['ngTable']);

//Routers
myApp.config(function($stateProvider) {
  
  //Search Customers
  $stateProvider.state('customers', {
	url: '/customers',
    templateUrl: 'partials/customers/customers.html',
	data:{
		auth:true
	}
  });
  
  //Add Customer
  $stateProvider.state('addCustomer', {
	url: '/addCustomer',
    templateUrl: 'partials/customers/addCustomer.html',
	data:{
		auth:true
	}
  });
  
  //Customer Tab
  $stateProvider.state('customer', {
    url: '',
	abstract:true,
    templateUrl: 'partials/customers/customerTab.html',
	data:{
		auth:true
	}
  });

  //View customer
  $stateProvider.state('customer.view', {
    url: "/view/{id}",
    views: {
      "viewCustomer": {
        templateUrl: "partials/customers/viewCustomer.html",
        controller: 'viewCustomerController'
      }
    },
    resolve: {
      customerResolved: function(customerServices, $stateParams) {
        return customerServices.getCustomer($stateParams.id);
      }
    },
	data:{
		auth:true
	}
  });

  //Edit customer
  $stateProvider.state('customer.edit', {
    url: "/edit/{id}",
    views: {
      "editCustomer": {
        templateUrl: "partials/customers/editCustomer.html",
        controller: 'editCustomerController'
      }
    },
    resolve: {
      customerResolved: function(customerServices, $stateParams) {
        return customerServices.getCustomer($stateParams.id);
      }
    },
	data:{
		auth:true
	}
  });  
    
});

//Factories
myApp.factory('customerServices', ['$http', function($http) {

    var factoryDefinitions = {
	  getCustomers: function() {
        return $http.get('partials/customers/mock/customers.json').success(function(data) { return data; });
      },
	  addCustomer: function(customerReq) {
        return $http.post('partials/common/mock/success.json', customerReq).success(function(data) { return data; });
      },
	  getCustomer: function(customerId) {
        return $http.get('partials/customers/mock/get_customer.json?id=' + customerId).success(function(data) { return data; });
      },
	  updateCustomer: function(customerReq) {
        return $http.post('partials/common/mock/success.json', customerReq).success(function(data) { return data; });
      },
	}
	
    return factoryDefinitions;
  }
]);

//Controllers
myApp.controller('getCustomersController', ['$scope', 'customerServices', 'dataTable', function($scope, customerServices, dataTable) {
	customerServices.getCustomers().then(function(result){
		$scope.data = result.data;	
		if (!result.data.error) {			
			dataTable.render($scope, '', "customerstList", result.data.response);
		}	
	});
}]);

myApp.controller('addCustomerController', ['$scope', 'customerServices', '$location', function($scope, customerServices, $location) {
	$scope.addCustomer = function() {
		if ($scope.addCustomerForm.$valid) {	
			customerServices.addCustomer($scope.customer).then(function(result){
				$scope.data = result;
				if (!result.error) {	
					$location.path("/customers");
				}	
			});	
		}
	}
	
	$scope.cancel = function() {
		$location.path("/customers");
	}
}]);

myApp.controller('viewCustomerController', ['$scope', 'customerResolved', function($scope, customerResolved) {
	$scope.viewCustomer = customerResolved.data;
}]);

myApp.controller('editCustomerController', ['$scope', 'customerResolved', 'customerServices', '$location', '$state', function($scope, customerResolved, customerServices, $location, $state) {
  $scope.customer = customerResolved.data;
  
  $scope.updateCustomer = function() {
    if ($scope.editCustomerForm.$valid) {	     
	 customerServices.updateCustomer($scope.customer).then(function(result){
		$scope.data = result.data;
		if (!result.data.error) {
		   $state.transitionTo('customer.view', {
				id: $state.params.id
			});
		}
	 });			
    }
  };
  
  $scope.cancel = function() {
		$location.path("/customers");
  }
}]);