app.factory('TransistionTypes',['StyleCalc','$filter',function(StyleCalc,$filter){
  
  var getTransistionStyles = function(transitionConfig){
    var styles = {};
    var prefixs = ['','-webkit'];
    styles['transition'] = [
                            'all',
                            (transitionConfig.duration||0.6)+'s',
                            transitionConfig.timingFunction||'ease',
                            (transitionConfig.delay||0)+'s'
                           ].join(' ');
    styles['-webkit-transition'] = styles['transition'];
    return styles;
  };
    
  return {
    getCssContent:function(item,pageId){
      if(item.transition && item.transition.enabled){
        var initTransform = StyleCalc.transform(item.transition);
        var transition = getTransistionStyles(item.transition);
        var initStyle = $filter('stylefilter')({opacity:item.transition.opacity});
        var targetStyle = $filter('stylefilter')(item.style);
        initStyle = angular.extend(targetStyle,initStyle,initTransform);
        
        var pageTransform = StyleCalc.transform(item.style);
        if(angular.equals({}, pageTransform)){
          pageTransform = {
              'transform':'translate(0,0) rotate(0deg) scale(1)',
              '-webkit-transform':'translate(0,0) rotate(0deg) scale(1)'
            };
        }
        var addition = {};
        if(typeof item.transition.opacity !== 'undefined' && !item.style.opacity){
          addition.opacity = 1;
        }
        for(var i in targetStyle){
          if(targetStyle[i]!==initStyle[i]){
            addition[i] = targetStyle[i];
          }
        }
        var pageStyle = angular.extend(addition,pageTransform,transition);
        
        return StyleCalc.style2css(initStyle,'.e'+item.id)+"\n"
          +StyleCalc.style2css(pageStyle,'.p'+pageId+' .e'+item.id);
        
      }else{
        var pageStyle = $filter('stylefilter')(item.style);
        return StyleCalc.style2css(pageStyle,' .e'+item.id);
      }
    }
  };
}]);