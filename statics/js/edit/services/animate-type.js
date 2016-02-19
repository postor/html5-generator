app.factory('AnimateTypes',['StyleCalc',function(StyleCalc){
  
  var getAnimateStyles = StyleCalc.animation;
  
  var getTransformStyles = StyleCalc.transform;
  
  var styleObj2string = function(obj){
    var rtn = '';
    angular.forEach(obj,function(v,k){
      rtn+=k+':'+v+';';
    });
    return rtn;
  };
  
  var getKeyframeContent = function(animationName,configAsStart,animateConfig,startStyles,endStyles,middleStyleArr){
    if(configAsStart)startStyles = angular.extend(startStyles||{}, getTransformStyles(animateConfig));
    if(!configAsStart)endStyles = angular.extend(endStyles||{}, getTransformStyles(animateConfig));
    var rtn = [];
    var prefixs=['','-webkit-'];
    var middleStr = '';
    
    angular.forEach(prefixs, function(prefix) {
      this.push("\n\r"+'@'+prefix+'keyframes '+animationName+'{'
        +'0%{'
          +styleObj2string(startStyles||{})
        +'}100%{'
          +styleObj2string(endStyles||{})
      +'}}');
    },rtn);
    return rtn.join();
  };
  
  return {
    fadeIn:{
      title:'普通',
      getCssClass:function(item){
        return 'fadein'+item.id;
      },
      getCssContent:function(item,page){
        var cssClass = this.getCssClass(item);
        var selector = '.'+cssClass;
        var rtn = [];
        var styles = {};

        angular.extend(styles,getAnimateStyles(cssClass,item.animate));
        
        
        rtn.push(StyleCalc.style2css(styles,'.p'+page+' '+selector));
        
        //动画
        rtn.push(getKeyframeContent(cssClass,true,{},item.animate,{}));
        
        return rtn.join("\n\r");
      }
    },
    fadeOut:{
      title:'完成后隐藏',
      getCssClass:function(item){
        return 'fadeOut'+item.id;
      },
      getCssContent:function(item,page){
        var cssClass = this.getCssClass(item);
        var selector = '.'+cssClass;
        var rtn = [];
        var styles = {
          'visibility':'hidden',
          'transition':'visibility 0s linear '
            +(parseFloat(item.animate.delay||0)+parseFloat(item.animate.duration||0.6))+'s'
        };
        styles['-webkit-transition'] = styles['transition'];
        
        angular.extend(styles,getAnimateStyles(cssClass,item.animate));        
        
        rtn.push(StyleCalc.style2css(styles,'.p'+page+' '+selector));
        //动画
        rtn.push(getKeyframeContent(cssClass,false,item.animate,{},{}));
        return rtn.join("\n\r");
      }
    }
    
  };
}]);