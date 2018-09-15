$(function() { // toggling active in navbar
   $("hidden-xs").click(function() {
      $("hidden-xs").removeClass("active");
      $(this).addClass("active");
   });
});

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

$('#submitBtn').click(function(){
    //Empty name
       if($('#name2').val()==''){
           swal({
           title: "Name cannot be empty",
           icon: "error",
           dangerMode: true,
        });
        
        $('#name2').addClass('is-invalid');
                                }                      
       else{
           //Name not empty
            var stname = $('#name2').val();
            var RegExpression = /^[a-zA-Z\s]*$/; 
        
            if (RegExpression.test(stname)) {
             //correct name
                    
                       //Empty email
                    if($('#email2').val()==''){
                        swal({
                            title: "Email cannot be empty",
                            icon: "error",
                            dangerMode: true,
                        });
        
                        $('#email2').addClass('is-invalid');
                                            }
                    else
                        {
                        //Email is not empty
                        var email = $('#email2').val();
        
                        
                        if(/\S+@\S+\.\S+/.test(email)){
                            //Valid email
                            swal({
                                title: "Correct format.",
                                text:" valid email",
                                icon: "success",
                                dangerMode: false,
                                });
                            
                                            }
                        else{
                            //Invalid EMAIL
                            swal({
                                title: "Incorrect format.",
                                text:"Please insert a valid email",
                                icon: "error",
                                dangerMode: true,
                                });
            
                            $('#email2').addClass('is-invalid');
                            }   
                        }
                    }
                    else
                    {
                         //Incorrect name
                        swal({
                            title: "Illegal Characters",
                            text:"Please state your name correctly",
                            icon: "error",
                            dangerMode: true,
                            });
            
                        $('#name2').addClass('is-invalid');
                    }
                }
            });
                    
                
