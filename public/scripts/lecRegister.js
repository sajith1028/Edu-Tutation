$('#submitBtn').click(function(){
    
        //if selected tab is new lecturer, submit form to register new lecturer
        var selectedTab= $('.nav-tabs .active').text();
        if(selectedTab=="New Lecturer") {
            var firstname=$('#firstname').val()
            var lastname=$('#lastname').val()
            var nic=$('#nic').val()
            var email=$('#email').val()
            
            if(firstname!='' && lastname!='' && nic!='' && email!='')
                {
                    var RegExpression = /^[a-zA-Z\s]*$/; 
                    if (RegExpression.test(firstname) && RegExpression.test(lastname)) {
                    //Correct name
                        if(/\S+@\S+\.\S+/.test(email))
                        {
                            //Valid email
                            if(nic.length==12 || nic.length==10)
                            {
                                //valid nic
                                $('#registernew').submit();
                                
                            }
                            else
                            {
                                //invalid nic
                                swal({
                                title: "Incorrect format.",
                                text:"Please insert a valid NIC",
                                icon: "error",
                                dangerMode: true,
                                });
                            }
                        }
                        else
                        {
                            //invalid email
                            
                                swal({
                                title: "Incorrect format.",
                                text:"Please insert a valid email",
                                icon: "error",
                                dangerMode: true,
                                });
                        
                    
                        }
                    }
                    else
                    //Incorrect name
                    {
                        swal({
                        title: "Invalid Characters",
                        text: "Please state the name correctly",
                        icon: "error",
                        dangerMode: true,
                    });
                    }
                }
                
            else
            {
                swal({
                        title: "Missing Details",
                        text: "Please make sure the form is complete before submitting",
                        icon: "error",
                        dangerMode: true,
                    }); 
            }
        }
        else
        {
            //Add new class details to lecturer
            var count = $('.table tr').length;
             
            var subname=document.getElementsByName("subName")[0].value;
            var medium=document.getElementsByName("medium")[0].value;
            var hall=document.getElementsByName("hall")[0].value
            var day=document.getElementsByName("day")[0].value
            var from=document.getElementsByName("from")[0].value
            var to=document.getElementsByName("to")[0].value
            var year=document.getElementsByName("year")[0].value
            var fee=document.getElementsByName("fee")[0].value
            var lecID=$('#checkID').val();
            
            
            
                $.ajax({
                    url: "/admin/register/subject/new",
                    type: "POST",
                    contentType:"application/json",
                    data: JSON.stringify({subname:subname ,medium:medium ,hall:hall ,from:from ,to:to ,year:year ,day:day ,fee:fee,lecID:lecID })
                    })
                        .done(function(result){
                            changeTable(result);
                                                })
                                                
            //Display alert for whether the Hall is free or not                                    
            setTimeout(function(){
                if($('.table tr').length==count) { 
                    
                    swal({
                        title: "Retry",
                        text: hall+" is occupied in the requested time slot!",
                        icon: "error",
                        dangerMode: true,
                    });  
                    
                }
                                                                    
                else {     
                    
                    swal({
                        title: "Success",
                        text: hall+" is reserved for "+subname+" on "+day+" from "+from+" to "+to,
                        icon: "success",
                        dangerMode: false,
                    });
                                    }
                
                            }, 2500);
            
        }
 });
 
$('#deleteBtn').click(function(){
    
        //if selected tab is not new lecturer, delete class
        var selectedTab= $('.nav-tabs .active').text();
        
        if(selectedTab!="New Lecturer") {
            //send subject ID to be deleted
            var subID=document.getElementsByName("subjectID")[0].value;
            var subname=document.getElementsByName("subName")[0].value;
            
          swal({
            title: "Are you sure?",
            text: "The subject "+subID+" "+subname+" will be deleted!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
              swal("The subject has been deleted!", {
                icon: "success",
              });
              
             $.ajax({
                url: "/admin/delete/subject/"+subID,
                type: "POST",
                contentType:"application/json"
            })
            .done(function(result){
            })
            }
            setTimeout(function(){$('#Check').click();}, 1000);
          });
            
           
        }
    
});
            
            
            
            
//On page load, if LecID is sent change tab to Assign Class 
$(document).ready(function(){
    //After registering a new lecturer, continue to assign a class
    if($('#checkID').val()!=0) {
        $('a[href="#curLec"]').click();
        $('#Check').click();
    }
    
//Display the update button only for Assign Class tab
 var selectedTab= $('.nav-tabs .active').text();
        if(selectedTab=="New Lecturer")
            {
                document.getElementById("updateBtn").style.visibility="hidden";
                document.getElementById("deleteBtn").style.visibility="hidden";
            } 
 });

$('#Check').click(function(){
    
    var lecID=$('#checkID').val();
    
    //Populate table with class details
        $.ajax({
        url: "/admin/register/lecturer/new/class",
        type: "POST",
        contentType:"application/json",
        data: JSON.stringify({lecID:{"lecID":lecID}})
    })
    .done(function(result){
        changeTable(result);
    })
    
    //Let the class details be updated
    document.getElementById("updateBtn").style.visibility="visible";
    document.getElementById("deleteBtn").style.visibility="visible";
});                


$('.nav-item').click(function(){
    var div = $(".table");
    div.html(''); 
});

var changeTable = function(alclasses){
    var div = $(".table");
    div.html('');
    div.hide();
    div.append(alclasses);
    div.fadeIn(1000);
};

$('#updateBtn').click(function(){
    
        //if selected tab is assign class, update the class details on form
        var selectedTab= $('.nav-tabs .active').text();
        if(selectedTab=="Assign Class") {
            
            //Retrieve data from form
            var subID=document.getElementsByName("subjectID")[0].value;
            var subname=document.getElementsByName("subName")[0].value;
            var medium=document.getElementsByName("medium")[0].value;
            var hall=document.getElementsByName("hall")[0].value
            var day=document.getElementsByName("day")[0].value
            var from=document.getElementsByName("from")[0].value
            var to=document.getElementsByName("to")[0].value
            var year=document.getElementsByName("year")[0].value
            var fee=document.getElementsByName("fee")[0].value
            var lecID=$('#checkID').val();
            
            
                $.ajax({
                    url: "/admin/register/subject/update",
                    type: "POST",
                    contentType:"application/json",
                    data: JSON.stringify({subID:subID,subname:subname ,medium:medium ,hall:hall ,from:from ,to:to ,year:year ,day:day ,fee:fee,lecID:lecID })
                    })
                        .done(function(result){
                            changeTable(result);
                                                })
            
        }
 });
 
 
 