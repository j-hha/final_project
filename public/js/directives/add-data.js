angular.module('CoffeeApp').directive('addData', function() {
  return {
    restrict: 'E',
    templateUrl: '../../partials/add-data.html',
    controller: 'addDataController',
    controllerAs: 'addData'
  };
});
