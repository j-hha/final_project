angular.module('CoffeeApp').directive('profile', function() {
  return {
    restrict: 'E',
    templateUrl: '../../partials/profile.html',
    controller: 'profileController',
    controllerAs: 'profile'
  };
});
