const app = angular.module('CoffeeApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({ enabled: true });

  $routeProvider.when('/', {
    templateUrl: '../partials/splash-page.html',
    controller: 'mainCtrl',
    controllerAs: 'ctrl'
  });
}]);


app.controller('mainCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
  this.title = 'Page Title';
  $scope.baseUrl = 'http://localhost:3000';
  $scope.currentUser = false;
}]);
