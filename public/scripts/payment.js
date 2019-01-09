var sum=0;
$("#saveBtn").prop("disabled",true); //at the beginning

var getValue = function(cb) {
    if(cb.checked)
        sum+=parseInt(cb.value.split(',')[2]); 
    else
        sum-=parseInt(cb.value.split(',')[2]);
    
    var div = document.getElementById('total');
    div.innerHTML = sum;
    
    if(sum==0)
        $("#saveBtn").prop("disabled",true);
    else
        $("#saveBtn").prop("disabled",false);
}

$('#stID').click(function(){
    $('#stID').removeClass('is-invalid');
})

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
                url: "/admin/payments/id",
                type: "POST",
                contentType:"application/json",
                data: JSON.stringify({stID:{"stID":stid}})
            })
            .done(function(result){
                changeTable(result);
            })
            
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

var changeTable = function(stID){
    var div = $(".table");
    div.html('');
    div.hide();
    div.append(stID);
    div.fadeIn(1000);
};

var changeName = function(stName){
    $("#name").val(stName);
};