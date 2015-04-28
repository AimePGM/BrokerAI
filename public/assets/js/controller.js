var stockControllers = angular.module('stockControllers',[]);

stockControllers.controller('NavbarCtrl',['$scope', '$http','$window',
	function($scope, $http, $window){
		$scope.isLoggedin = false;

		$http.get('http://128.199.105.21:8000/api/users/')
		.success(function(data){
				$scope.user = data;
				$scope.isLoggedin = true;
				// console.log(data);
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

		$scope.getLatestStocks = function(get_type) {
			usSpinnerService.spin('spinner-1');
			$("#fetching").show();
			$("#hide").hide();
			console.log(get_type)
			if(get_type != "week" && get_type != "month") {
				get_type = "day"
			}

			$http.get('http://128.199.105.21:8000/api/predicted/')
			.success(function(data){
				var predicted = data;

			$http.get('http://128.199.105.21:8000/api/companies/')
			.success(function(data) {
				var companies = data;
				$scope.companies = companies;

				$http.get('http://128.199.105.21:8000/api/lateststocks/?type='+get_type)
				.success(function(data) {
					var stocks = data;

					var ans = stocks.filter(function(stock){
						for (var i = 0; i < companies.length; i++)
						{
							if(companies[i].id == stock.company_id)
							{
								stock.company_name=companies[i].name;
								stock.symbol=companies[i].symbol;
								return true;
							}
						}
					});

					var p;
					if(get_type == "day"){
						p = stocks.filter(function(stock){
							for (var i = 0; i < predicted.length; i++) {
								if(predicted[i].stock_id == stock.id){
									stock.nn_daily = predicted[i].nn_daily;
									stock.dt_daily = predicted[i].dt_daily;
									stock.bs_daily_buy = predicted[i].bs_daily_buy;
									stock.bs_daily_sell = predicted[i].bs_daily_sell;
									var x = stock.high_price - predicted[i].dt_daily;
									var y = stock.high_price - predicted[i].nn_daily;
									if (x<0) x = x*(-1);
									if (y<0) y = y*(-1);
									if (x<y) {
										stock.hilight = "dt";
									}else if (y<x){
										stock.hilight = "nn";
									}

									return true;
								}
							};
						});
					}else if(get_type=="week"){
						p = stocks.filter(function(stock){
							for (var i = 0; i < predicted.length; i++) {
								if(predicted[i].stock_id == stock.id){
									stock.nn_daily = predicted[i].nn_weekly;
									stock.dt_daily = predicted[i].dt_weekly;
									stock.bs_daily_buy = predicted[i].bs_weekly_buy;
									stock.bs_daily_sell = predicted[i].bs_weekly_sell;
									var x = stock.high_price - predicted[i].dt_daily;
									var y = stock.high_price - predicted[i].nn_daily;
									if (x<0) x = x*(-1);
									if (y<0) y = y*(-1);
									if (x<y) {
										stock.hilight = "dt";
									}else if (y<x){
										stock.hilight = "nn";
									}

									return true;
								}
							};
						});
					}else{
						p = stocks.filter(function(stock){
							for (var i = 0; i < predicted.length; i++) {
								if(predicted[i].stock_id == stock.id){
									stock.nn_daily = predicted[i].nn_monthly;
									stock.dt_daily = predicted[i].dt_monthly;
									stock.bs_daily_buy = predicted[i].bs_monthly_buy;
									stock.bs_daily_sell = predicted[i].bs_monthly_sell;
									var x = stock.high_price - predicted[i].dt_daily;
									var y = stock.high_price - predicted[i].nn_daily;
									if (x<0) x = x*(-1);
									if (y<0) y = y*(-1);
									if (x<y) {
										stock.hilight = "dt";
									}else if (y<x){
										stock.hilight = "nn";
									}

									return true;
								}
							};
						});
					}
					console.log(p);

					

					$scope.stocks=p;
					usSpinnerService.stop('spinner-1');
					$("#fetching").hide();
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

				})
				.error(function(data){

				});
			})
			.error(function(data){
			});


			})
			.error(function(data){

			});
			
		}

	$scope.getLatestStocks("day");

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

		$scope.getLatestStocks = function() {

			$http.get('http://128.199.105.21:8000/api/predicted/')
			.success(function(data){
				var predicted = data;

				//get day stock's info
				$http.get('http://128.199.105.21:8000/api/lateststocks/?type=day').success(function(data) {
						var stocks = data;
						var day_lastest={};

						console.log("day data");
						for(var i = 0; i < stocks.length; i++){
							var stock = stocks[i];
							if(stock.company_id==$routeParams.stockID){
								day_lastest.open_price = stock.open_price;
								day_lastest.close_price = stock.close_price;
								day_lastest.high_price = stock.high_price;
								day_lastest.low_price = stock.low_price;
								day_lastest.volume = stock.volume;
								day_lastest.stock_id = stock.id;
								break;
							}
						}

						for (var j = 0;j < predicted.length; j++) {
							if(day_lastest.stock_id==predicted[j].stock_id){
								day_lastest.nn_daily = predicted[j].nn_daily;
								day_lastest.dt_daily = predicted[j].dt_daily;
								day_lastest.bs_daily_buy = predicted[j].bs_daily_buy;
								day_lastest.bs_daily_sell = predicted[j].bs_daily_sell;
								break;
							}
						};

						
						console.log(day_lastest);
						
						$scope.day_lastest=day_lastest;
						// console.log(day_lastest);
						usSpinnerService.stop('spinner-1');
						$("#fetching").hide();
				 		$("#hide").fadeIn();

				});

				//get week stock's info
				$http.get('http://128.199.105.21:8000/api/lateststocks/?type=week').success(function(data) {
						var stocks = data;
						var week_lastest={};

						console.log("week data");

						for(var i = 0; i < stocks.length; i++){ 
							var stock = stocks[i];
							if(stock.company_id==$routeParams.stockID){
								week_lastest.open_price = stock.open_price;
								week_lastest.close_price = stock.close_price;
								week_lastest.high_price = stock.high_price;
								week_lastest.low_price = stock.low_price;
								week_lastest.volume = stock.volume;
								break;
							}
						}

						for (var j = 0;j < predicted.length; j++) {
								if(week_lastest.stock_id==predicted[j].stock_id){
									week_lastest.nn_daily = predicted[j].nn_daily;
									week_lastest.dt_daily = predicted[j].dt_daily;
									week_lastest.bs_daily_buy = predicted[j].bs_daily_buy;
									week_lastest.bs_daily_sell = predicted[j].bs_daily_sell;
									break;
								}
						};
						
						$scope.week_lastest=week_lastest;
						// console.log(week_lastest);
						

				});

				//get month stock's info
				$http.get('http://128.199.105.21:8000/api/lateststocks/?type=month').success(function(data) {
						var stocks = data;
						var month_lastest={};
						console.log("month data");

						for(var i = 0; i < stocks.length; i++){ 
							var stock = stocks[i];
							if(stock.company_id==$routeParams.stockID){
								month_lastest.open_price = stock.open_price;
								month_lastest.close_price = stock.close_price;
								month_lastest.high_price = stock.high_price;
								month_lastest.low_price = stock.low_price;
								month_lastest.volume = stock.volume;
								break;
							}
						}

						for (var j = 0;j < predicted.length; j++) {
							if(month_lastest.stock_id==predicted[j].stock_id){
								month_lastest.nn_daily = predicted[j].nn_daily;
								month_lastest.dt_daily = predicted[j].dt_daily;
								month_lastest.bs_daily_buy = predicted[j].bs_daily_buy;
								month_lastest.bs_daily_sell = predicted[j].bs_daily_sell;
								break;
							}
						};

						$scope.month_lastest=month_lastest;
						// console.log(month_lastest);
						
				});


			})
			.error(function(data){
				console.log(data);
			});
		}
		$scope.getLatestStocks();

		//line chart
		$http.get('http://128.199.105.21:8000/api/stocks/'+$routeParams.stockID+'/')
		.success(function(data) {
			var stocks = data;
			var chartData = []; //store stock data for making graph

			//choose 100 close&open price //history
			for (var i = 0; i < stocks.length; i++) {
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

			var today = new Date();
			$http.get('http://128.199.105.21:8000/api/predicted/')
			.success(function(data){
				var predicted = data;
				var nn;
				var dt;

				for(var i = 0; i < predicted.length; i++){ 
					if(predicted[i].stock_id==$routeParams.stockID){
						nn = predicted[i].nn_daily;
						dt = predicted[i].dt_daily;
						break;
					}
				}

				chartData.push({
				  date: today,
				  dt: dt,
				  nn: nn
				});

			})
			.error(function(data){
				console.log(data);
			});

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
				console.log(status)

				if(typeof data.non_field_errors != undefined) {
					alert(data.non_field_errors);
				}
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

stockControllers.controller('SimulatorCtrl',['$scope','$routeParams','$http','usSpinnerService',
	function($scope, $routeParams, $http, usSpinnerService) {
		$scope.template={
			"navbar": "/views/navbar.html"
		}

		var vol = 0;
		$scope.volume = '';
		$scope.budget = '';
		$scope.profit = '';
		var b = $scope.budget;
		var p = $scope.profit;
      	$scope.simSubmit = function() {
        	vol = b*(p/100);
        	$scope.volume = vol;
        	$scope.budget = '';
			$scope.profit = '';
			console.log("Submit by budget="+budget+"and profit="+profit);
        };
        

				//get predicted data
				console.log("fetching predicted data");
				console.err
				$http.get('http://128.199.105.21:8000/api/predicted/').success(function(data) {
					var pre_stocks = data;
					console.log("fetching predicted data  ---> complete");

					console.log("fetching stocks data");
					$http.get('http://128.199.105.21:8000/api/stocks/').success(function(data) {
						var stocks = data;
						console.log("fetching stocks data  ---> complete");

						console.log("fetching companies data");
					$http.get('http://128.199.105.21:8000/api/companies/').success(function(data) {
						var companies = data;
						console.log("fetching companies data  ---> complete");
						


						 var rec_stocks = {};
						 var num_rec=0;
						 console.log("finding recommended stocks data");
						 for (var i = 0; i < pre_stocks.length; i++) {
						 	if (pre_stocks[i].bs_daily_recommend==1){
						 		rec_stocks[num_rec] = pre_stocks[i];
						 		num_rec++;
						 	}
						 };

						
						
						
						var stocks_data_num=0;
						
						console.log("finding stocks data from rec.id");
						for (var i = 0; i < num_rec; i++) {
							for (var j = 0; j < stocks.length; j++) {
								if (stocks[j].id == rec_stocks[i].stock_id) {
								rec_stocks[stocks_data_num].company_id = stocks[j].company_id;
								rec_stocks[stocks_data_num].high_price = stocks[j].high_price;
								var x = stocks[j].high_price - rec_stocks[stocks_data_num].dt_daily;
								var y = stocks[j].high_price - rec_stocks[stocks_data_num].nn_daily;
								if (x<0) x = x*(-1);
								if (y<0) y = y*(-1);
								if (x<y) {
									rec_stocks[stocks_data_num].hilight = "dt";
								}else if (y<x){
									rec_stocks[stocks_data_num].hilight = "nn";
								}
								stocks_data_num++;
								}
							};
						};

						


						
						
						var companies_data_num=0;
						console.log("finding companies data from company.id");
						for (var i = 0; i < stocks_data_num; i++) {
							for (var j = 0; j < companies.length; j++) {
								if (companies[j].id == rec_stocks[i].company_id) {
								rec_stocks[companies_data_num].name = companies[j].name;
								rec_stocks[companies_data_num].symbol = companies[j].symbol;
								companies_data_num++;
								}
							};
						};
						

						console.log("final data");
						console.log(rec_stocks);

						$scope.rec_stocks = rec_stocks;
						usSpinnerService.stop('spinner-1');
						$("#fetching").hide();
				 		$("#hide").fadeIn();

				 		
				 		});
				 	});
				});

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

		$scope.unfav = function(data){
			var company_id = data;

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
					$("#"+company_id).parent().parent().remove();
				})
				.error(function(data){
					console.log(data);
				});
		});
		}

		$http.get('http://128.199.105.21:8000/api/users/')
		.success(function(data){
		})
		.error(function(data, headers){
			alert("Please Login!");
			window.location="http://127.0.0.1:3000/"
		});

		$scope.searchResult = function(){
			if(typeof $scope.selectedCompany === "undefined")
				return;
			window.location = "http://127.0.0.1:3000/stocks/"+$scope.selectedCompany.description.company_id+'/'
			console.log($scope.selectedCompany);
		}

		$scope.getLatestStocks = function(get_type) {
			console.log(get_type);
			usSpinnerService.spin('spinner-1');
			$("#fetching").show();
			$("#hide").hide();
			if(get_type != "week" && get_type != "month") {
				get_type = "day"
			}

			$http.get('http://128.199.105.21:8000/api/lateststocks/?type='+get_type)
				.success(function(data){
					var lastests = data;

					$http.get('http://128.199.105.21:8000/api/predicted/')
					.success(function(data){
						var predicted = data;

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
									console.log(a);

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
									var p;
									if(get_type=="day"){
										p = ans.filter(function(an){
											for (var i = 0; i < predicted.length; i++) {
												if(an.id == predicted[i].stock_id){
													an.nn_daily = predicted[i].nn_daily || "No Data";
													an.dt_daily = predicted[i].dt_daily || "No Data";
													an.bs_daily_buy = predicted[i].bs_daily_buy;
													an.bs_daily_sell = predicted[i].bs_daily_sell;
													return true;
												}
											};
										});
									}else if(get_type=="week"){
										p = ans.filter(function(an){
											for (var i = 0; i < predicted.length; i++) {
												if(an.id == predicted[i].stock_id){
													an.nn_daily = predicted[i].nn_weekly || "No Data";
													an.dt_daily = predicted[i].dt_weekly || "No Data";
													an.bs_daily_buy = predicted[i].bs_weekly_buy;
													an.bs_daily_sell = predicted[i].bs_weekly_sell;
													return true;
												}
											};
										});
									}else if(get_type=="month"){
										p = ans.filter(function(an){
											for (var i = 0; i < predicted.length; i++) {
												if(an.id == predicted[i].stock_id){
													an.nn_daily = predicted[i].nn_monthly || "No Data";
													an.dt_daily = predicted[i].dt_monthly || "No Data";
													an.bs_daily_buy = predicted[i].bs_monthly_buy;
													an.bs_daily_sell = predicted[i].bs_monthly_sell;
													return true;
												}
											};
										});
									}		

									console.log(p);
									$scope.favorite_stocks = p;
									usSpinnerService.stop('spinner-1');
									$("#fetching").hide();
									$("#hide").fadeIn();
									$scope.companies = p;

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

					});

     		
				})
				.error(function(data){
					console.log(data);
				});
		}
		$scope.getLatestStocks("day")
	}	
]);