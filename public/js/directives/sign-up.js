angular.module('CoffeeApp').directive('signUp', function() {
  return {
    restrict: 'E',
    templateUrl: '../../partials/sign-up.html',
    controller: 'mainCtrl',
    controllerAs: 'ctrl'
  };
});
