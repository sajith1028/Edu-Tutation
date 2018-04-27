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
    if (y > 400){
      $('.card-img-top').fadeIn(2000)
      $('.card-body').slideDown(2000);
    }
});