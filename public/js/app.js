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
    $('.modal-form').hide()
    $('.modal').show()
    $('#' + element).show();
  };

  this.closeModal = function(element) {
    $('.modal').hide()
    $('#' + element).hide();
  };

  // modals end ----------------------------------------------------------------

  // login functionality -------------------------------------------------------

  $scope.currentUser = false;

  $scope.checkUser = function() {
    var jwt = JSON.parse(localStorage.getItem('token'));
    if (jwt) {
      console.log('logged in user');
      $scope.currentUser = true;
      return true;
    } else {
      console.log('no logged in user');
      $scope.currentUser = false;
      return false;
    }
  };

  this.login = function(loginData) {
    loginData.msg = '';
    $http({
      method: 'POST',
      url: $scope.baseUrl + 'users/login',
      data: { user: loginData }
    }).then(
      response => {
        if (response.data.status === 200) {
          localStorage.setItem('token', JSON.stringify(response.data.token));
          localStorage.setItem('username', JSON.stringify(response.data.user.username));
          localStorage.setItem('id', JSON.stringify(response.data.user.id));
          loginData.username = '';
          loginData.password = '';
          this.closeModal('log-in-modal');
          $scope.checkUser();
        } else if (response.data.status === 401) {
          $scope.checkUser();
          loginData.username = '';
          loginData.password = '';
          loginData.msg = "Sorry, the username and/or password you entered don't match our records.";
        } else {
          $scope.checkUser();
          loginData.username = '';
          loginData.password = '';
          loginData.msg = "Sorry, something went wrong!";
        }
      },
      error => {
      console.log(error);
      $scope.checkUser();
      loginData.username = '';
      loginData.password = '';
      loginData.msg = "Sorry, something went wrong!";
    });
  };
  // login functionality end ---------------------------------------------------

  // log out functionality end ---------------------------------------------------
  this.logout = function() {
    localStorage.clear('token');
    localStorage.clear('username');
    localStorage.clear('id');
    $scope.checkUser();
    location.reload();
  };
  // log out functionality end ---------------------------------------------------

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

  $scope.checkUser();
  // paper cup counter logic end -----------------------------------------------
}]);
