$("#submitBtn").click(() => {
    swal({
        title: "Missing Details",
        text: "Please make sure the form is complete before submitting",
        icon: "error",
        dangerMode: true,
    }); 
});