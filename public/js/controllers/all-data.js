angular.module('CoffeeApp')
.controller('allDataCtrl', ['$scope', '$http', function($scope, $http) {

  this.deleteServing = function(serving) {
    console.log('deleting serving');
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
          // remove deleted item from $scope.coffeeData.allServings array
          let indexDeletedServing = -1;
          for (let i = 0; i < $scope.coffeeData.allServings.length; i++) {
            console.log('in serving');
            if (parseInt($scope.coffeeData.allServings[i].id) == parseInt(response.data.serving.id)) {
              indexDeletedServing = i;
              console.log('index', indexDeletedServing);
            }
          }
          if (indexDeletedServing !== -1) {
            console.log('splicing');
            $scope.coffeeData.allServings.splice(indexDeletedServing, 1);
          } else {
            console.log('not found!');
          }

          // remove deleted item from $scope.coffeeData.allPurchases array
          let indexDeletedPurchase = -1;
          for (let i = 0; i < $scope.coffeeData.allPurchases.length; i++) {
            console.log('in purchase');
            if (parseInt($scope.coffeeData.allPurchases[i].id) === parseInt(response.data.serving.purchase_id) && $scope.coffeeData.allPurchases[i].by_cup === true) {
              indexDeletedPurchase = i;
              console.log('index', indexDeletedPurchase);
            }
          }

          if (indexDeletedPurchase !== -1) {
            console.log('splicing');
            $scope.coffeeData.allPurchases.splice(indexDeletedPurchase, 1);
          } else {
            console.log('not found!');
          }

          // UPDATE BY BAG // BY CUP // UPDATE ADD DATA VIEW
          $scope.updateByBagAndByCup();
          $scope.availablePurchasesbyBag();

        } else {
          console.log('Ooops, something went wrong.');
        }
      },
      error => {
        console.log(error.data);
      });
  };

  this.deletePurchase = function(purchase) {
    console.log('deleting purchase');
    $http({
      method: 'DELETE',
      url: $scope.baseUrl + 'purchases/' + purchase.id,
      headers: {
         Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
       }
    }).then(
      response => {
        console.log(response);
        if (response.data.status === 204) {
          console.log(response.data);
          // ############### removing data from $scope.coffeeData.allPurchases!
          let indexDeletedPurchase = -1;
          console.log('all purchases', $scope.coffeeData.allPurchases);
          console.log('deleted: ', response.data.purchase);
          for (let i = 0; i < $scope.coffeeData.allPurchases.length; i++) {
            console.log('looping');
            if (parseInt($scope.coffeeData.allPurchases[i].id) === parseInt(response.data.purchase.id)) {
              indexDeletedPurchase = i;
              console.log('found: ', $scope.coffeeData.allPurchases[i].id);
              console.log('index', indexDeletedPurchase);
              console.log('compared to: ', response.data.purchase.id);
            }
          }

          if (indexDeletedPurchase !== -1) {
            console.log('splicing');
            $scope.coffeeData.allPurchases.splice(indexDeletedPurchase, 1);
            console.log('all purchases', $scope.coffeeData.allPurchases);
          } else {
            console.log('nothing found');
          }
          // ############### removing data $scope.coffeeData.allServings!
          let indexDeletedServings = [];

          for (let i = 0; i < $scope.coffeeData.allServings.length; i++) {
            console.log('in splicing servings');
              if (parseInt($scope.coffeeData.allServings[i].purchase_id) === parseInt(response.data.purchase.id)) {
              indexDeletedServings.push(i)
              console.log('found', $scope.coffeeData.allServings[i].id);
              console.log('index', i);
              console.log('compared to: ', response.data.purchase.id);
              console.log('index array', indexDeletedServings);
            }
          }
          if (indexDeletedServings.length > 0) {
            indexDeletedServings.forEach(function(item, index) {
              console.log('splicing');
              $scope.coffeeData.allServings.splice(index, 1);
            });
          } else {
            console.log('  nothing found');
          }

          // UPDATE BY BAG // BY CUP // UPDATE ADD DATA VIEW
          $scope.updateByBagAndByCup();
          $scope.availablePurchasesbyBag();
        }
      },
      error => {
        console.log(error);
      });
  };

}]);
