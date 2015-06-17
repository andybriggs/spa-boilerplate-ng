var app = angular.module('app', []);

app.controller('mainController', ['$scope', function($scope){
  $scope.myVar = "New App!!";
}]);