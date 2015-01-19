(function(){
	'use strict';
	var app = angular.module('home', ['ngRoute', 'ngAnimate', 'ui.grid', 'growlNotifications']);

	app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
		$routeProvider
			.when('/', {
				redirect: '/login'
			})
			.when('/app/login', {
				templateUrl: 'temps/login-setup.html',
				controller: 'LoginSetup',
				controllerAs: 'login'
			})
			.when('/app/status', {
				templateUrl: 'temps/status-setup.html',
				controller: 'StatusSetup',
				controllerAs: 'status'
			})
			.when('/app/hive', {
				templateUrl: 'temps/hive-setup.html',
				controller: 'HiveSetup',
				controllerAs: 'hive'
			})
			.when('/app/jobs', {
				templateUrl: 'temps/jobs-setup.html',
				controller: 'JobsSetup',
				controllerAs: 'jobs'
			})
			.when('/app/settings', {
				templateUrl: 'temps/settings-setup.html',
				controller: 'SettingsSetup',
				controllerAs: 'settings'
			})
			.otherwise({
				templateUrl: 'temps/login-setup.html',
				controller: 'LoginSetup',
				controllerAs: 'login'
			});

		$locationProvider.html5Mode(true);
	} ]);

	app.run(function($rootScope, $location, $route){
		$route.reload();
		$rootScope.$watch(function(){ return $location.path(); }, function(newVal, oldVal){
			if (!$rootScope.loggedInUser && newVal != '/login'){
				$location.path('/login');
			}
		});
	});

	app.factory('socket', ['$rootScope', function ($rootScope) {
		var socket = io.connect();
		return {
			on: function (eventName, callback) {
				socket.on(eventName, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						callback.apply(socket, args);
					});
				});
			},
			emit: function (eventName, data, callback) {
				socket.emit(eventName, data, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						if (callback) {
							callback.apply(socket, args);
						}
					});
				})
			}
		};
	}]);

	app.directive('mainView', function(){
		return {
			restrict: 'E',
			templateUrl: 'temps/mainView.html',
			controller: function($scope, $rootScope){

			}
		};
	});

	app.directive('navBar', function(){
		return {
			restrict: 'E',
			templateUrl: 'temps/navBar.html',
			controller: function($scope, $rootScope){

			}
		};
	});

	app.controller('MainCtrl', ['$scope', function($scope){
		$scope.$on('LOAD', function(){$scope.loading=true});
		$scope.$on('UNLOAD', function(){$scope.loading=false});
	} ]);

	app.controller('notifications', ['$rootScope', 'socket', function($rootScope, socket){
		$rootScope.notes = [];
		socket.on('alert', function(msg){
			$rootScope.notes.push(msg);
		});
	}]);

	app.controller('LoginSetup', ['$http', '$rootScope', '$location', '$scope', function($http, $rootScope, $location){
		this.name = 'Login';
		this.login = function(main){
			var user = main.user;
			var pass = main.pass;

			$http.post('/login', {user: user, pass: pass}).success(function(data, status, headers, config){
				var status = data.status;
				var user = data.user;
				var group = data.group;
				if(status == 'ok'){
					$rootScope.loggedInUser = user;
					//$('#loggedInUser').text(user);
					$location.path('/app/status');
				}else{
					var msg = {
						type: 'Login',
						msg: status
					};
					$rootScope.notes.push(msg);
					//$('#errorBody').html('<h4>'+status+'</h4>');
					//$('#errorPopup').modal('show');
				}
			}).error(function(data, status, headers, config) {
				//$('#errorBody').html('<h4>'+data.status+'</h4>');
				//$('#errorPopup').modal('show');
			});
		};
	} ]);

	app.controller('StatusSetup', ['$scope', '$http', function($scope, $http){
		this.name = 'Status';

		$http.get('/statusDump').success(function(data){

			data.forEach(function(d){
				d.Time = new Date(d.Time);
				d.Delay = +d.Delay;
			});

			console.log(data);

			var margin = {top: 50, right: 50, bottom: 70, left: 50};
			var	width = 1200 - margin.left - margin.right;
			var	height = 620 - margin.top - margin.bottom;

			var xExt = d3.extent(data, function(d) { return d.Time; });
			var yExt = d3.extent(data, function(d) { return d.Delay; });

			yExt[0] = 0;

			console.log(xExt);
			console.log(yExt);

			var x = d3.time.scale()
				.range([0, width])
				.domain(xExt);

			var y = d3.scale.linear()
				.range([height, 0])
				.domain(yExt);

			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom")
				.ticks(d3.time.days);
				//.ticks(10);

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.ticks(10)
				.tickFormat(d3.format("s"));

			var color = d3.scale.category20();

			var line = d3.svg.line()
				.x(function(d) { return x(d.Time); })
				.y(function(d) { return y(d.Delay); });

			var svg = d3.select("#graph").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis)
				.selectAll('text')
					.style("text-anchor", "end")
					.attr("dx", "-.8em")
					.attr("dy", ".15em")
					.attr("transform", function(d) {
						return "rotate(-45)"
					});

			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Latancy in MS");

			var dataNest = d3.nest()
				.key(function(d) { return d.Host; })
				.entries(data);

			var hold = '<ul class="legend">';

			dataNest.forEach(function(v, i){

				svg.append('path')
					.attr('class', 'line')
					.style('stroke', function(){
						return v.color = color(v.key);
					})
					.attr('id', v.key+'_line')
					.attr('d', line(v.values));

				hold += '<li style="color:'+color(v.key+'_line')+';"><input type="checkbox" id="'+v.key+'_box"> '+v.key+'</li>';
			});
			hold += '</ul>';
			$('#legend').html(hold);

		}).error(function(data){
			console.log(data);
		});
	}]);

	app.controller('HiveSetup', ['$scope', '$http', function($scope, $http){
		this.name = 'Hive';
		$scope.$emit('LOAD');
		$http.get('/dbs').success(function(data){
			console.log(data);
			$scope.$emit('UNLOAD');
			var hold = {};
			data.forEach(function(v){
				$scope[v] = false;
				//$scope[v+'Tables'] = [];
				var obj = {};
				obj.name = v;
				obj.children = {};
				hold[v] = obj;
			});
			$scope.hive = hold;
		}).error(function(data){
			console.log(data);
		});

		var editor = ace.edit("editor");
		editor.getSession().setMode("ace/mode/sql");

		$scope.query = function(){
			var q = editor.getValue();
			var str = q.replace(/\ /g, '+');
			console.log(str);
			$http.post('/callback', {str: str}).success(function(res){
				console.log(res);
			}).error(function(err){
				console.log(err);
			});
		}

		$scope.clicked = function(data){
			var db = data.name;
			$scope.selected = db;
			if($scope[db] == false){
				console.log('true');
				$scope[db] = true;
				$scope.$emit('LOAD');
				$http.post('/tables', {db: db}).success(function(tables){
					var hold = {};
					$scope.$emit('UNLOAD');
					console.log(tables);
					if(tables){
						var hold = {};
						tables.forEach(function(v){
							var obj = {};
							obj.name = v;
							obj.columns = {};
							$scope[db+'_'+v] = false;
							hold[v] = obj;
						});
						$scope.hive[db].children = hold;
					}else{
						$scope.hive[db].children = {Empty: {name: 'Empty'}};
					}
				}).error(function(err){
					console.log(err);
				});
			}else{
				console.log('false');
				$scope[db] = false;
			}
		};

		$scope.table = function(d, t){
			var db = d.name;
			var tab = t.name;
			$scope.$emit('LOAD');
			$scope.selected = db+'_'+tab;
			console.log(db, tab);
			$http.post('/columns', {db: db, tab: tab}).success(function(cols){
				console.log(cols);
				$scope.$emit('UNLOAD');
				$scope.columns = cols.columns;
				var keys = Object.keys(cols);
				console.log(keys);
				var hold = [];
				keys.forEach(function(v){
					if(v == 'columns'){

					}else{
						var obj = {};
						obj.key = v;
						obj.value = cols[v];
						hold.push(obj);
					}
				});
				$scope.info = hold;
			}).error(function(err){
				console.log(err);
			});
		};
	}]);

	app.controller('JobsSetup', ['$scope', '$http', function($scope, $http){
		this.name = 'Jobs';

		$http.get('/jobs').success(function(data){
			$scope.jobs = data;
			//console.log(data.detail.status.state);
			// data.forEach(function(v){
			// 	console.log(v.detail.status.state);
			// });
		}).error(function(data){
			console.log(data);
		});
	}]);

	app.controller('SettingsSetup', ['$scope', '$http', function($scope, $http){
		this.name = 'Settings';

		$http.get('/hosts').success(function(data){
			$scope.hosts = data;
		}).error(function(data){
			console.log(data);
		});
		$http.get('/users').success(function(data){
			$scope.users = data;
		}).error(function(data){
			console.log(data);
		});
		$http.get('/configs').success(function(data){
			$scope.configs = data;
		}).error(function(data){
			console.log(data);
		});
	}]);
})();
