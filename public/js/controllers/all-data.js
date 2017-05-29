angular.module('CoffeeApp')
.controller('allDataCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.availablePurchases();

  // http get request for data --> should happen only once on LOGIN!!!
  $http({
    method: 'GET',
    url: $scope.baseUrl + 'purchases',
    headers: {
       Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
     }
  }).then(
    response => {
      console.log(response);
      $scope.allPurchases = response.data;
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i].by_cup === false) {
          $scope.coffeePurchasesByBag.push(response.data[i]);
        }
      }
      console.log($scope.coffeePurchasesByBag);
    },
    error => {
      console.log(error);
    }
  );

  $http({
    method: 'GET',
    url: $scope.baseUrl + 'servings',
    headers: {
       Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
     }
  }).then(
    response => {
      console.log(response);
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i]) {
          $scope.coffeeServings.push(response.data[i]);
        }
      }
      console.log($scope.coffeeServings);
    },
    error => {
      console.log(error);
    }
  );
}]);
