var app = angular.module("visaexpress");

app.controller("GeneralCtrl", function(AuthenticationService, $scope, $http, $rootScope, $cookieStore){
  //console.log($cookieStore.get("globals").Admin.username);
  $scope.logged = "user";
  $scope.logged = $cookieStore.get("globals").Admin.username;
  $scope.result = {};
  $scope.user = "";
  $scope.img = "";
  if($cookieStore.get("globals").Admin.image){
    $scope.img = $cookieStore.get("globals").Admin.image;
  }else{
    $scope.img = "assets/images/ic.png";
  }
  $scope.logout = function(){
    console.log("f");
    AuthenticationService.ClearCredentials();
    //$window.location = '/log';
  };
});


app.controller("LogCtrl", function($window, AuthenticationService, $scope, $http, $rootScope, $cookieStore){
  //console.log($cookieStore.get("globals").Admin.username);
  console.log("try");
  AuthenticationService.ClearCredentials();
  $window.location = '/login';
});


app.controller("MainCtrl", function($scope, $http, $rootScope, $cookieStore){
//console.log($cookieStore.get("globals").Admin.username);
$scope.logged = $cookieStore.get("globals").Admin.username;
$scope.result = {};
$scope.user = "";
$scope.newerScope = [];
$scope.add = function(data){
  data.Image = $scope.f;
  $http.post('/newuser',data).then(function(res){
    $scope.result.push(data);
    $scope.user = "";
  }, function(err){

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

app.controller("adminCtrl", function($scope, $http, $cookieStore, $rootScope){

  $scope.logged = $cookieStore.get("globals").Admin.username;
  $scope.result = [];
  $scope.user = "";
  $scope.newerScope = [];
  $scope.add = function(data){
    $http.post('/newAdmin',data).then(function(res){
      $scope.result.push(data);
      $scope.user = "";
    }, function(err){

    });
  };
   $http.get('/getAdminUsers?page=1').success(function(res){
     console.log(res);
     $scope.result = res;
     //$scope.newScope = res.data.Pag.Pages;
  /*   if(res.Pag.Pages != 'undefined'){
     for(var i =0; i < $scope.newScope.length; i++){
       var tmp = {"data": i+1};
       $scope.newerScope.push(tmp);
     }
   }*/

});

   $scope.sends = function(data){
   $scope.pages = {};
   $scope.newScope = {};
   $scope.newerScope = [];

   	$http.get('/getAdminUsers?page='+data).success(function(data, status){
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
    console.log(res.data);
    $scope.res = res.data;
    $scope.result = res.data;
  }, function(){

  });
});
app.controller("EditDashCtrl", function($scope, $http, $rootScope, Notification){
  $scope.result = {};
  var image = "0";
  $http.get('/getLetters').then(function(res){
    console.log(res);
    $scope.result = res.data;
  }, function(){

  });
  $scope.add = function(data){
    $scope.show = "show";
    data.Image = $scope.f;
    data.type = image;
    $http.post('/upload', data).then(function(){
      $scope.show = "hide";
      $scope.result = {};
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
        image = "1";
      });
    };
    reader.readAsDataURL(image);
  };

});

app.controller("PackageCtrl", function($scope, $http, $rootScope, Notification){
  $scope.result = {};
  var image = "0";
/*  $http.get('/getLetters').then(function(res){
    console.log(res);
    $scope.result = res.data;
  }, function(){

  });*/

  $scope.add = function(data){
    $scope.show = "show";
    data.Image = $scope.f;
    data.type = image;
    $http.post('/package', data).then(function(){
      $scope.show = "hide";
      $scope.result = {};
        Notification({message: 'Success', title: 'Package Manager'});
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
        image = "1";
      });
    };
    reader.readAsDataURL(image);
  };
});


app.controller('GalleryCtrl', function($scope, $http){
$scope.img = {};
  $scope.add = function(){
    $scope.show = "show";

    $http.post('/gallery', $scope.files).then(function(){
      $scope.data = {};
      Notification({message: 'Success', title: 'Listing Management'});
      $scope.show = "hide";
      $scope.files = [];
      $scope.image = '';
      //$location.path('/');

    }, function(){
        Notification.error("Error Adding Data");
    });
  };

  $http.get('/gallery').success(function(res){
    $scope.img = res;
  });


  $scope.newfile = function(file){

    var reader = new FileReader();
    reader.onload = function(u){
          //$scope.files.push(u.target.result);
          $scope.$apply(function($scope) {
            $scope.files.push(u.target.result);
            //console.log(u.target.result);
          });
    };
    reader.readAsDataURL(file);

  };
});
