$(document).ready(function(){ // Add smooth scrolling to all links
  $("a").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
        window.location.hash = hash;
      });
    }
  });
});

$(function() { // toggling active in navbar
   $("a").click(function() {
      $("a").removeClass("active");
      $(this).addClass("active");
   });
});

$(document).scroll(function () {
    var y = $(this).scrollTop();
    if (y > 300){
      $('.left img').animate({ height:'500px' }, 1000);
    }
    if(y > 1000){
      $(".threeFeatures").fadeIn(1000);
    }
    if (y > 2100){
      $('.card-img-top').fadeIn(2000)
      $('.card-body').slideDown(2000);
    }
});

$(document).ready(function(){
    $(".threeFeatures").hover(function(){
        $(".threeFeaturesTop").css("box-shadow", "0 4px 10px 5px rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(79, 42, 24, 0.19)");
        }, function(){
        $(".threeFeaturesTop").css("box-shadow", "0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.19)");
    });
});