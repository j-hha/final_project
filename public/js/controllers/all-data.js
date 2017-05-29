angular.module('CoffeeApp')
.controller('allDataCtrl', ['$scope', '$http', function($scope, $http) {
// check if user has entered data for coffe purchased by bag to decide if
// option to add data for homemade coffee should be displayed
  $scope.availablePurchases = function() {
    if ($scope.coffeePurchasesByBag.length > 0) {
      $('#tab3').css('display', 'block');
    } else {
      $('#tab3').css('display', 'none');
    }
  }

  $scope.availablePurchases();
}]);
