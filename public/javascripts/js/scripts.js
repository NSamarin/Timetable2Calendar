// Empty JS for your own code to be here

$(document).ready(function () {
    $("div.toggle").toggle();
    $(".btn-primary").click(function () {

        if ($('input').val().length === 0) {
            $($('input')).parents('div').addClass('has-warning');
            alert("Your link is not correct, please try again.");
        } else {
            $("div.toggle").toggle(1000);
        }
    });



    $("#google").click(function () {
        var url = $("#url_input").val();
        $.get("/download/csv", {
            url: url
        }, function (response) {
            console.log("from front", response);
            window.location.href = '/timetable.csv';
        });

    });

    $("#apple").click(function () {
        var url = $("#url_input").val();
        $.get("/download/ics", {
            url: url
        }, function () {
            console.log("download performed");
            window.location.href = '/download/ics';
        });

    });
});