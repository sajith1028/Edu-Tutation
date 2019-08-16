$("#check-btn").click(() => {
    $.ajax({
        url: `http://localhost:8080/admin/api/item`,
        data: { itID: $("#itID").val() }
    }).done((data) => {
        console.log(data);
        $("#unit").val(data.unit);
        $("#description").val(data.description);
        $("#instock-qty").val(data.inStockQty);
        console.log(data.description);
        console.log(data.inStockQty);
        console.log(data.unit);
    });
});


$("#n-submit-btn").click(() => {
    const unitInput = $("#n-unit");
    const remarksInput = $("#n-remarks");
    const descriptionInput = $("#n-description");

    if(unitInput.val() == "" || remarksInput.val() == "" || descriptionInput.val() == "") {
        swal("Empty fields!", "Please fill all fields", "warning");
    } else {
        $.ajax({
            url: 'http://localhost:8080/admin/api/add-item',
            data: {
                unit: unitInput.val(),
                remarks: remarksInput.val(),
                description: descriptionInput.val()
            },
            method: 'POST'
        }).done((data) => {
            swal(data);
        })
    }
});

$("#r-submit-btn").click(() => {
    const itIDInput = $("#itID");
    const receivedQtyInput = $("#received-qty");

    if(itIDInput.val() == "" || receivedQtyInput.val() == "") {
        swal("Empty fields!", "Please fill all fields", "warning");
    } else {
        $.ajax({
            url: 'http://localhost:8080/admin/api/add-received-item',
            data: {
                itID: itIDInput.val(),
                qty: receivedQtyInput.val()
            },
            method: 'POST'
        }).done((data) => {
            swal(data);
        });
    }
});