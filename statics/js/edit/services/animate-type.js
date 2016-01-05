app.factory('AnimateTypes',function(){
  
  var getAnimateStyles = function(animationName,animateConfig){
    var styles = ['display:flex;'];
    var prefixs = ['','-webkit'];
    angular.forEach(prefixs, function(prefix) {
      this.push(prefix+'animation:'
          +[
            animationName,
            (animateConfig.duration||0.6)+'s',
            animateConfig.timingFunction||'ease',
            (animateConfig.delay||0)+'s',
            animateConfig.direction||'normal',
            animateConfig.iterationInfinite?'infinite':animateConfig.iterationCount||1,
           ].join(' ')+';');
    },styles);
    return styles;
  };
  
  var getTransformStyles = function(animateConfig){
    var rtn = {};
    if(!animateConfig.offsetX && !animateConfig.offsetY 
        && !animateConfig.rotate && !animateConfig.scale) return rtn;
    rtn['transform'] = [];
    rtn['transform'].push('translate('+(animateConfig.offsetX||0)+'px,'+(animateConfig.offsetY||0)+')px');

    rtn['transform'].push('rotate('+(animateConfig.rotate||0)+'deg)');

    rtn['transform'].push('scale('+(animateConfig.scale||1)+')');
    
    rtn['transform'] = rtn['transform'].join(' ');
    rtn['-webkit-transform'] = rtn['transform'];
    return rtn;
  };
  
  var styleObj2string = function(obj){
    var rtn = '';
    angular.forEach(obj,function(v,k){
      rtn+=k+':'+v+';';
    });
    return rtn;
  };
  
  var getKeyframeContent = function(animationName,configAsStart,animateConfig,startStyles,endStyles){
    if(configAsStart)startStyles = angular.extend(startStyles||{}, getTransformStyles(animateConfig));
    if(!configAsStart)endStyles = angular.extend(endStyles||{}, getTransformStyles(animateConfig));
    var rtn = [];
    var prefixs=['','-webkit-'];
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
      title:'淡入',
      getCssClass:function(item){
        return 'fadein'+item.id;
      },
      getCssContent:function(item,page){
        var cssClass = this.getCssClass(item);
        var selector = '.'+cssClass;
        var rtn = [];
        var styles = ['display:flex;'];
        rtn.push(selector+'{display:none}');
        Array.prototype.push.apply(styles,getAnimateStyles(cssClass,item.animate));
        
        rtn.push('.p'+page+' '+selector+'{'+styles.join('')+'}');
        
        //动画
        rtn.push(getKeyframeContent(cssClass,true,item.animate,{opacity:0},{}));
        
        return rtn.join("\n\r");
      }
    },
    fadeOut:{
      title:'淡出',
      getCssClass:function(item){
        return 'fadeOut'+item.id;
      },
      getCssContent:function(item,page){
        var cssClass = this.getCssClass(item);
        var selector = '.'+cssClass;
        var rtn = [];
        var styles = ['visibility:hidden;'
                      ,'transition:visibility 0s linear '+(item.animate.delay+item.animate.duration)+'s'];
        Array.prototype.push.apply(styles,getAnimateStyles(cssClass,item.animate));
        
        rtn.push('.p'+page+' '+selector+'{'+styles.join('')+'}');
        //动画
        rtn.push(getKeyframeContent(cssClass,false,item.animate,{},{opacity:0}));
        return rtn.join("\n\r");
      }
    },
    
  };
});