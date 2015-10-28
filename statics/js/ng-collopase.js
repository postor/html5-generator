// declare the app with no dependencies
angular.module('collpase', []).directive('ngCollpase', function($compile)
{ 
  function CollpaseController (){
    
    
  };
  
  var list = {};
    
  var newGroup = function(group,option){
    list[group] = {
      openCount: 0,
      items:{},
      option: angular.extend(
        {
          current: null,
          forceOneOpen: 0,
          forceOtherClose: 1,
        },
        option),
      init:function(){
        this.openCount = 0;
        if(this.option.current===null) return;  
        for(var j in this.option.current){
          this.items[j] = this.option.current[j];
          if(this.option.current[j])this.openCount++;
        }
      },
      select: function(key){
        if(this.items[key]){
          //已经展开
          if(this.option.forceOneOpen) return;
          
          this.openCount--;
          this.items[key] = 0;
        }else{
          //关闭
          if(this.option.forceOtherClose){
            this.openCount = 0;
            for(var k in this.items){
              this.items[k] = 0;
            }
          }
          //展开
          this.openCount++;
          this.items[key] = 1;
        }
      }
    };
    list[group].init();
  };
  
  CollpaseController.prototype = {
    newGroup:newGroup,
    list:list
  };
  
  
  
  return {
      restrict: 'A',
      controller: CollpaseController,
      controllerAs:'collpaseData',
      link: function(scope, el, attrs, controller) {
        var option = {};
        if(attrs.ngCollpaseOption){
          option = scope.$eval(attrs.ngCollpaseOption);
        }
        scope.collpaseData.newGroup(scope.$eval(attrs.ngCollpase),option);
      },
      scope: false
  };
}).directive('ngCollpaseTarget', function($compile,$parse)
{ 
  
  return {
      restrict: 'A',
      link: function(scope,tElement, tAttrs) {
        var key = tAttrs['ngCollpaseTarget'];
        key = scope.$eval(key);
        var prefixedKey = key;
        var parent = tAttrs['ngCollpaseParent'];
        parent = scope.$eval(parent);
        var prefixedParent = parent;
        
        tElement.attr('ng-class',"{'active':collpaseData.list['"
        +prefixedParent+"'].items['"+prefixedKey
        +"']}");
        
        tElement.attr('ng-click',"collpaseData.list['"
        +prefixedParent+"'].select('"+key+"')");
        //tElement.attr('ng-click',"test()");
        
        tElement.removeAttr('ng-collpase-target');
        
        $compile(tElement)(scope);
        
      }
  };
}).directive('ngCollpaseHref', function($compile)
{ 
  
  return {
      restrict: 'A',
      link: function(scope,tElement, tAttrs) {
        var key = tAttrs['ngCollpaseHref'];
        key = scope.$eval(key);
        var prefixedKey = key;
        var parent = tAttrs['ngCollpaseParent'];
        parent = scope.$eval(parent);
        var prefixedParent = parent;
        
        tElement.attr('ng-show',"collpaseData.list['"
        +prefixedParent+"'].items['"+prefixedKey
        +"']");
        
        tElement.removeAttr('ng-collpase-href');
        
        $compile(tElement)(scope);
        
      }
  };
});