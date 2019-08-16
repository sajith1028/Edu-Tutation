$("#submitResult").click(() => {
    $.post(`/lecturer/ask-inventory/${$('#subID').val()}`, {
        itID: $("#itID").val(),
        qty: $("#qty").val()
    }).done((data) => {
        swal(data);
    })
});