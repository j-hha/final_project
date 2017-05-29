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

}]);
