angular.module('CoffeeApp').directive('allData', function() {
  return {
    restrict: 'E',
    templateUrl: '../../partials/all-data.html',
    controller: 'allDataCtrl',
    controllerAs: 'allData'
  };
});
