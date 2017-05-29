angular.module('CoffeeApp').directive('logIn', function() {
  return {
    restrict: 'E',
    templateUrl: '../../partials/log-in.html',
    controller: 'mainCtrl',
    controllerAs: 'ctrl'
  };
});
