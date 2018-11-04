$(document).ready(function(){
  $('.team__comment-inner').slick({
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    dots: true,
    appendDots: ('.comment__author')
  });
});
