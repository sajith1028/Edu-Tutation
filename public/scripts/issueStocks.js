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

$("#accept-btn").click(() => {
    console.log("Gee");
    $.ajax({
        url: 'http://localhost:8080/admin/api/accept-issue-request',
        data: { reqID: $("#req-id").attr("data-reqid")}
    }).done((data) => {
        swal(data).then((res) => {
            location.reload();
        });
    });
});

$("#deny-btn").click(() => {
    $.ajax({
        url: 'http://localhost:8080/admin/api/deny-issue-request',
        data: { reqID: $("#req-id").attr("data-reqid") }
    }).done((data) => {
        swal(data).then(res => {
            location.reload();
        });
    })
});