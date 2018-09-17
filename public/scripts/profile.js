$(function() { // toggling active in navbar
   $("hidden-xs").click(function() {
      $("hidden-xs").removeClass("active");
      $(this).addClass("active");
   });
});

$("img").error(function () {
  $(this).unbind("error").attr("src", "../images/users/notFound.png");
});

$('#submitBtn').click(function(){
    var valid=true;
    //Empty name
    var name=$('#name2').val();
       if(name==''){
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
                            
                                //school contains letters spaces & nums
                                if(RegExpression.test(school) || school==''  )
                                {
                                    var teleres = $('#teleres').val();
                                    
                                    if(/^\d{9}$/.test(teleres) || teleres==''){
                                    //correct res number
                                            
                                            var telemob = $('#telemob').val();
                                            
                                            if(/^\d{9}$/.test(telemob) || telemob==''){
                                                //correct mob number
                                            
                                                
                                                //everything is correct
                                                swal({
                                                title: "Saving ...",
                                                text: "Updating your details!",
                                                icon: "success",
                                                dangerMode: false,
                                                });         
                                                            var gender=$('#gender').val();
                                                            var address=$('#address2').val();
                                                            
                                                            var obj = {};
                                                            obj.name=name;
                                                            obj.school=school;
                                                            obj.teleres=teleres;
                                                            obj.telemob=telemob;
                                                            obj.email=email;
                                                            obj.gender=gender;
                                                            obj.address=address;

                                                            $.ajax({
                                                            url: "/student/profile",
                                                            type: "POST",
                                                            contentType:"application/json",
                                                            data: JSON.stringify(obj)
                                                            }).done(function(result){
                                                                window.location.href="https://akura-nimesha.c9users.io/student/profile";
                                                            });
                                                
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
                                      
                                }
                                else
                                {   //invalid school
                                  swal({
                                        title: "Invalid school name",
                                        text:"Enter your school name correctly",
                                        icon: "error",
                                        dangerMode: true,
                                        });
        
                                    $('#school2').addClass('is-invalid'); 
                                    
                                }
    //                                                     }
                                
                        
    //                     }
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
    //             }
    // }
       }
            });
            
