app.controller('homeCtrl',['$scope','idgen','$filter','$http'
                           ,function($scope,idgen,$filter,$http
                               ){

    //初始化页面列表
    $scope.pages=[{
      items:[],
      //id:idgen.newId()
    }];
    
    //初始化物品列表，注意是object
    $scope.items={};

    $scope.email = $('#email').val();
    $scope.project = $('#project').val();
    $http.get('/json/'+$scope.project).then(function(rtn) {
      if(rtn.data.error){
        alert('服务器异常！');
      }else{
        $scope.pages = rtn.data.data.pages||[{
          items:[],
          //id:idgen.newId()
        }];
        $scope.items = rtn.data.data.items||{};  
        $scope.setCurrentPage(!!$scope.pages.length - 1);
        idgen.setId(rtn.data.data.curId);
        $scope.$applyAsync();
      }
    },function(){
      alert('网络异常！');
    });
    
    $scope.ItemTypes = {
      text:'文字',
      image:'图像'
    };
    
    
    //初始化机型
    $scope.resolution = {};
    $scope.resolution.iphone6 = {height:667,width:375};
    $scope.resolution.iphone4 = {height:480,width:320};
    $scope.resolution.current = $scope.resolution.iphone6;
    
    //设置当前原件
    $scope.setCurrentItem = function(index){
      $scope.currentItemIndex = index;
      $scope.currentItem=$scope.items[index];
    };
    
    //设置当前分页
    $scope.setCurrentPage = function(index){
      ($scope.currentPageIndex != index) &&  $scope.setCurrentItem(-1);
      $scope.currentPageIndex = index;
      $scope.currentPage=$scope.pages[index];
    };
    
    
    //初始化，-1表示没有选中
    $scope.setCurrentPage(0);
    $scope.setCurrentItem(-1);
    
    //新增页面
    $scope.newPage = function(){
      $scope.pages.push({
        items:[],
        id:idgen.newId()
      });
    };
    
    //删除页面 
    $scope.removePage = function(index){
      $scope.pages.splice(index,1);
      if($scope.currentPageIndex>=index){
        $scope.setCurrentPage($scope.currentPageIndex-1);
      }
    };
    
    //新增元件
    $scope.newItem = function(){
      var itemId = idgen.newId();
      $scope.pages[$scope.currentPageIndex].items.push(itemId);
      $scope.items[itemId]={
        id:itemId,
        name:'未命名'+itemId,
        text:'未命名'+itemId,
        type:'text',
        style:{
          top:40,
          left:40,
          width:20,
          height:20,
          fontSize:12,
          backgroundRepeat:'no-repeat'
        }
      };
    };
    
    //删除元件
    $scope.removeItem = function(index){
      var itemId = $scope.pages[$scope.currentPageIndex].items[index];
      $scope.pages[$scope.currentPageIndex].items.splice(index,1);
      delete $scope.items[itemId];
    };
    
    $scope.save = function(){
      var pageHtmls = [];
      var pageCss= [];
      var usedItems = [];
      //pages
      angular.forEach($scope.pages, function(page) {
        var itemHtmls=[];
        angular.forEach(page.items, function(itemId) {
          usedItems.push(itemId);
          var item = $scope.items[itemId]
          var itemHtml = '<div class="e'+item.id+'">'+$filter('h5content')(item,true)+'</div>';
          this.push(itemHtml);
        },itemHtmls);        
        this.push(itemHtmls.join(''));
      }, pageHtmls);
      //css
      angular.forEach(usedItems, function(itemId) {
        var item = $scope.items[itemId]
        var obj = $filter('stylefilter')(item.style,item.type);
        var itemCss = [];
        angular.forEach(obj, function(v,k){
          this.push(k+':'+v+';');
        },itemCss);
        this.push('.e'+item.id+'{'+itemCss.join('')+'}');
      },pageCss);
      var css = pageCss.join("\n\r");
      
      
      $http.post('/json/'+$scope.project,{
        pages:$scope.pages,
        items:$scope.items,
        pageHtmls:pageHtmls,
        curId:idgen.getId(),
        css:css,
        id:$scope.project
      }).then(function(rtn) {
        alert('保存成功')
      },function(){
        alert('网络异常！');
      });
    };
    
  }]);