$("#check-btn").click(() => {
    $.ajax({
        url: `http://localhost:8080/admin/api/item`,
        data: { itID: $("#itID").val()}
    }).done((data) => {
        console.log(data);
        $("#unit").val(data.unit);
        $("#description").val(data.description);
        $("#instock-qty").val(data.inStockQty);
    });
});

$("#submit-btn").click(() => {
    if ($("#unit").val() == "" || $("#issue-qty").val() == "" || $("itID").val()) {
        swal("Empty fields!", "Please fill all fields", "warning");
    } else {
        $.ajax({
            url: 'http://localhost:8080/admin/api/issue',
            data: { itID: $("#itID").val(), issueQty: $("#issue-qty").val()}
        }).done((data) => {
            swal(data);
        });
    }
});