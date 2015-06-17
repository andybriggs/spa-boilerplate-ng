var app = angular.module('app', ['ngResource','ngRoute']);

angular.module('app').config(function($routeProvider, $locationProvider){
	$locationProvider.html5Mode(true);
	$routeProvider.when('/', { templateUrl: '/partials/main' })
});

app.controller('mainController', ['$scope', function($scope){
  $scope.myVar = "New App!!";
}]);