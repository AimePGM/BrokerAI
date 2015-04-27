var stockControllers = angular.module('stockControllers',[]);

stockControllers.controller('NavbarCtrl',['$scope', '$http','$window',
	function($scope, $http, $window){
		$http.get('http://128.199.105.21:8000/api/users/')
		.success(function(data){
				$scope.user = data;
				console.log(data);
		})
		.error(function(data, headers){
			console.log(data);
			console.log(headers);
		});

		$scope.logout = function() {
			console.log("removed");
      $window.localStorage.removeItem('token');
      window.location = "http://127.0.0.1:3000/";
    };
	}
]);

stockControllers.controller('StockListCtrl', ['$scope', '$http','usSpinnerService',
	function($scope, $http, usSpinnerService) {

		$scope.template={
			"navbar": "/views/navbar.html"
		}

		$scope.searchResult = function(){
			if(typeof $scope.selectedCompany === "undefined")
				return;
			window.location = "http://127.0.0.1:3000/stocks/"+$scope.selectedCompany.description.id+'/'
			console.log($scope.selectedCompany);
		}

		$scope.toggle = function(data){
			if( $("#"+data).hasClass("unfavButton") ){
				$scope.unfav(data);
			}else if( $("#"+data).hasClass("favButton") ){
				$scope.fav(data);
			}
		}

		$scope.unfav = function(data){
			var company_id = data;
			var post_fav = {};

			$http.get('http://128.199.105.21:8000/api/users/')
			.success(function(data){
				var temp = data;
				var formData = new FormData();
				formData.append("user_id",temp.id);
				formData.append("company_id",company_id);

				var req = {
				 method: 'DELETE',
				 url: 'http://128.199.105.21:8000/api/favorite/',
				 headers: {
				 },
				 data: formData
				} 
				$http(req).success(function(data){
					console.log(data);
					$("#"+company_id).addClass("favButton");
					$("#"+company_id).removeClass("unfavButton");
				})
				.error(function(data){
					console.log(data);
				})

			})
			.error(function(data){
			});
		}

		$scope.fav = function(data){
			var company_id = data;
			var post_fav = {};

			$http.get('http://128.199.105.21:8000/api/users/')
			.success(function(data){
				var temp = data;
				post_fav.user_id = temp.id;
				post_fav.company_id = company_id;
				$scope.user = post_fav;

				console.log(post_fav);
				$http.post('http://128.199.105.21:8000/api/favorite/',$scope.user)
				.success(function(data){
					console.log(data);
					$("#"+company_id).removeClass("favButton");
					$("#"+company_id).addClass("unfavButton");
					$("#"+company_id).attr( "ng-click","unfav(stock.company_id)");

				})
				.error(function(data){
					alert("Please Login");
     				window.location = "http://127.0.0.1:3000/";
					console.log(data);
				});

			})
			.error(function(data){
				console.log(data);
			});
		}

		$http.get('http://128.199.105.21:8000/api/users/')
		.success(function(data){
			$scope.user = data;
		})
		.error(function(data, headers){
			console.log(data);
			console.log(headers);
		});

		$http.get('http://128.199.105.21:8000/api/companies/').success(function(data) {
			var companies = data;
			$scope.companies = companies;

			$http.get('http://128.199.105.21:8000/api/lateststocks/').success(function(data) {
				var stocks = data;
				var ans = stocks.filter(function(stock){
					for (var i = 0; i < companies.length; i++) {
						if(companies[i].id == stock.company_id){
							stock.company_name=companies[i].name;
							stock.symbol=companies[i].symbol;
							return true;
						} 
					};
				});
				$scope.stocks=ans;
				usSpinnerService.stop('spinner-1');
				$("#hide").fadeIn();
				//change heart color
				$http.get('http://128.199.105.21:8000/api/favorite/')
				.success(function(data){
					var favs = data;
					favs.forEach(function(fav){
						// console.log(fav.company_id);
						$("#"+fav.company_id).removeClass("favButton");
						$("#"+fav.company_id).addClass("unfavButton");
						$("#"+fav.company_id).attr( "ng-click","unfav(stock.company_id)");

					});

				})
				.error(function(data){
				});
				//end
			});
		});

	}
]);

