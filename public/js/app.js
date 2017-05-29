const app = angular.module('CoffeeApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({ enabled: true });

  $routeProvider.when('/', {
    resolve: {
        authenticate: function($location, $rootScope) {
            if($rootScope.currentUser) {
              $location.path('/my-dashboard');
            }
          }
      },
      templateUrl: '../partials/splash-page.html',
      controller: 'mainCtrl',
      controllerAs: 'ctrl',
  }).when('/my-dashboard', {
    resolve: {
      authenticate: function($location, $rootScope) {
          if(!$rootScope.currentUser) {
            $location.path('/');
          }
        }
    },
    templateUrl: '../partials/dashboard.html',
    controller: 'dashboardController',
    controllerAs: 'dashboardCtrl',
  }).otherwise({
    redirectTo: '/',
    templateUrl: '../partials/splash-page.html',
    controller: 'mainCtrl',
    controllerAs: 'ctrl'
  });
}]).controller('mainCtrl', ['$rootScope', '$scope', '$routeParams', '$http', '$location', function($rootScope, $scope, $routeParams, $http, $location) {
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

  $rootScope.currentUser = false;

  $rootScope.checkUser = function() {
    var jwt = JSON.parse(localStorage.getItem('token'));
    if (jwt) {
      console.log('logged in user');
      $rootScope.currentUser = true;
      return true;
    } else {
      console.log('no logged in user');
      $rootScope.currentUser = false;
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
          $rootScope.checkUser();
          $location.path('/my-dashboard');
        } else if (response.data.status === 401) {
          $rootScope.checkUser();
          loginData.username = '';
          loginData.password = '';
          loginData.msg = "Sorry, the username and/or password you entered don't match our records.";
        } else {
          $rootScope.checkUser();
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

  // log out functionality end -------------------------------------------------
  this.logout = function() {
    localStorage.clear('token');
    localStorage.clear('username');
    localStorage.clear('id');
    $rootScope.checkUser();
    location.reload();
  };
  // log out functionality end -------------------------------------------------

  // sign up functionality end -------------------------------------------------
  this.signup = function(signupData) {
    if (signupData.password === signupData.confirmPassword) {
      console.log(signupData);
      $http({
        method: 'POST',
        url: $scope.baseUrl + '/users',
        data: {
          user: {
            username: signupData.username,
            password: signupData.password
          }
        }
      }).then(
        response => {
          if (response.data.status === 201) {
            console.log(response.data);
            signupData.username = '';
            signupData.password = '';
            signupData.confirmPassword = '';
            signupData.msg = 'Thank you, ' + response.data.user.username + '. You account has been created.'
          } else {
            console.log(response);
            signupData.username = '';
            signupData.password = '';
            signupData.confirmPassword = '';
            signupData.msg = 'Sorry, something went wrong!'
          }
        },
        error => {
          console.log(error);
          signupData.username = '';
          signupData.password = '';
          signupData.confirmPassword = '';
          signupData.msg = 'Sorry, something went wrong!'
        }
      )
    } else {
      signupData.username = '';
      signupData.password = '';
      signupData.confirmPassword = '';
      signupData.msg = 'Sorry, the passwords you entered did not match.'
    }
  };
  // sign up functionality end -------------------------------------------------

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

  $rootScope.checkUser();
  // paper cup counter logic end -----------------------------------------------
}]);
