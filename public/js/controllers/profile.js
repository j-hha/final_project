angular.module('CoffeeApp').controller('profileController', ['$scope', '$http', function($scope, $http) {
  this.tabs = {
    tab1: true,
    tab2: false,
    tab3: false
  };
  this.select = function(tab){
    for (var key in this.tabs) {
      if (key === tab) {
        this.tabs[key] = true;
        $('#'+tab).addClass('selected');
      } else {
        this.tabs[key] = false;
        $('#'+key).removeClass('selected');

      }
    }
  };
}]);
