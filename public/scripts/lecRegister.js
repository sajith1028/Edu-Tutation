$('#submitBtn').click(function(){
    
        //if selected tab is new lecturer, submit form to register new lecturer
        var selectedTab= $('.nav-tabs .active').text();
        if(selectedTab=="New Lecturer") {
                $('#registernew').submit();
        }
        else
        {
            //Add new class details to lecturer
            $('#lecturer').val($('#checkID').val());
            $('#newsubject').submit();
            // $.ajax({
            //     url: "/admin/register/subject/new",
            //     type: "POST",
            //     contentType:"application/json",
            //     data: JSON.stringify({lecID:{"lecID":lecID}})
            //         })
            //     .done(function(result){
            //         changeTable(result);
            //         })
        }
 });
 
$(document).ready(function(){
    //After registering a new lecturer, continue to assign a class
    if($('#checkID').val()!=0) {
        $('a[href="#curLec"]').click();
        $('#Check').click();
    }
 });

$('#Check').click(function(){
    var lecID=$('#checkID').val();
    
        $.ajax({
        url: "/admin/register/lecturer/new/class",
        type: "POST",
        contentType:"application/json",
        data: JSON.stringify({lecID:{"lecID":lecID}})
    })
    .done(function(result){
        changeTable(result);
    })
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
