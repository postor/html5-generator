
  app.filter('animateItem',function($sce,AnimateTypes){
    
    
  return function(item,page,useSce){
    if(item && item.animate && item.animate.enabled){
      var rtn = AnimateTypes[item.animate.type].getCssContent(item,page);
      if(useSce){
        return $sce.trustAsHtml(rtn);
      }
      return rtn;
    }else{
      return '';
    }
  };
});
  
app.filter('animateClassName',function(AnimateTypes){
  return function(item){
    if(item && item.animate && item.animate.enabled){
      return AnimateTypes[item.animate.type].getCssClass(item);
    }else{
      return '';
    }
  };
});