angular.module('CoffeeApp').controller('addDataController', ['$scope', '$http', function($scope, $http) {
  // tab functionality ---------------------------------------------------------
  $scope.availablePurchasesbyBag();

  this.tabs = {
    tab1: true,
    tab2: false,
    tab3: false
  };

  this.select = function(tab){
    for (var key in this.tabs) {
      if (key === tab) {
        this.tabs[key] = true;
        $('#'+tab).addClass('selected');
      } else {
        this.tabs[key] = false;
        $('#'+key).removeClass('selected');
      }
    }
  };

  // tab functionality end -----------------------------------------------------

  // functionality for adding coffee consumption and purchase data -------------

  // add data for coffee by cup, homemade --> pulls in data for previously
  // purchased bag of coffee
  this.addHomemadeCoffee = function(newServing) {
    newServing.purchase_id = parseInt(newServing.purchase_id);
    newServing.disposable_cup = false;
    console.log(newServing);
    $http({
      method: 'POST',
      url: $scope.baseUrl + 'servings',
      data: {
        serving: newServing
      },
      headers: {
         Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
       }
    }).then(
      response => {
        console.log(response);
        if (response.data.status = 201) {
          $scope.coffeeData.allServings.push(response.data.serving)
          // $localStorage.setItem('servings', JSON.stringify($scope.coffeeData.allServings));
        } else {
          console.log(response.data);
        }
      },
      error => {console.log(error);}
    );
  };

  this.addCoffeeShopPurchase = function(newPurchase, newServing) {
    newPurchase.by_cup = true;
    if (newPurchase.fair_trade !== true) {
      newPurchase.fair_trade = false;
    }
    if (newServing.disposable_cup !== true) {
      newServing.disposable_cup = false;
    }
    newServing.date = newPurchase.date;

    console.log(newPurchase, newServing);

    //http post request to purchases
    $http({
      method: 'POST',
      url: $scope.baseUrl + 'purchases',
      data: {
        purchase: newPurchase
      },
      headers: {
         Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
       }
    }).then(
      response => {
        if (response.data.status = 201) {
          console.log('success: ', response.data.purchase);
          $scope.coffeeData.allPurchases.push(response.data.purchase);
          $scope.coffeeData.byCup.push(response.data.purchase);
          // $localStorage.setItem('purchases', JSON.stringify($scope.coffeeData.allPurchases));
          //on success: http post request to servings
          newServing.purchase_id = parseInt(response.data.purchase.id);
          $http({
            method: 'POST',
            url: $scope.baseUrl + 'servings',
            data: {
              serving: newServing,
            },
            headers: {
               Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
             }
          }).then(
            response => {
              console.log(response);
              if (response.data.status = 201) {
                $scope.coffeeData.allServings.push(response.data.serving)
                // $localStorage.setItem('servings', JSON.stringify($scope.coffeeData.allServings));
              } else {
                console.log(response.data);
              }
            } ,
            error => {console.log(error);}
          );
        } else {
          console.log(response.data);
        }
      },
      error => console.log(error)
    );
  };

  // add data for coffee by bag
  this.addNewBagOfCoffee = function(newPurchase) {
    newPurchase.by_cup = false;
    if (newPurchase.fair_trade !== true) {
      newPurchase.fair_trade = false;
    }
    newPurchase.price = parseFloat(newPurchase.price)
    console.log(newPurchase);
    // http post request to purchases
    $http({
      method: 'POST',
      url: $scope.baseUrl + 'purchases',
      data: {
        purchase: newPurchase
      },
      headers: {
         Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
       }
    }).then(
      response => {
        console.log('success: ', response.data);
        if (response.data.status = 201) {
          $scope.coffeeData.allPurchases.push(response.data.purchase);
          $scope.coffeeData.byBag.push(response.data.purchase);
          // localStorage.setItem('purchases', JSON.stringify($scope.coffeeData.allServings));
          $scope.availablePurchasesbyBag();
        } else {
          console.log(response.data);
        }
      },
      error => console.log(error)
    );
  };
  // functionality for adding coffee consumption and purchase data end ---------
}]);
