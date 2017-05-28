angular.module('CoffeeApp').controller('profileController', ['$scope', '$http', function($scope, $http) {
  // tab functionality ---------------------------------------------------------
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

  // this.availablePurchases = function() {
  //   if ($scope.coffeePurchasesByBag.length > 0) {
  //     $('#tab3').css('display', 'block');
  //   } else {
  //     $('#tab3').css('display', 'none');
  //   }
  // }
  //
  // this.availablePurchases();
  // tab functionality end -----------------------------------------------------

  // functionality for adding coffee consumption and purchase data -------------
  // date:serving_params[:date],
  //   beverage_type:serving_params[:beverage_type],
  //   size:serving_params[:size],
  //   disposable_cup:serving_params[:disposable_cup],
  //   # purchase_id:serving_params[:purchase_id],
  //   #user_id:consumer.id,
  //   user_id:2,
  //   caffeine:beverage['caffeine'],
  //   cal:beverage['cal'],
  //   sugar:beverage['sugar'],
  //   fat:beverage['fat'])

  // available purchases -------------------------------------------------------

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
      }
    }).then(
      response => {console.log(response);} ,
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
      }
    }).then(
      response => {
        if (response.data.status = 201) {
          console.log('success: ', response.data.purchase);
          //on success: http post request to servings
          $http({
            method: 'POST',
            url: $scope.baseUrl + 'servings',
            data: {
              serving: newServing
            }
          }).then(
            response => {console.log(response);} ,
            error => {console.log(error);}
          );
        } else {
          console.log(response.data.status);
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
      }
    }).then(
      response => {
        if (response.data.status = 201) {
          $scope.coffeePurchasesByBag.push(response.data.purchase);
          console.log('success: ', response.data.purchase);
          console.log($scope.coffeePurchasesByBag);
          $scope.availablePurchases();
        } else {
          console.log(response.data.status);
        }
      },
      error => console.log(error)
    );
  };
  // functionality for adding coffee consumption and purchase data end ---------

}]);
