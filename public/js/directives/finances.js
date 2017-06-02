angular.module('CoffeeApp').directive('finances', function() {
  return {
    restrict: 'E',
    templateUrl: '../../partials/finances.html',
    controller: 'financesController',
    controllerAs: 'finCtrl'
  };
});
