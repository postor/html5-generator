
  app.filter('h5content',function($sce){
    return function(item,noSce){
      var rtn = item.name;
      if(item.type == 'text'){
        if(item.href){
          rtn = '<a href="'+item.href+'">'+item.text+'</a>';
        }else{
          rtn = item.text;
        }
      }else if(item.type == 'image' && item.style.backgroundImage){
        return '';
      }      
      return noSce?rtn:$sce.trustAsHtml(rtn);
    };
  });