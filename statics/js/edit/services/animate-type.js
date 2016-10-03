app.factory('AnimateTypes',['StyleCalc',function(StyleCalc){
  
  var getAnimateStyles = StyleCalc.animation;
  
  var getTransformStyles = StyleCalc.transform;
  
  var styleObj2string = function(obj,prifix){
    var rtn = '',prifixAttrs=['transform'];
    angular.forEach(obj,function(v,k){
      var drop = false;
      angular.forEach(prifixAttrs,function(it){
        if(k.indexOf(it)>=0){
          if(k!==prifix+it) drop = true;
        }
      });

      if(!drop) rtn+=k+':'+v+';';
    });
    return rtn;
  };
  
  var getKeyframeContent = function(animationName,configAsStart,animateConfig,startStyles,endStyles,middleStyleArr){
    var style = {};
    if(typeof animateConfig.opacity !== 'undefined'){
      style['opacity'] = animateConfig.opacity;
    }
    if(configAsStart)startStyles = angular.extend(startStyles||{}, style, getTransformStyles(animateConfig));
    if(!configAsStart)endStyles = angular.extend(endStyles||{}, style, getTransformStyles(animateConfig));
    var rtn = [];
    var prefixs=['','-webkit-'];
    var middleStr = '';
    
    angular.forEach(prefixs, function(prefix) {
      this.push("\n\r"+'@'+prefix+'keyframes '+animationName+'{'
        +'0%{'
          +styleObj2string(startStyles||{},prefix)
        +'}100%{'
          +styleObj2string(endStyles||{},prefix)
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
        rtn.push(getKeyframeContent(cssClass,false,item.animate,{},{}));
        
        return rtn.join("\n\r");
      }
    },
    fadeOut:{
      title:'保持完成后状态',
      getCssClass:function(item){
        return 'fadeOut'+item.id;
      },
      getCssContent:function(item,page){
        var cssClass = this.getCssClass(item);
        var selector = '.'+cssClass;
        var rtn = [];
        var styles = {
        };
        
        angular.extend(styles,getAnimateStyles(cssClass,item.animate));        
        
        rtn.push(StyleCalc.style2css(styles,'.p'+page+' '+selector));
        //动画
        rtn.push(getKeyframeContent(cssClass,false,item.animate,{},{}));
        return rtn.join("\n\r");
      }
    }
    
  };
}]);