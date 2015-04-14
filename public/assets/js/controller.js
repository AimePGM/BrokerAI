var stockControllers = angular.module('stockControllers',[]);

stockControllers.controller('StockListCtrl', ['$scope', '$http',
	function($scope, $http) {
		$http.get('/lib/stocks.json').success(function(data) {
			$scope.stocks = data;
			console.log($scope.stocks);
		});
	}
]);

stockControllers.controller('StockInfoCtrl', ['$scope', '$routeParams',
	function($scope, $routeParams) {
		$scope.stockID = $routeParams.stockID;
	}
]);
