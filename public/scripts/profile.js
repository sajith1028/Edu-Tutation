$(function() { // toggling active in navbar
   $("hidden-xs").click(function() {
      $("hidden-xs").removeClass("active");
      $(this).addClass("active");
   });
});

$('#submitBtn').click(function(){
    var valid=true;
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
                            //Valid email & name
                            var school=$('#school2').val();
                            
                            if(school!=''){
                                //School is not empty
                                if(/^\d+$/.test(school))
                                {
                                    //Invalid school
                                    swal({
                                        title: "Invalid school name",
                                        text:"Enter your school name correctly",
                                        icon: "error",
                                        dangerMode: true,
                                        });
        
                                    $('#school2').addClass('is-invalid');
                                    valid=false;
                                }
                                                        }
                                //valid school
                                var teleres = $('#teleres').val();
                                var telemob = $('#telemob').val();
                                
                                if(teleres!=''){
                                if(/^\d{9}$/.test(teleres)){
                                    //correct phone numbers
                                }
                                else
                                {
                                    swal({
                                    title: "Invalid residence number",
                                    icon: "error",
                                    dangerMode: true,
                                        });
        
                                    $('#teleres').addClass('is-invalid');
                                }
                                
                                if(telemob!=''){
                                if(/^\d{9}$/.test(telemob)){
                                    //correct phone numbers
                                }
                                else
                                {
                                    swal({
                                    title: "Invalid mobile number",
                                    icon: "error",
                                    dangerMode: true,
                                        });
        
                                    $('#telemob').addClass('is-invalid');
                                }
                                
                                if(valid)
                                {
                                    swal({
                                    title: "Valid",
                                    icon: "success",
                                    dangerMode: false,
                                        });
                                }
                                }
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
                    
                
