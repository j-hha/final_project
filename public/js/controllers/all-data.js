angular.module('CoffeeApp')
.controller('allDataCtrl', ['$scope', '$http', function($scope, $http) {

  this.deleteServing = function(serving) {
    console.log('deleting');
    $http({
      method: 'DELETE',
      url: $scope.baseUrl + 'servings/' + serving.id,
      headers: {
         Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
       }
    }).then(
      response => {
        if (response.data.status === 204) {
          console.log(response.data);
          let index;
          // won't work cause obj!
          // let indexDeletedServing = $scope.coffeeData.allServings.indexOf(response.data.serving);
          for (let i = 0; i < $scope.coffeeData.allServings.length; i++) {
            if ($scope.coffeeData.allServings[i] == response.data.serving) {
              index = i;
            }
          }
          $scope.coffeeData.allServings.splice(index, 1);
          console.log(index);
          console.log($scope.coffeeData.allServings);
          console.log(response.data.serving);
          // let indexDeletedPurchase = $scope.coffeeData.allPurchases.indexOf(response.data.purchase);
          // $scope.coffeeData.allPurchases.splice(indexDeletedPurchase, 1);
        } else {
          console.log('Ooops, something went wrong.');
        }
      },
      error => {
        console.log(error.data);
      });
  };
}]);
