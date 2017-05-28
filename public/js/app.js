const app = angular.module('CoffeeApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({ enabled: true });

  $routeProvider.when('/my-account', {
    templateUrl: '../partials/dashboard.html',
    controller: 'mainCtrl',
    controllerAs: 'ctrl'
  }).otherwise({
    redirectTo: '/',
    templateUrl: '../partials/splash-page.html',
    controller: 'mainCtrl',
    controllerAs: 'ctrl'
  });
}]);


app.controller('mainCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
  this.title = 'Page Title';
  $scope.baseUrl = 'http://localhost:3000/';
  $scope.currentUser = false;

  // coffee data ---------------------------------------------------------------
  $scope.coffeeServings = [];
  $scope.coffeePurchasesByCup = [];
  $scope.coffeePurchasesByBag = [];
  // coffee data end -----------------------------------------------------------

  // paper cup counter logic ---------------------------------------------------
  this.numOfPaperCups = 0;
  this.paperCupTower = 0;
  this.paperCupTowerInFt = 0 + ' ft';
  this.getNumOfPaperCupsPerYear = function() {
    this.paperCupTower = parseInt(this.numOfPaperCups) * 52;
    this.paperCupTowerInFt = Math.round(((this.paperCupTower * 9.4) / 100) * 3.28084) + ' ft';
    percentage = (((this.paperCupTower * 9.4) / 100)  * 100)/46;
    console.log(percentage);
    $('#paperCupTower').animate({height: percentage + '%'});

    if (this.numOfPaperCups > 0) {
      $('#paperCupTower').css('min-height', 15 + '%');
    } else {
      $('#paperCupTower').css('min-height', 0);
    }

    if (percentage > 100) {
      $('#paperCupTowerLabel').addClass("percentageGreater100");
      $('#paperCupTowerLabel').removeClass("percentageSmaller100");
    } else {
      $('#paperCupTowerLabel').addClass("percentageSmaller100");
      $('#paperCupTowerLabel').removeClass("percentageGreater100");
    }
  };
  // paper cup counter logic end -----------------------------------------------

  // http get request for data
  $http({
    method: 'GET',
    url: $scope.baseUrl + 'purchases'
  }).then(
    response => {
      console.log(response);
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

  $scope.availablePurchases = function() {
    if ($scope.coffeePurchasesByBag.length > 0) {
      $('#tab3').css('display', 'block');
    } else {
      $('#tab3').css('display', 'none');
    }
  }

  $scope.availablePurchases();
}]);
