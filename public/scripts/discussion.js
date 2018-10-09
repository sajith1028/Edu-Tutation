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

$('.delCBtn').click((function(){
  
    swal({
    title: "Are you sure?",
    text: "This comment will be deleted!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      swal("The comment has been deleted!", {
        icon: "success",
      });
      document.getElementById("delComment").submit();
    }
  });
  
})
);