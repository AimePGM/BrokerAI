var stockControllers = angular.module('stockControllers',[]);

stockControllers.controller('StockListCtrl', ['$scope', '$http',
	function($scope, $http) {
		// $http.get('http://localhost:3000/lib/stocks.json').success(function(data) {
		// 	$scope.stocks = data;
		// 	console.log($scope.stocks);
		// });
		$scope.stocks = [
			{
			"id": 1,
			"stock_name": "AAPL",
			"stock_fullname": "APPLE",
			"category": "IT",
			"daily_predict": "up",
			"daily_predict_price": "10.85",
			"weekly_predict": "up",
			"weekly_predict_price": "11.05",
			"monthly_predict": "down",
			"monthly_predict_price": "9.69",
			"daily_predict_percent": "47%",
			"weekly_predict_percent": "49%",
			"monthly_predict_percent": "43%"
			},
			{
			"id": 2,
			"stock_name": "ONFC",
			"stock_fullname": "Oneida Financial Corp.",
			"category": "IT",
			"daily_predict": "down",
			"daily_predict_price": "6.24",
			"weekly_predict": "up",
			"weekly_predict_price": "6.30",
			"monthly_predict": "down",
			"monthly_predict_price": "6.19",
			"daily_predict_percent": "20%",
			"weekly_predict_percent": "25%",
			"monthly_predict_percent": "21%"
			},
			{
				"id": 3,
				"stock_name": "SFXE",
				"stock_fullname": "SFX Enterainment, Inc.",
				"category": "Movie",
				"daily_predict": "down",
				"daily_predict_price": "1.09",
				"weekly_predict": "up",
				"weekly_predict_price": "1.30",
				"monthly_predict": "up",
				"monthly_predict_price": "1.54",
				"daily_predict_percent": "12%",
				"weekly_predict_percent": "5%",
				"monthly_predict_percent": "7%"
			},
			{
				"id": 4,
			  "stock_name": "JAKK",
			  "stock_fullname": "JAKKS Pacific, Inc.",
			  "category": "Logistics",
			  "daily_predict": "up",
			  "daily_predict_price": "20.07",
			  "weekly_predict": "up",
			  "weekly_predict_price": "19.98",
			  "monthly_predict": "up",
			  "monthly_predict_price": "20.09",
			  "daily_predict_percent": "2%",
			  "weekly_predict_percent": "5%",
			  "monthly_predict_percent": "11%"
			}
		]
	}
]);

stockControllers.controller('StockInfoCtrl', ['$scope', '$routeParams',
	function($scope, $routeParams) {
		$scope.stockID = $routeParams.stockID;
	}
]);
