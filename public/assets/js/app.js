var stockApp = angular.module('stockApp',[
	'ngRoute',
	'stockControllers'
]);

stockApp.config(['$routeProvider', '$locationProvider',
	function($routeProvider,$locationProvider) {
		//console.log($routeProvider);
		$routeProvider
		.when('/stocks', {
			templateUrl: '/views/stocks.html',
			controller: 'StockListCtrl'
		})
		.when('/stocks/:stockID', {
			templateUrl: '/views/info.html',
			controller: 'StockInfoCtrl'

		})
		.when('/',{
			templateUrl: '/views/index.html'
			
		})
		.when('/main',{
			templateUrl: '/views/main.html',
			controller: 'MainCtrl'
		})
		.when('/favorite',{
			templateUrl: '/views/favorite.html',
			controller: 'FavoriteCtrl'
		})
		.when('/register',{
			templateUrl: '/views/register.html'
			
		})
		.when('/simulator',{
			templateUrl: '/views/simulator.html',
			controller: 'SimulatorCtrl'
		})
		.otherwise({ redirectTo: '/'});

		$locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
	}
]);