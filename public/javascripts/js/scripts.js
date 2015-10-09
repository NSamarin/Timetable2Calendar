var ts;


$(document).ready(function () {

    $("div.toggle").toggle();
    $(".btn-primary").click(function () {

        if ($('input').val().indexOf("browser") == -1) {
            $($('input')).parents('div').addClass('has-warning');
            alert("Your link is not correct, please try again.");
        } else {
            $("div.toggle").toggle(1000);
        }
    });


    $("#google").click(function () {
        var url = $("#url_input").val();
        $.get("/download/csv", {url: url}, function (response) {
            ts = response.ts;
            window.location.href = '/timetables/timetable_' + ts + '.csv';
        });

    });

    $("#apple").click(function () {
        var url = $("#url_input").val();
        $.get("/download/ics", {url: url}, function (response) {
            ts = response.ts;
            window.location.href = '/timetables/timetable_' + ts + '.ics';
        });

    });
});

$("div.toggle").toggle();
$(".btn-primary").click(function () {

    if (!isUrlValid($('input').val()) || $('input').val().indexOf("path") == -1) {
        $($('input')).parents('div').addClass('has-warning');
        alert("Your link is not correct, please try again.");
    } else {
        $("div.toggle").toggle(1000);
    }
});


$("#google").click(function () {
    var url = $("#url_input").val();
    $.get("/download/csv", {url: url}, function (response) {
        ts = response.ts;
        window.location.href = '/timetables/timetable_' + ts + '.csv';
    });

});

$("#apple").click(function () {
    var url = $("#url_input").val();
    $.get("/download/ics", {url: url}, function (response) {
        ts = response.ts;
        window.location.href = '/timetables/timetable_' + ts + '.ics';
    });

});


