$('.commentBtn').click(function(){
    var subID=$('#subID').val();
    var clickedPost=(this.id)
    var comment=document.getElementsByName(clickedPost)[0].value
    
    
    $.ajax({
                url: "/student/discussions/"+subID+"/comment",
                type: "POST",
                contentType:"application/json", 
                data: JSON.stringify({comment:comment,postID:clickedPost})
            })
            .done(function(result){
            })
});

$('.delCBtn').click((function(){
  var subID=$('#subID').val();
  var clickedPost=(this.id)
  
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
      
      //Send POST req to delete route
      $.ajax({
                    url: "/student/discussion/delete/"+subID+"/comment/"+(this.id),
                    type: "POST",
                    contentType:"application/json",
                    data:{}
                    })
                        .done(function(){window.location.href="https://akura-nimesha.c9users.io/student/discussions/"+subID;})
    }
  });
  
})
);

$('.delPBtn').click((function(){
  var clickedPost=(this.id)
  var subID=$('#subID').val();
  
    swal({
    title: "Are you sure?",
    text: "This post will be deleted!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      swal("The post has been deleted!", {
        icon: "success",
      });
    
     $.ajax({
                    url: "/student/discussion/delete/"+subID+"/post/"+clickedPost,
                    type: "POST",
                    contentType:"application/json",
                    data:{}
                    })
                        .done(function(){window.location.href="https://akura-nimesha.c9users.io/student/discussions/"+subID;})
    }
  });
  
})
);