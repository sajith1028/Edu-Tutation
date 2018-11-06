$('#alyear1, #alyear2').change(function(){
    $.ajax({
        url: "/admin/register/alyear",
        type: "POST",
        contentType:"application/json",
        data: JSON.stringify({alyears:{"year":$(this).val()}})
    })
    .done(function(result){
        changeTable(result);
    })
});

$('.nav-item').click(function(){
    var div = $(".table");
    div.html(''); 
});

var changeTable = function(alyears){
    var div = $(".table");
    div.html('');
    div.hide();
    div.append(alyears);
    div.fadeIn(1000)
};

$('#submitbtn').click(function(){
    document.getElementById("registernew").submit();
});


$('#checkBtn').click(function(){
    var stid = $('#stID').val();
    $.ajax({
        url: "/admin/payments/name",
        type: "POST",
        contentType:"application/json",
        data: JSON.stringify({stID:{"stID":stid}})
    })
    .done(function(rs2){
        changeName(rs2);
    })
});

var changeName = function(stName){
    $("#name").val(stName);
};