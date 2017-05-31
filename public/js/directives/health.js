angular.module('CoffeeApp').directive('health', function() {
  return {
    restrict: 'E',
    templateUrl: '../../partials/health.html',
    controller: 'healthController',
    controllerAs: 'healthCtrl'
  };
});
