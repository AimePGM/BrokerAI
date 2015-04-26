var stockApp = angular.module('stockApp',[
	'ngRoute',
	'stockControllers',
	'angularSpinner',
	'angucomplete-alt'
]);

stockApp.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
    usSpinnerConfigProvider.setDefaults({color: 'grey'});
}]);

stockApp.directive('ngEnter' , function(){
	return function(scope, element, attrs){
		element.bind("keydown keypree", function(event){
			if(event.which == 13){
				scope.$apply(function(){
					scope.$eval(attrs.ngEnter);
				});
				  event.preventDefault();
			}
		});
	}
});

stockApp.factory('authInterceptor', authInterceptor);

function authInterceptor($window){
	return{
		request: function(config){
			if($window.localStorage.token){
				config.headers.Authorization = 'JWT ' + $window.localStorage.token;
			}
			return config;
		}
	}
}

stockApp.config(['$routeProvider', '$locationProvider','$httpProvider',
	function($routeProvider,$locationProvider, $httpProvider) {
		$httpProvider.interceptors.push('authInterceptor');
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
			templateUrl: '/views/index.html',
			controller: 'LoginCtrl'
			
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
			templateUrl: '/views/register.html',
			controller: 'ResgisterCtrl'
			
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