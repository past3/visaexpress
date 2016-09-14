var app = angular.module('visaexpress', ['ngRoute', 'ngCookies', 'ui-notification', 'ngMaterial']);
app.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/member', {
		controller:'MainCtrl',
		templateUrl:'/admin/partials/users.html'
	}).when('/', {
		templateUrl:'/admin/partials/dash.html',
		controller:'DashCtrl'
	}).when('/edit', {
		templateUrl:'/admin/partials/edit.html',
		controller:'EditDashCtrl'
	}).when('/Admin', {
		controller:'adminCtrl',
		templateUrl:'/admin/partials/adminUsers.html'
	}).when('/gallery', {
		templateUrl:'/admin/partials/gallery.html',
		controller:'GalleryCtrl'
	}).when('/package', {
			templateUrl:'/admin/partials/',
			controller:'PackageCtrl'
	}).when('/logout', {
		controller:'LogCtrl',
		template:'<p>Logginout<p/>'
	});
}]);
app.run(run);
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

run.$inject = ['$window','$rootScope', '$location', '$cookieStore', '$http'];
function run ($window, $rootScope, $location, $cookieStore, $http){
	$rootScope.globals = $cookieStore.get('globals') || {};
	if($rootScope.globals.Admin){
		$http.defaults.headers.common['Authorization'] = 'Basic' + $rootScope.globals.Admin.authdata;
	}
	$rootScope.$on('$locationChangeStart', function(event, next, current){
		var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
		var loggedin = $rootScope.globals.Admin;
		if(!loggedin){
			console.log("cam");
			/*var landingUrl = "http://localhost:8080/admin"; //URL complete
			window.location.href = landingUrl;*/
			$window.location = '/login';
		}
	});
}

app.controller('NewUserCtrl', ['$scope', '$http','$location', 'Notification', function($scope, $http, $location, Notification){
$scope.result = {};
$scope.show = "show";

$http.get('/api/adminList').then(function(data){
	console.log(data.data);
	$scope.result = data.data;
	//Notification({message: 'Success', title: 'Listing Management'});
}, function(){
	Notification.error("Error Getting Data");
});


$scope.send = function(data){
	$location.path('/result/'+data);
};

$scope.add = function(data){
	$http.post('/api/newuser', data).then(function(){
		Notification({message: 'Success', title: 'Listing Management'});
	}, function(){
		Notification.error("Error Adding Data");
	});
};

}]);
