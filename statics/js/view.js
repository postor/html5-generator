;
var myScroll;
function loaded () {
  myScroll = new IScroll('#wrapper', {
    scrollX: false,
    scrollY: true,
    momentum: false,
    snap: true,
    snapSpeed: 400,
    zoom: false
  });
  $body = $('body');
  myScroll.on('scrollEnd', function () {
    $body.attr('class','p'+(this.currentPage.pageY));
  });
  $body.attr('class','p'+(myScroll.currentPage.pageY));
}
document.addEventListener('touchmove', function (e) { 
  e.preventDefault(); 
}, false);


$('[data-goto]').on('click touchstart',function(e){
  setTimeout(function(){
    myScroll.goToPage(0,parseInt($(e.srcElement).attr('data-goto')));
  },1);
});
