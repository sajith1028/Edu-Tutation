$('#checkBtn').click(function(){
    if($('#stID').val()==''){
        swal({
          title: "Student ID cannot be empty",
          icon: "error",
          dangerMode: true,
        });
        
        $('#stID').addClass('is-invalid');
    }
    else{
        var stid = $('#stID').val();
        
        if(stid.substr(0, 4)!="S-20" || stid.charAt(6)!="-" || stid.length!=10){
            swal({
              title: "Incorrect format. Please insert a valid student ID",
              icon: "error",
              dangerMode: true,
            });
            
            $('#stID').addClass('is-invalid');
        }
        
        else{
            $.ajax({
                url: "/admin/payments/name",
                type: "POST",
                contentType:"application/json",
                data: JSON.stringify({stID:{"stID":stid}})
            })
            .done(function(rs2){
                changeName(rs2);
            })
        }
    }
});

var changeName = function(stName){
    $("#name").val(stName);
    $("#"+$('#stID').val()+"chk").attr("checked", true);
};