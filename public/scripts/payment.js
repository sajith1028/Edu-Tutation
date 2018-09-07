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
});

var changeTable = function(stID){
    var div = $(".table");
    div.html('');
    div.hide();
    div.append(stID);
    div.fadeIn(1000)
};

// $('#saveBtn').click(function(){
//     console.log("hi");
//     document.getElementById("newpayment").submit();
// });