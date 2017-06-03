angular.module('CoffeeApp')
.controller('dashboardController', ['$scope', function($scope) {

  console.log('Getting users data now:');
  $scope.getPurchases();

}]);
