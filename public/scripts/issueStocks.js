$("#check-btn").click(() => {
    $.ajax({
        url: `/admin/api/item`,
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
            url: '/admin/api/issue',
            data: { itID: $("#itID").val(), issueQty: $("#issue-qty").val()}
        }).done((data) => {
            swal(data);
        });
    }
});

$("#accept-btn").click(() => {
    $.ajax({
        url: '/admin/api/accept-issue-request',
        data: { reqID: $("#req-id").attr("data-reqid")}
    }).done((data) => {
        swal(data).then((res) => {
            location.reload();
        });
    });
});

$("#deny-btn").click(() => {
    $.ajax({
        url: '/admin/api/deny-issue-request',
        data: { reqID: $("#req-id").attr("data-reqid") }
    }).done((data) => {
        swal(data).then(res => {
            location.reload();
        });
    })
});