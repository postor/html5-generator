  //用于生成唯一id的服务
  app.factory('LinkManage',function(){
    var links = [];
    return {
      addLink:function(fontUrl){
        if(links.indexOf(fontUrl)<0)links.push(fontUrl);
      },
      clearLinks:function(v){
        links = [];
      },
      getLinks:function(){
        return links;
      }
    }
  });