$('#postBtn').click(function(){
  var content=$('.content').val()
  var title=$('.title').val()
  
  if(content!='' & title!='')
  {
        swal({
          title: "Post added to feed",
          icon: "success",
          dangerMode: false,
        });
        
    
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
      document.getElementById("deletePost").submit();
    }
  });
  
})
);