var sum=0;

var getValue = function(cb) {
    if(cb.checked)
        sum+=parseInt(cb.value);
    else
        sum-=parseInt(cb.value);
    
    var div = document.getElementById('total');
    div.innerHTML = sum;
}

$('#checkBtn').click(function(){
    var stid = $('#stID').val();
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