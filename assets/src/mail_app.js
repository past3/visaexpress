var app = angular.module('visaexpress', ['ngRoute', 'ngCookies', 'ui-notification', 'ngMaterial']);

app.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
                elem.on('click', function(e){
                    e.preventDefault();
                });
            }
        }
   };
});
app.controller("GeneralCtrl2", function($scope, $http, $rootScope, $cookieStore){
//console.log($cookieStore.get("globals").currentUse.username);
$scope.logged = "user";
$scope.logged = $cookieStore.get("globals").currentUse.username;
$scope.user = "";
});
app.controller('MainCtrl2', function($scope, $http, $cookieStore){
	$scope.result = {};
	$scope.newerScope = [];
	$scope.view = "1";
	$scope.outbox = function(){
		console.log($scope.result);
	$http.get('/outbox?page=1&from='+$cookieStore.get("globals").currentUse.id).success(function(res){
		$scope.result = res.Data;
		$scope.view = "0";
		console.log($scope.result);
		$scope.newScope = res.Pag.Pages;
		for(var i =0; i < $scope.newScope.length; i++){
			var tmp = {"data": i+1};
			$scope.newerScope.push(tmp);
		}


	});
	//console.log($scope.result);
	};

	$scope.inbox = function(){
		console.log($scope.result);
	$http.get('/inbox?page=1&from='+$cookieStore.get("globals").currentUse.id).success(function(res){
		$scope.result = res.Data;
		$scope.view = "1";
		console.log($scope.result);
		$scope.newScope = res.Pag.Pages;
		for(var i =0; i < $scope.newScope.length; i++){
			var tmp = {"data": i+1};
			$scope.newerScope.push(tmp);
		}


	});
	//console.log($scope.result);
	};

	$http.get('/inbox?page=1&to='+$cookieStore.get("globals").currentUse.id).then(function(res){
		console.log(res.data);
		$scope.result = res.data.Data;
		$scope.newScope = res.data.Pag.Pages;
		for(var i =0; i < $scope.newScope.length; i++){
			var tmp = {"data": i+1};
			$scope.newerScope.push(tmp);
		}

	}, function(err){
		console.log("err");
	});
});

app.controller("GeneralCtrl", function($scope, $http, $rootScope, $cookieStore){
//console.log($cookieStore.get("globals").Admin.username);
$scope.logged = "user";
$scope.logged = $cookieStore.get("globals").Admin.username;
$scope.user = "";
});
app.controller('MainCtrl', function($scope, $http, $cookieStore){
	$scope.result = {};
	$scope.newerScope = [];
	$scope.view = "1";
	$scope.outbox = function(){
		console.log($scope.result);
	$http.get('/outbox?page=1&from='+$cookieStore.get("globals").Admin.id).success(function(res){
		$scope.result = res.Data;
		$scope.view = "0";
		console.log($scope.result);
		$scope.newScope = res.Pag.Pages;
		for(var i =0; i < $scope.newScope.length; i++){
			var tmp = {"data": i+1};
			$scope.newerScope.push(tmp);
		}


	});
	//console.log($scope.result);
	};

	$scope.inbox = function(){
		console.log($scope.result);
	$http.get('/inbox?page=1&from='+$cookieStore.get("globals").Admin.id).success(function(res){
		$scope.result = res.Data;
		$scope.view = "1";
		console.log($scope.result);
		$scope.newScope = res.Pag.Pages;
		for(var i =0; i < $scope.newScope.length; i++){
			var tmp = {"data": i+1};
			$scope.newerScope.push(tmp);
		}


	});
	//console.log($scope.result);
	};

	$http.get('/inbox?page=1&to='+$cookieStore.get("globals").Admin.id).then(function(res){
		console.log(res.data);
		$scope.result = res.data.Data;
		$scope.newScope = res.data.Pag.Pages;
		for(var i =0; i < $scope.newScope.length; i++){
			var tmp = {"data": i+1};
			$scope.newerScope.push(tmp);
		}

	}, function(err){
		console.log("err");
	});
});
