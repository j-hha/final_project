angular.module('CoffeeApp').directive('splitScreen', function() {
  return {
    restrict: 'E',
    templateUrl: '../../partials/split-screen.html',
    controller: 'splitScreenCtrl',
    controllerAs: 'ctrlSplit'
  };
});
