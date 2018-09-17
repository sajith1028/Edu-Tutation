function validateForm(){
    if($('#courseFile').val().length==0){
        swal({
          title: "Please upload a file",
          icon: "error",
          dangerMode: true,
        });
        
        $('#courseFile').addClass('is-invalid');
        return false;
    }
}

$('#courseFile').click(function(){
    $('#courseFile').removeClass('is-invalid');
})