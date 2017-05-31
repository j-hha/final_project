angular.module('CoffeeApp').directive('splitScreen', function() {
  return {
    restrict: 'E',
    templateUrl: '../../partials/split-screen.html',
    controller: 'mainCtrl',
    controllerAs: 'ctrl'
  };
});