stockControllers.controller('StockInfoCtrl', ['$scope', '$routeParams','$http','usSpinnerService',
	function($scope, $routeParams,$http, usSpinnerService) {
		$scope.template={
			"navbar": "/views/navbar.html"
		}
		$http.get('http://128.199.105.21:8000/api/companies/'+$routeParams.stockID+'/').success(function(data) {
			$scope.stock = data;
		});

		//lastest stock data
		$http.get('http://128.199.105.21:8000/api/lateststocks/').success(function(data) {
				var stocks = data;
				var lastest ={};
				stocks.forEach(function(stock){
					if(stock.company_id==$routeParams.stockID){
						lastest.open_price = stock.open_price;
						lastest.close_price = stock.close_price;
						lastest.high_price = stock.high_price;
						lastest.low_price = stock.low_price;
						lastest.volume = stock.volume;
					}
				});
				$scope.lastest=lastest;
				console.log(lastest);
				usSpinnerService.stop('spinner-1');
				$("#hide").fadeIn();

		});

		//line chart
		$http.get('http://128.199.105.21:8000/api/stocks/'+$routeParams.stockID+'/')
		.success(function(data) {
			var stocks = data;
			var chartData = []; //store stock data for making graph

			//choose 100 close&open price
			for (var i = 0; i < 99; i++) {
				var newDate = new Date(stocks[i].date);
				var closed_price = stocks[i].close_price;
				var open_price = stocks[i].open_price;
				//store each data
				chartData.push({
				  date: newDate,
				  closed_price: closed_price,
				  open_price: open_price
				});
			};
			for (var i = 110; i < 120; i++) {
				var newDate = new Date(stocks[i].date);
				var open_price = stocks[i].open_price;
				//store each data
				chartData.push({
				  date: newDate,
				  open_price: open_price
				});
			};

			// console.log(chartData);
			//creating graph
			var chart = AmCharts.makeChart("linechart", {
		    "type": "serial",
		    "theme": "none",
		    "pathToImages": "http://www.amcharts.com/lib/3/images/",
		    "legend": {
		        "useGraphSettings": true
		    },
		    "dataProvider": chartData, //input chartdata into graph
		    "valueAxes": [{ //how many axes to be created
		        "id":"v1",
		        "axisColor": "#FF6600",
		        "axisThickness": 2,
		        "gridAlpha": 0,
		        "axisAlpha": 1,
		        "position": "left"
		    }],
		    "graphs": [{ //how many line graph to be created
		        "valueAxis": "v1",
		        "lineColor": "#FF6600",
		        "bullet": "round",
		        "bulletBorderThickness": 1,
		        "hideBulletsCount": 30,
		        "title": "open_price line", //graph line name
		        "valueField": "open_price", //name of value
		        "fillAlphas": 0
		    }, {
		        "valueAxis": "v2",
		        "lineColor": "#FCD202",
		        "bullet": "square",
		        "bulletBorderThickness": 1,
		        "hideBulletsCount": 30,
		        "title": "closed_price line",
		        "valueField": "closed_price",
						"fillAlphas": 0
		    }],
		    "chartScrollbar": {},
		    "chartCursor": {
		        "cursorPosition": "mouse"
		    },
		    "categoryField": "date",
		    "categoryAxis": {
		        "parseDates": true,
		        "axisColor": "#DADADA",
		        "minorGridEnabled": true
		    }
			});
			
			function zoomChart(){
			  chart.zoomToIndexes(chart.dataProvider.length - 20, chart.dataProvider.length - 1);
			}
			chart.addListener("dataUpdated", zoomChart);
			zoomChart();

		});
	}
]);

stockControllers.controller('LoginCtrl',['$scope','$http','$window',
	function($scope, $http, $window){
		$scope.user = {};
		$scope.processUser = function() {
			$http.post('http://128.199.105.21:8000/api/login/',$scope.user)
			.success(function(data){
				$window.localStorage.token = data.token;
				alert("Login succeed");
				window.location = "http://127.0.0.1:3000/main";
			})
			.error(function(data,status){
				console.log(data);
				console.log(status);
				alert("error");
			});
		};
	}

]);

stockControllers.controller('ResgisterCtrl',['$scope','$http',
	function($scope, $http){
		$scope.user = {};
		$scope.processUser = function() {
			$http.post('http://128.199.105.21:8000/api/register/',$scope.user)
			.success(function(data){
				alert("Registeration succeed!");
				window.location = "http://127.0.0.1:3000/";
			})
			.error(function(data,status){
				alert(data);
				alert(status);
			});
		};
	}
]);

stockControllers.controller('SimulatorCtrl',['$scope',
	function($scope) {
		$scope.template={
			"navbar": "/views/navbar.html"
		}
	}
]);

stockControllers.controller('MainCtrl',['$scope','$routeParams','$window',
	function($scope, $routeParams,$window) {
		$scope.template={
			"navbar": "/views/navbar.html"
		}
		$scope.recommemded_stocks = [
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
					"monthly_predict_percent": "43%",
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
					"monthly_predict_percent": "21%",
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
					"monthly_predict_percent": "7%",
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
					"monthly_predict_percent": "11%",
				},
			]
	}
]);

stockControllers.controller('FavoriteCtrl',['$scope','$routeParams','$http','usSpinnerService',
	function($scope, $routeParams, $http, usSpinnerService) {
		$scope.template={
			"navbar": "/views/navbar.html"
		}

		$scope.searchResult = function(){
			if(typeof $scope.selectedCompany === "undefined")
				return;
			window.location = "http://127.0.0.1:3000/stocks/"+$scope.selectedCompany.description.company_id+'/'
			console.log($scope.selectedCompany);
		}

		$http.get('http://128.199.105.21:8000/api/lateststocks/')
			.success(function(data){
				var lastests = data;

				$http.get('http://128.199.105.21:8000/api/companies/')
					.success(function(data){
						var companies = data;

						$http.get('http://128.199.105.21:8000/api/favorite/')
							.success(function(data){
								var favs = data;

								var a = companies.filter(function(company){
									for (var i = 0; i < favs.length; i++) {
										if(favs[i].company_id==company.id)
											return true;
									};
								});

								var ans = lastests.filter(function(lastest){
									for (var i = 0; i < a.length; i++) {
										if(a[i].id==lastest.company_id){
											lastest.name= a[i].name;
								  		lastest.company_id=a[i].id;
								  		lastest.symbol= a[i].symbol;
											return true;
										}
									};
								});
								console.log(ans);
								$scope.favorite_stocks = ans;
								usSpinnerService.stop('spinner-1');
								$("#hide").fadeIn();
								$scope.companies = ans;

							})
							.error(function(data){
								console.log(data);
							});
					})
					.error(function(data){
						console.log(data);
					});
			})
			.error(function(data){
				console.log(data);
			});
	}	
]);