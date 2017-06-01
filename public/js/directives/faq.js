angular.module('CoffeeApp').directive('faq', function() {
  return {
    restrict: 'E',
    templateUrl: '../../partials/faq.html',
    controller: 'mainCtrl',
    controllerAs: 'ctrl'
  };
});
