$('#commentBtn').click(function(){
    var subID=$('#subID').val();
    $.ajax({
                url: "/student/discussions/"+subID+"/comment",
                type: "POST",
                contentType:"application/json", 
                data: JSON.stringify({comment:$('#commentDescr').val(),postID:document.getElementById("commentDescr").name})
            })
            .done(function(result){
            })
});