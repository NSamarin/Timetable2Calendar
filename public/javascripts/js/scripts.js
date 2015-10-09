var ts;

function isUrlValid(url) {
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}
//|| $('input').val().indexOf("path") == -1
$(document).ready(function () {

<<<<<<< HEAD
            $("div.toggle").toggle();
            $(".btn-primary").click(function () {

                    if (!isUrlValid($('input').val())) {
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
=======
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
});
>>>>>>> origin/master
