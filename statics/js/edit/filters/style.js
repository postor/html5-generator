
  app.filter('stylefilter',['LinkManage',function(LinkManage){
    
    var types = {
      percent:function(i,v){
          var rtn = {};
          rtn[i]=v+'%';
          return rtn;
        },
      camelCase:function(i,v){
        var i1 = (''+i).replace(/[A-Z]/g, function(c){return '-'+c.toLowerCase()});
        var rtn = {};
        rtn[i1]=v;
        return rtn;
      },
      camelCaseUrl:function(i,v){
        var i1 = (''+i).replace(/[A-Z]/g, function(c){return '-'+c.toLowerCase()});
        return types.url(i1,v);
      },
      camelCasePx:function(i,v){
        var i1 =  (''+i).replace(/[A-Z]/g, function(c){return '-'+c.toLowerCase()});
        return types.px(i1,v);
      },
      url:function(i,v){
        var rtn = {};
        rtn[i]='url('+v+')';
        return rtn;
      },
      px:function(i,v){
        var rtn = {};
        rtn[i]=v+'px';
        return rtn;
      }
    };
    var attrs = {
      top:types.percent,
      left:types.percent,
      right:types.percent,
      bottom:types.percent,  
      width:types.percent,
      height:types.percent,
      fontSize:types.camelCasePx,
      fontWeight:types.camelCase,
      fontStyle:types.camelCase,
      backgroundImage:types.camelCaseUrl,
      backgroundRepeat:types.camelCase,
      backgroundPosition:types.camelCase,
      backgroundSize:types.camelCase,
      alignItems:types.camelCase,
      justifyContent:types.camelCase,
      backgroundColor:types.camelCase,
      borderWidth:types.camelCasePx,
      borderStyle:types.camelCase,
      borderColor:types.camelCase,
      zIndex:types.camelCase
    };
    
    var ignores = {
        backgroundColorTransparent:function(rtn,v){
          if(v)rtn['background-color'] = 'transparent';
        },fontFamilyGoogle:function(rtn,v){
          if(v){
            rtn['font-family'] = rtn['font-family']?v+','+rtn['font-family']:v;
            var fontUrl = 'https://fonts.googleapis.com/css?family='+v.replace(' ','+');
            LinkManage.addLink(fontUrl);
          }
        },fontFamilyBackup:function(rtn,v){
          if(v)rtn['font-family'] = rtn['font-family']?rtn['font-family']+','+v:v;
        }
    };
    
    return function(raw,itemType){
      if(raw && raw.backgroundColorTransparent){
        delete raw.backgroundColor;
      }
      
      if(itemType == 'text'){
        delete raw.backgroundImage;
        delete raw.backgroundRepeat;
        delete raw.backgroundPosition;
        delete raw.backgroundSize;
      }
      
      var rtn = {};
      
      for(var i in raw){
        if(typeof raw[i] === 'undefined'){
          delete raw[i];
        }
        if(attrs[i]){
          angular.extend(rtn, attrs[i](i,raw[i]));
        }else if(ignores[i]){
          ignores[i](rtn,raw[i]);
        }else{
          if(!rtn[i])rtn[i]=raw[i];
        }
      }
      return rtn;
    };
  }]);