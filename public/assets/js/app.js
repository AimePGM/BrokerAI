var stockApp = angular.module('stockApp',[
	'ngRoute',
	'stockControllers'
]);
console.log("one");

stockApp.config(['$routeProvider',
	function($routeProvider) {
		console.log($routeProvider);
		$routeProvider
		.when('/stocks', {
			templateUrl: '/views/stocks.html',
			controller: 'StockListCtrl'
		})
		.when('/stocks/:stockID', {
			templateUrl: 'info.html',
			controller: 'StockInfoCtrl'

		});
	}
]);