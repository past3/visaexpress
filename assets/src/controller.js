var app = angular.module("visaexpress");
app.controller("GeneralCtrl", function(AuthenticationService, $scope, $http, $rootScope, $cookieStore){
//console.log($cookieStore.get("globals").currentUse.username);
$scope.logged = "user";
$scope.logged = $cookieStore.get("globals").currentUse.username;
$scope.result = {};
$scope.user = "";
$scope.logout = function(){
  console.log("f");
  AuthenticationService.ClearCredentials();
  //$window.location = '/log';
};
});

app.controller("LogCtrl", function($window, AuthenticationService, $scope, $http, $rootScope, $cookieStore){
//console.log($cookieStore.get("globals").currentUse.username);
console.log("try");
AuthenticationService.ClearCredentials();
$window.location = '/login';
});



app.controller("MainCtrl", function($scope, $http, $rootScope, $cookieStore){
//console.log($cookieStore.get("globals").currentUse.username);
$scope.logged = $cookieStore.get("globals").currentUse.username;
$scope.result = {};
$scope.user = "";
$scope.newerScope = [];
$scope.add = function(data){
  $http.post('/newuser',data).then(function(res){
    $scope.result.push(data);
    $scope.user = "";
  }, function(err){

  });
};
 $http.get('/getUsers?page=1').then(function(res){
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

 $scope.sends = function(data){
 $scope.pages = {};
 $scope.newScope = {};
 $scope.newerScope = [];

 	$http.get('/getUsers?page='+data).success(function(data, status){
 		$scope.result = data.Data;
 		$scope.pages = data;
 		console.log(data)
 		$scope.newScope = data.Pag.Pages;
 		for(var i =0; i < $scope.newScope.length; i++){
 			var tmp = {"data": i+1};
 			$scope.newerScope.push(tmp);
 		}
 //$scope.$apply();
 	});
 };


});

app.controller("DashCtrl", function($scope, $http){
  $scope.res = {};
  $scope.result = {};
  $http.get('/getLetters').then(function(res){
    console.log(res.data[0]);
    $scope.res = res.data;
    $scope.result = res.data;
  }, function(){

  });
});
app.controller("EditDashCtrl", function($scope, $http, $rootScope, Notification){
  $scope.result = {};
  $http.get('/getLetters').then(function(res){
    console.log(res);
    $scope.result = res.data;
  }, function(){

  });
  $scope.add = function(data){
    $scope.show = "show";
    data.Image = $scope.f;
    data.BackImage = $scope.ff;
    $http.post('/upload', data).then(function(){
      $scope.show = "hide";
        Notification({message: 'Success', title: 'Newsletter Uploaded'});
    }, function(err){
        Notification.error("Error Adding Data");
        $scope.show = "hide";
    });

  };
  $scope.newLetter = function(image){
    var reader = new FileReader();
    reader.onload = function(u){
      $scope.$apply(function($scope){
        $scope.f = u.target.result;
      });
    };
    reader.readAsDataURL(image);
  };
  $scope.newLetter2 = function(image){
    var reader = new FileReader();
    reader.onload = function(u){
      $scope.$apply(function($scope){
        $scope.ff = u.target.result;
      });
    };
    reader.readAsDataURL(image);
  };

});
