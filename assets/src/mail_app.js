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
$scope.img = "";
if($cookieStore.get("globals").currentUse.image){
  $scope.img = $cookieStore.get("globals").currentUse.image;
}else{
  $scope.img = "assets/images/ic.png";
}
});
app.controller('MainCtrl2', function($scope, $http, $cookieStore){
	$scope.result = {};
	$scope.newerScope = [];
	$scope.view = "1";
  $scope.msg = "";
  $scope.read = function(data){
    $scope.msg = $scope.result[data];
  };
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
$scope.img = "";
if($cookieStore.get("globals").Admin.image){
  $scope.img = $cookieStore.get("globals").Admin.image;
}else{
  $scope.img = "assets/images/ic.png";
}
});
app.controller('MainCtrl', function($scope, $http, $cookieStore){
	$scope.result = {};
	$scope.newerScope = [];
	$scope.view = "1";
  $scope.msg = "";
  $scope.name = "";
  $scope.read = function(data){
    console.log("click");
    $scope.msg = $scope.result[data].Content;
    $scope.name = $scope.result[data].Name;
    console.log($scope.msg);
  };
	$scope.outbox = function(){
	$http.get('/outbox?page=1&from='+$cookieStore.get("globals").Admin.id).success(function(res){
		$scope.result = res.Data;
		$scope.view = "0";
    console.log($scope.result[0].Content);
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
		console.log($scope.result[0].Content);
		$scope.newScope = res.Pag.Pages;
		for(var i =0; i < $scope.newScope.length; i++){
			var tmp = {"data": i+1};
			$scope.newerScope.push(tmp);
		}


	});
	//console.log($scope.result);
	};

	$http.get('/inbox?page=1&to='+$cookieStore.get("globals").Admin.id).then(function(res){
		$scope.result = res.data.Data;
		$scope.newScope = res.data.Pag.Pages;
    if($scope.newScope){
      for(var i =0; i < $scope.newScope.length; i++){
  			var tmp = {"data": i+1};
  			$scope.newerScope.push(tmp);
  		}
    }


	}, function(err){
		console.log("err");
	});
});
