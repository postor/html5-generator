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
        initStyle = angular.extend({},initStyle,initTransform,transition);
        
        var pageStyle = {
          'transform':'translate(0,0) rotate(0deg) scale(1)',
          '-webkit-transform':'translate(0,0) rotate(0deg) scale(1)',
          opacity: 1
        };
        
        return StyleCalc.style2css(initStyle,'.t'+item.id)+"\n"
          +StyleCalc.style2css(pageStyle,'.p'+pageId+' .t'+item.id);
        
      }else{
        return '';
      }
    }
  };
}]);