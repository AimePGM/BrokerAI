var stockApp = angular.module('stockApp',[
	'ngRoute',
	'stockControllers'
]);
console.log("one");

stockApp.config(['$routeProvider', '$locationProvider',
	function($routeProvider,$locationProvider) {
		//console.log($routeProvider);
		$routeProvider
		.when('/stocks', {
			templateUrl: '/views/stocks.html',
			controller: 'StockListCtrl'
		})
		.when('/stocks/:stockID', {
			templateUrl: 'info.html',
			controller: 'StockInfoCtrl'

		})
		.otherwise({ redirectTo: '/stocks'});

		$locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
	}
]);