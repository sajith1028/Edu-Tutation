var hour = new Date().getHours();

$(document).ready(function(){
  if(hour > 5 && hour <= 11)
    $('body').css({"background-image":'url("https://i.imgur.com/odXkopW.png")', "background-size": "cover", "background-repeat": "no-repeat"});
  else if(hour > 11 && hour <= 15)
    $('body').css({"background-image":'url("https://i.imgur.com/HFEcueg.png")', "background-size": "cover", "background-repeat": "no-repeat"});
  else if(hour > 15 && hour <= 18)
    $('body').css({"background-image":'url("https://i.imgur.com/TsYjhS2.png")', "background-size": "cover", "background-repeat": "no-repeat"});
  else if(hour > 18 || hour <= 5)
    $('body').css({"background-image":'url("https://i.imgur.com/pQrc1hx.png")', "background-size": "cover", "background-repeat": "no-repeat"});
});

$('#recovery').click(function(){
  swal({
          title: "Recovery Email Sent",
          icon: "success",
          dangerMode: false
        });
})