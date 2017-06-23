  app.filter('ctrstylefilter',function(){
    return function(style){
      var toload = ['width','height','top','left','border','border-width']
      var rtn = {
      }
      for(var i in style){
        if(toload.indexOf(i)>=0){
          rtn[i] = style[i]
        }
      }
      rtn['border-color'] = 'transparent'
      return rtn
    }
  })