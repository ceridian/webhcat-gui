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
		$rootScope.logger = function(type, info){
			$http.post('/login', {user: user, pass: pass}).success(function(data, status, headers, config){

			}).error(function(data, status, headers, config) {

			});
		}
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
			console.log(msg);
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
					$location.path('/app/status');
				}else{
					console.log(status);
				}
			}).error(function(data, status, headers, config) {
				console.log(data.status);
			});
		};
	} ]);

	app.controller('StatusSetup', ['$scope', '$http', '$location', function($scope, $http, $location){
		this.name = 'Status';


		$http.get('/statusDump').success(function(data){

			data.forEach(function(d){
				d.Time = new Date(d.Time);
				d.Delay = +d.Delay;
			});

			var colors = [
				'steelblue',
				'green',
				'red',
				'purple'
			];

			var margin = {top: 50, right: 50, bottom: 70, left: 50};
			var	width = 1200 - margin.left - margin.right;
			var	height = 620 - margin.top - margin.bottom;

			var xExt = d3.extent(data, function(d) { return d.Time; });
			var yExt = d3.extent(data, function(d) { return d.Delay; });

			var random = function(){
				var num = Math.floor(Math.random() * 10);
				var obj = {}
				obj.Time = new Date();
				obj.Delay = num;
				return obj;
			}

			var x = d3.time.scale()
				.range([0, width])
				.domain(xExt);

			var y = d3.scale.linear()
				.range([height, 0])
				.domain(yExt);

			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom")
				.ticks(d3.time.days)
				.ticks(10);

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.ticks(10)
				.tickFormat(d3.format("s"));

			var line = d3.svg.line()
				.x(function(d) { return x(d.Time); })
				.y(function(d) { return y(d.Delay); });

			var pointsEqual = function(p1, p2){
				return p1.Delay === p2.Delay;
			}

			var removeDupes = function(items, areEqual){
				var pre2;
				var pre;
				var results = [];
				var straightLine = false;

				var callback = function(value, index){
					if(index === 0 || !areEqual(value, pre)){
						if (straightLine){
							results.push(pre);
						}
						results.push(value);
						pre = value;
					}else{
						pre2 = pre;
						pre = value;
						if(pre.Delay == pre2.Delay){
							straightLine = true;
						}
					}
				}
				items.forEach(callback);

				return results;
			}

			var done = removeDupes(data, pointsEqual);


			var zoom = d3.behavior.zoom()
				.x(x)
				.y(y)
				.scaleExtent([1, 10])
				.on("zoom", zoomed);

			var svg = d3.select("body").append("svg")
				.call(zoom)
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// svg.append("defs").append("clipPath")
			// 	.attr("id", "clip")
			// 	.append("rect")
			// 	.attr("width", width)
			// 	.attr("height", height);

			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + y(0) + ")")
				.call(xAxis);
				//.call(d3.svg.axis().scale(x).orient("bottom"));

			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis);
				//.call(d3.svg.axis().scale(y).orient("left"));

			svg.append("defs").append("clipPath")
				.attr("id", "clip")
				.append("rect")
				.attr("width", width)
				.attr("height", height);

			// var path = svg.append("g")
			// 	.attr("clip-path", "url(#clip)")
			// 	.append("path")
			// 		.datum(done)
			// 		.attr("class", "line")
			// 		.attr("d", line);

			//svg.selectAll('.line')
			//	.data(data)
			//	.enter()
			svg.append("path")
				.datum(done)
				.attr("class", "line")
				.attr("d", line)
				.attr("clip-path", "url("+$location.path()+"#clip)");
				// .attr('stroke', function(d,i){
				// 	return colors[i%colors.length];
				// })
				//.attr("d", line);

			function zoomed(){
				// var t = zoom.translate(),
				// tx = t[0],
				// ty = t[1];
				//
				// var d = new Date(new Date().setDate(new Date().getDate()-7));
				//
				// zoom.translate([0, d]);

				svg.select(".x.axis").call(xAxis);
				svg.select(".y.axis").call(yAxis);
				svg.selectAll('path.line').attr('d', line);
			}

			// setInterval(function() {
			// 	var num = random();
			// 	console.log(num);
			// 	done.push(num);
			//
			// 	var last = done[done.length -1];
			//
			// 	var one = num.Time.getTime();
			// 	var two = last.Time.getTime();
			//
			// 	var diff = one - two;
			//
			// 	var start = xExt[0];
			//
			// 	var s = start.getTime();
			//
			// 	var trans = new Date(s - diff);
			//
			// 	var diff = num.Time - last.Time;
			// 	//console.log(x(new Date(0)) - x(new Date(24*3600*1000)));
			//
			// 	path //.transition().duration(500)
			// 		.attr("d", line)
			// 		.attr("transform", null)
			// 		.transition()
			// 		.duration(500)
			// 		.ease("linear")
			// 		.attr("transform", "translate(" + x(trans) + ",0)");
			// 		// .attr("d", line)
			// 		// .attr("transform", null)
			// 		// .transition()
			// 		// .duration(500)
			//
			//
			// 		// .attr("transform", "translate(" + x(-1) + ",0)");
			// 	// redraw the line, and slide it to the left
			// 	// path
			// 	// .attr("d", line)
			// 	// .attr("transform", null)
			// 	// .transition()
			// 	// .duration(1000)
			// 	// .ease("linear")
			// 	// .attr("transform", "translate(" + x(-1) + ",0)")
			// 	// .each("end", tick);
			//
			// 	// pop the old data point off the front
			//
			// }, 5000);
			/*data.forEach(function(d){
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

			var zoom = d3.behavior.zoom()
				.x(x)
				.y(y)
				.scaleExtent([1, 10])
				.on("zoom", zoomed);

			var color = d3.scale.category20();

			var line = d3.svg.line()
				.x(function(d) { return x(d.Time); })
				.y(function(d) { return y(d.Delay); });

			var svg = d3.select("#graph").append("svg")
				.call(zoom)
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// svg.append("rect")
			// 	.attr("width", width)
			// 	.attr("height", height)
			// 	.attr("fill", "#ddd");

			svg.append("clipPath")
				.attr("id", "clip")
				.append("rect")
				.attr("width", width)
				.attr("height", height);

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

			//var data = [];

			dataNest.forEach(function(v, i){

				// svg.append('path')
				// 	.attr('class', 'line')
				// 	.style('stroke', function(){
				// 		return v.color = color(v.key);
				// 	})
				// 	.attr("clip-path", "url(#clip)")
				// 	.attr('id', v.key+'_line')
				// 	.attr('d', line(v.values));

				data.push(v.values);

				hold += '<li style="color:'+color(v.key+'_line')+';"><input type="checkbox" id="'+v.key+'_box"> '+v.key+'</li>';
			});
			hold += '</ul>';

			svg.selectAll('.line')
				.data(data)
				.enter()
				.append("path")
					.attr("class", "line")
				.attr("clip-path", "url(#clip)")
				.attr('stroke', function(d,i){
					return color(i);
				})
					.attr("d", line);

			$('#legend').html(hold);

			function zoomed(){
				svg.select(".x.axis").call(xAxis);
				svg.select(".y.axis").call(yAxis);
				svg.selectAll('path.line').attr('d', line);
			}*/

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
