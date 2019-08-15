console.log("Here");

$("#submitBtn").click(() => {
    console.log("It works");

    var inventoryRequestTab = $("isreq");
    var inventoryIssueTab = $("isinven");

    inventoryRequestTab.removeClass("active");
    inventoryRequestTab.addClass("fade");

    inventoryIssueTab.removeClass("fade");
    inventoryIssueTab.addClass("active");
});