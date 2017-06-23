
  app.directive('h5Element',function(){
    return {
      restrict: 'E',
      template:'<span ng-hide="isControl()" ng-bind-html="item|h5content"></span><div class="drag" ng-show="isControl()"></div>',
      controller: function($scope, $element){
        //绑定
        $scope.intItemId = parseInt($scope.itemId);
        $element.click(function(){
          $scope.setItem({itemId:$scope.intItemId});       
          $scope.$apply();
        });
        
        if(!$scope.isControl()) return

        //拖拽 和 缩放
        var $resize = $element.find('.drag');        
        var flags = {drag:false,resize:false,mousedown:false};

        $element.on('mousedown',function(e){
          flags.mousedown = true;
        }).on('mouseup',function(e){
          flags.mousedown = false;      
          flags.resize = false;
        });
        
        $resize.on('mouseenter',function(e){
          if(flags.mousedown) return;
          flags.resize = true;
        }).on('mouseleave',function(e){
          if(flags.mousedown) return;
          flags.resize = false;
        });

        var last_position = {};
        var last_style = {};
        $element.on('dragstart',function(e){
          flags.drag = !flags.resize;
          e.originalEvent.dataTransfer.setDragImage(document.createElement('span'), 0, 0);
          
          last_position = {
              x:e.originalEvent.clientX,
              y:e.originalEvent.clientY
          };
          last_style = angular.copy($scope.item.style);

        });

        //调整大小
        $element.on('drag',function(e){
          
          if(!e.originalEvent.clientX||!e.originalEvent.clientY) return;
          var offset = {
              x:e.originalEvent.clientX - last_position.x,
              y:e.originalEvent.clientY - last_position.y
          };
          var resolution = $scope.resolution();
          offset = {
              x:offset.x*100/resolution.width,
              y:offset.y*100/resolution.height
          };
          
          if(flags.drag){
            $scope.item.style.top=parseFloat((last_style.top+offset.y).toFixed(2));
            $scope.item.style.left=parseFloat((last_style.left+offset.x).toFixed(2));
          }else{
            $scope.item.style.height=parseFloat((last_style.height+offset.y).toFixed(2));
            $scope.item.style.width=parseFloat((last_style.width+offset.x).toFixed(2));
          }
          
          $scope.$apply();
        });
        
        //调整位置
        $element.on('dragend dragcancle',function(e){
          flags.mousedown = false;      
          flags.resize = false;    
          flags.drag = false;
        });
      },
      scope:{
        setItem:'&',
        itemId:'@',
        item:'=',
        resolution:'&',
        isControl:'&'
      }
    };
  });