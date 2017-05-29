const app = angular.module('CoffeeApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({ enabled: true });

  $routeProvider.when('/my-dashboard', {
    templateUrl: '../partials/dashboard.html',
    controller: 'dashboardController',
    controllerAs: 'dashboardCtrl'
  }).otherwise({
    redirectTo: '/',
    templateUrl: '../partials/splash-page.html',
    controller: 'mainCtrl',
    controllerAs: 'ctrl'
  });
}]).controller('mainCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
  this.title = 'Page Title';
  $scope.baseUrl = 'http://localhost:3000/';
  $scope.currentUser = false;

  // coffee data ---------------------------------------------------------------
  $scope.coffeeServings = [];
  $scope.coffeePurchasesByCup = [];
  $scope.coffeePurchasesByBag = [];
  $scope.allPurchases = [];
  // coffee data end -----------------------------------------------------------

  // modals logic --------------------------------------------------------------
  this.openModal = function(element) {
    $('#' + element).show();
  };

  this.closeModal = function(element) {
    $('#' + element).hide();
  }
  // modals end ----------------------------------------------------------------

  // login functionality -------------------------------------------------------
  this.login = function(loginData) {
    $http({
      method: 'POST',
      url: $scope.baseUrl + 'users/login',
      data: loginData
    }).then(
      response => {
        console.log(response);
        if (response.data === 200) {
          loginData.msg = "Welcome!";
        } else {
          loginData.msg = "Sorry, something went wrong!";
        }
      },
      error => {
        console.log(error);
      loginData.msg = "Sorry, something went wrong!";
    }
    );
  };
  // login functionality end ---------------------------------------------------

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
}]);
