
  app.directive('bgImgPos',function(){
    return {
      restrict: 'E',
      templateUrl:'/statics/js/edit/directives/views/bgImgPos.html',
      controller: function($scope, $element){
        
        $scope.backgroundPosition = $scope.bgPos;
        $scope.$watch('backgroundPosition', function(newValue, oldValue) {
          $scope.bgPos = newValue;
        });
      },
      scope:{
        bgPos:'=bgpos'
      }
    };
  });