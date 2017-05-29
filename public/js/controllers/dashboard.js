angular.module('CoffeeApp')
.controller('dashboardController', ['$scope', '$http', function($scope, $http) {
  this.mainNavigation = {
    dashboard: true,
    health: false,
    finances: false,
    environment: false,
    society: false
  };

  this.dashboardNavigation = {
    addData: true,
    reviewData: false,
    editProfil: false,
  };

  this.navigate = function(navigation, category) {
    for (var key in navigation) {
      if (key == category) {
        console.log(key, navigation[key]);
        navigation[key] = true;
      } else {
        console.log(key, navigation[key]);
        navigation[key] = false;
      }
    }
  };

  // http get request for data --> should happen only once on LOGIN!!!
  $http({
    method: 'GET',
    url: $scope.baseUrl + 'purchases'
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
    url: $scope.baseUrl + 'servings'
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
