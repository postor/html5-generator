app.controller('homeCtrl',['$scope','idgen','$filter','$http','AnimateTypes','TransistionTypes','StyleCalc','LinkManage'
                           ,function($scope,idgen,$filter,$http,AnimateTypes,TransistionTypes,StyleCalc,LinkManage
                               ){

    //初始化页面列表
    $scope.pages=[{
      items:[],
      style:{
        backgroundColorTransparent:true,
        backgroundRepeat:'no-repeat'
      }
    }];
    
    $scope.pageStates = {pageTab:'page',itemTab:'item'};
    
    //初始化物品列表，注意是object
    $scope.items={};
    
    
    //初始化机型
    $scope.resolution = {};
    $scope.resolution.devices = {
      iphone6 : {height:667,width:375},
      iphone4 : {height:480,width:320}
    };
    $scope.resolution.deviceNames = Object.keys($scope.resolution.devices);
    
    $scope.info = {};
    $scope.info.currentResolution = $scope.info.currentResolution || 'iphone6';
    
    //初始化外部样式表（字体）
    $scope.links = [];
    $scope.updateLinks = function(){
      $scope.links = LinkManage.getLinks();
    }

    //id申请
    $scope.newId = function(){
      var id = idgen.newId();
      $scope.info.curId = id;
      return id;
    };

    //基本信息
    $scope.email = $('#email').val();
    $scope.project = $('#project').val();
    $http.get('/json/'+$scope.project).then(function(rtn) {
      if(rtn.data.error){
        alert('服务器异常！');
      }else{
        $scope.info = rtn.data.data;
        $scope.info.title = $scope.info.title || '新的项目';
        $scope.info.currentResolution = $scope.info.currentResolution || 'iphone6';
        $scope.info.curId = $scope.info.curId || 0;
        idgen.setId($scope.info.curId);
        $scope.pages = rtn.data.data.pages||[{
          items:[]
        }];
        
        $scope.items = rtn.data.data.items||{};  
        $scope.setCurrentPage(!!$scope.pages.length - 1);
        
        
        $scope.$applyAsync(function(scope){
          scope.updateLinks();
        });
      }
    },function(){
      alert('网络异常！');
    });
    
    $scope.ItemTypes = {
      text:'文字',
      image:'图像'
    };
    
    $scope.BorderStyles = {
        solid:'实线',
        dashed:'虚线'
      };
    
    $scope.AnimateTypes = AnimateTypes;
    
    
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
        id:$scope.newId()
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
      var itemId = $scope.newId();
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
          backgroundRepeat:'no-repeat',
          borderColor:'#000',
          borderStyle:'solid',
          borderWidth:0,
          backgroundColorTransparent:true
        },
        animate:{
          enabled: false,
          type: 'fadeIn',
          offsetX: 0,
          offsetY: 0,
          rotate: 0,
          scale: 1,
          delay: 0,
          duration: 0.6,
          timingFunction: 'ease',
          iterationCount: 1,
          opacity: 1
        },
        transition:{
          enabled: false,
          offsetX: 0,
          offsetY: 0,
          rotate: 0,
          scale: 1,
          delay: 0,
          duration: 0.6,
          timingFunction: 'ease',
          opacity: 1
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
      LinkManage.clearLinks();
      //pages html
      angular.forEach($scope.pages, function(page) {
        var itemHtmls=[];
        angular.forEach(page.items, function(itemId) {
          usedItems.push(itemId);
          var item = $scope.items[itemId]
          var itemHtml = '<div class="f t'+item.id+'"><div class="e e'+item.id
            +(item.animate.enabled?' '+$filter('animateClassName')(item):'')
            +'">'+$filter('h5content')(item,true)+'</div></div>';
          this.push(itemHtml);
        },itemHtmls);        
        this.push(itemHtmls.join(''));
      }, pageHtmls);
      
      //css for pages
      angular.forEach($scope.pages, function(page,pageIndex) {        
        var obj = $filter('stylefilter')(page.style,'image');
        this.push(StyleCalc.style2css(obj,'.page'+(pageIndex+1)));
        
        //css for items
        angular.forEach(page.items, function(itemId){
          var obj = $filter('stylefilter')($scope.items[itemId].style,'image');
          var c = StyleCalc.style2css(obj,'.e'+itemId)
          console.log(c);
          this.push(c);
        },pageCss);
        //css for item transition
        angular.forEach(page.items, function(itemId){
          var c = TransistionTypes.getCssContent($scope.items[itemId],pageIndex);
          console.log(c);
          this.push(c);
        },pageCss);
        
      },pageCss);
      //css for animation
      angular.forEach($scope.pages, function(page,pageIndex) {   
        var itemCss=[];
        angular.forEach(page.items, function(itemId) {       
          var itemCss = $filter('animateItem')($scope.items[itemId],pageIndex,false);
          this.push(itemCss);
        },itemCss);        
        this.push(itemCss.join(''));
      },pageCss);    
      
      var css = pageCss.join("\n\r");
      
      //提交
      delete $scope.info._id;
      $http.post('/json/'+$scope.project,angular.extend($scope.info,{
        pages:$scope.pages,
        items:$scope.items,
        pageHtmls:pageHtmls,
        curId:idgen.getId(),
        css:css,
        links:LinkManage.getLinks(),
        id:$scope.project
      })).then(function(rtn) {
        alert('保存成功')
      },function(){
        alert('网络异常！');
      });
    };
    
  }]);