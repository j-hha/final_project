var app = angular.module('CoffeeApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({ enabled: true });
}]);

app.controller('mainCtrl', ['$scope', function($scope) {
  this.title = 'Title';
  $scope.baseUrl = 'http://localhost:3000';
}]);
