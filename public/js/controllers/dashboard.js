angular.module('CoffeeApp')
.controller('dashboardController', ['$scope', '$http', function($scope, $http) {

  this.dashboardNavigation = {
    addData: true,
    reviewData: false,
    editProfil: false,
    faq: false
  };

  $scope.getPurchases();
}]);
