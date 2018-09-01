$('#alyear').change(function(){
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

var changeTable = function(alyears){
    var div = $("#table");
    div.html(''); 
    div.append(alyears);
};