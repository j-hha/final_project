const app = angular.module('CoffeeApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({ enabled: true });

  $routeProvider.when('/', {
    // based on: https://ciphertrick.com/2014/12/14/check-condition-before-loading-route-in-angular-js/
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

  $scope.baseUrl = 'http://localhost:3000/' /*'https://coffee-compass-api.herokuapp.com/'*/;

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

  $rootScope.checkUser();

  // ********  functions for getting back data from localStorage ********
  // check if user has entered data for coffe purchased by bag to decide if
  // option to add data for homemade coffee should be displayed
  $scope.availablePurchasesbyBag = function() {
    if ($scope.coffeeData.byBag.length > 0) {
      $('#tab3').css('display', 'block');
    } else {
      $('#tab3').css('display', 'none');
    }
  };

  $scope.coffeeData = {
    allPurchases: [],
    byBag: [],
    byCup: [],
    allServings: [],
  };

  $scope.updateByBagAndByCup = function() {
    $scope.coffeeData.byBag = [];
    $scope.coffeeData.byCup = [];
    for (let i = 0; i < $scope.coffeeData.allPurchases.length; i++) {
      if ($scope.coffeeData.allPurchases[i].by_cup === false) {
        $scope.coffeeData.byBag.push($scope.coffeeData.allPurchases[i]);
      } else if ($scope.coffeeData.allPurchases.by_cup === true) {
        $scope.coffeeData.byCup.push($scope.coffeeData.allPurchases[i]);
      }
    }
  };

  // $scope.saveCoffeeData = function() {
  //   if (JSON.parse(localStorage.getItem('servings')) && JSON.parse(localStorage.getItem('purchases'))) {
  //     $scope.coffeeData.allServings = JSON.parse(localStorage.getItem('servings'));
  //     console.log('servings saveCoffeeData', $scope.coffeeData.allServings);
  //     $scope.coffeeData.allPurchases = JSON.parse(localStorage.getItem('purchases'));
  //     console.log('purchases saveCoffeeData', $scope.coffeeData.allPurchases);
  //     $scope.coffeeData.byBag = [];
  //     $scope.coffeeData.byCup = [];
  //     for (let i = 0; i < $scope.coffeeData.allPurchases.length; i++) {
  //       if ($scope.coffeeData.allPurchases[i].by_cup === false) {
  //         $scope.coffeeData.byBag.push($scope.coffeeData.allPurchases[i]);
  //       } else if ($scope.coffeeData.allPurchases.by_cup === true) {
  //         $scope.coffeeData.byCup.push($scope.coffeeData.allPurchases[i]);
  //       }
  //     }
  //     console.log('bags', $scope.coffeeData.byBag);
  //     console.log('cups', $scope.coffeeData.byCup);
  //     $scope.availablePurchasesbyBag();
  //   }
  // };

// ******** get request for purchases and servings data ********

  $scope.getPurchases = function() {
    // http get request for data --> should happen only once on LOGIN!!!
    $http({
      method: 'GET',
      url: $scope.baseUrl + 'purchases',
      headers: {
         Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
       }
    }).then(
      response => {
        console.log(response);
        // localStorage.setItem('purchases', JSON.stringify(response.data));
        // console.log('purchases', JSON.parse(localStorage.getItem('purchases')));
        $scope.coffeeData.allPurchases = response.data;
        $scope.updateByBagAndByCup();
        $scope.getServings();
      },
      error => {
        console.log(error);
      });
  };

  $scope.getServings = function() {
    $http({
      method: 'GET',
      url: $scope.baseUrl + 'servings',
      headers: {
         Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
       }
    }).then(
      response => {
        console.log(response);
        $scope.coffeeData.allServings = response.data.servings;
        // localStorage.setItem('servings', JSON.stringify(response.data.servings));
        // console.log('servings', JSON.parse(localStorage.getItem('servings')));
        // $scope.saveCoffeeData();
        $scope.availablePurchasesbyBag();
      },
      error => {
        console.log(error);
      });
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
    $scope.coffeeData = {
      allPurchases: [],
      byBag: [],
      byCup: [],
      allServings: [],
    };
    // localStorage.clear('servings');
    // localStorage.clear('purchases');
    location.reload();
    $rootScope.checkUser();
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

  // ---------------------- max caffeine logic -------------------------

  // this.coffeePotImg = '../../barista-icon-set/SVG/barista-icons_cup-of-coffee.svg';
  // // $('.coffee-pot').click(function() {
  // //   console.log('clicked');
  // //   $(this).css('filter', 'opacity(1)');
  // // });

  this.numOfCupsPerDay = 0;
  this.range = [1,2,3,4,5,6];
  this.limitMsg = '';

  this.checkLimit = function() {
    if (this.numOfCupsPerDay === 5) {
      $('.coffee-pot').css('animation-name', 'limit-reached');
      this.limitMsg = 'Feeling jittery? Healthy adults may drink up to five cups of coffee per day.';
    } else if (this.numOfCupsPerDay === 6) {
      $('.coffee-pot').css('animation-name', 'over-limit');
      this.limitMsg = 'Feeling jittery? Healthy adults may drink up to five cups of coffee per day.';
    } else {
      $('.coffee-pot').css('animation-name', '');
      this.limitMsg = '';
    }
  };


  // ----------- navigation logic -----------------


  $scope.mainNavigation = {
      dashboard: true,
      health: false,
      finances: false,
      environment: false,
      society: false
    };

  $scope.dashboardNavigation = {
    addData: true,
    reviewData: false,
    editProfil: false,
    faq: false
  };

  $scope.navigate = function(navigation, category) {
    for (var key in navigation) {
      if (key == category) {
        console.log(key, navigation[key]);
        navigation[key] = true;
        console.log(key, navigation[key]);
      } else {
        console.log(key, navigation[key]);
        navigation[key] = false;
        console.log(key, navigation[key]);
      }
    }
  };

  this.wakeUpAPI = function() {
    $http({
      method: 'GET',
      url: $scope.baseUrl,
    }).then(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      });
  };

}]);
