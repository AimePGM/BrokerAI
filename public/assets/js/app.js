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

stockApp.directive("repeatPassword", function() {
    return {
        require: "ngModel",
        link: function(scope, elem, attrs, ctrl) {
            var otherInput = elem.inheritedData("$formController")[attrs.repeatPassword];

            ctrl.$parsers.push(function(value) {
                if(value === otherInput.$viewValue) {
                    ctrl.$setValidity("repeat", true);
                    return value;
                }
                ctrl.$setValidity("repeat", false);
            });

            otherInput.$parsers.push(function(value) {
                ctrl.$setValidity("repeat", value === ctrl.$viewValue);
                return value;
            });
        }
    };
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
			controller: 'StockListCtrl',
			title : 'Stocks'
		})
		.when('/stocks/:stockID', {
			templateUrl: '/views/info.html',
			controller: 'StockInfoCtrl',
			title : 'Stocks Info'

		})
		.when('/',{
			templateUrl: '/views/index.html',
			controller: 'LoginCtrl',
			title : 'Login'
			
		})
		.when('/main',{
			templateUrl: '/views/main.html',
			controller: 'MainCtrl',
			title : 'Home'
		})
		.when('/favorite',{
			templateUrl: '/views/favorite.html',
			controller: 'FavoriteCtrl',
			title : 'Favorite'
		})
		.when('/register',{
			templateUrl: '/views/register.html',
			controller: 'ResgisterCtrl',
			title : 'Register'
			
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