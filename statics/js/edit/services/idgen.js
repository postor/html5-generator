  //用于生成唯一id的服务
  app.factory('idgen',function(){
    var curId = 0;
    return {
      newId:function(){
        return curId++;
      },
      setId:function(v){
        curId = v || 0;
      },
      getId:function(){
        return curId;
      }
    }
  });