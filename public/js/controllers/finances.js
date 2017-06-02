angular.module('CoffeeApp')
.controller('financesController', ['$scope', '$http', function($scope, $http) {
  this.userPrices = {};
  this.averagePrices = [{
      beverage: 'cappuccino',
      indexPrice: [3.06, 3.28],
      userPrice: 0
    }, {
      beverage: 'drip coffee',
      indexPrice: [1.87, 2.41],
      userPrice: 0
    }];
  // source: http://www.scanews.coffee/2015/10/30/the-specialty-coffee-price-index-a-benchmark-for-coffee-retailers/
  this.getAveragePrices = function() {
    $http({
      method: 'GET',
      url: $scope.baseUrl + 'purchases/finances',
      headers: {
         Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
       }
    }).then(
      response => {
        console.log(response);
        if (response.data.status === 200) {
          this.averagePrices[0].userPrice = response.data.cappuccino_average;
          this.averagePrices[1].userPrice = response.data.coffee_average;
        } else {
          console.log(response.data.status);
        }
      },
      error => {
        console.log(error);
      });
  };

  this.getAveragePrices();
}]);
