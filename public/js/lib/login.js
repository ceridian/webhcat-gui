(function(){
	var app = angular.module('login', [ ]);

	app.directive('loginSetup', function(){
		return {
			restrict: 'E',
			templateUrl: 'temps/login-setup.html'
		};
	});

	app.controller('WebguiController', ['$http', function($http){
		this.login = function(webgui){
			var user = webgui.user;
			var pass = webgui.pass;
			$http.post('/login', {user: user, pass: pass}).success(function(data, status, headers, config){
				if(data == 'ok'){
					window.location.replace('/');
				}else{
					$('#errorBody').html('<h4>'+data+'</h4>');
					$('#errorPopup').modal('show');
				}
			}).error(function(data, status, headers, config) {
				$('#errorBody').html('<h4>'+data+'</h4>');
				$('#errorPopup').modal('show');
			});
		};
	} ]);
})();