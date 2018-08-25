var hour = new Date().getHours();

$(document).ready(function(){
  if(hour > 5 && hour <= 11)
    $('.bg-picture > .bg-picture-overlay').css({"background-image":'url("https://i.imgur.com/odXkopW.png")', "background-size": "cover", "background-repeat": "no-repeat"});
  else if(hour > 11 && hour <= 15)
    $('.bg-picture > .bg-picture-overlay').css({"background-image":'url("https://i.imgur.com/HFEcueg.png")', "background-size": "cover", "background-repeat": "no-repeat"});
  else if(hour > 15 && hour <= 18)
    $('.bg-picture > .bg-picture-overlay').css({"background-image":'url("https://i.imgur.com/TsYjhS2.png")', "background-size": "cover", "background-repeat": "no-repeat"});
  else if(hour > 18 || hour <= 5)
    $('.bg-picture > .bg-picture-overlay').css({"background-image":'url("https://i.imgur.com/pQrc1hx.png")', "background-size": "cover", "background-repeat": "no-repeat"});
});

$(function() { // toggling active in navbar
   $("hidden-xs").click(function() {
      $("hidden-xs").removeClass("active");
      $(this).addClass("active");
   });
});