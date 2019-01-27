var form = $('#postForm').parsley();

$("#postForm").on('submit', function(e){
    var form = $(this);

    form.parsley().validate();

    if (form.parsley().isValid()){
        swal({
          title: "Post added to feed",
          icon: "success",
          dangerMode: false,
        })
    }
});


$('.delNPBtn').click((function(){
  
  
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
      
    //send post req to (this.id);
    $.ajax({
                    url: "/admin/newsfeed/delete/"+(this.id),
                    type: "POST",
                    contentType:"application/json",
                    data:{}
                    })
                        .done(function(){window.location.href="https://akura-nimesha.c9users.io/admin/newsfeeds";})
    }
  });
  
})
);