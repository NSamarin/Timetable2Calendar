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
        $.get("/download/csv", {
            url: url
        }, function (response) {
            ts = response.ts;
            window.location.href = '/timetables/timetable_' + ts + '.csv';
        });

    });

    $("#apple").click(function () {
        var url = $("#url_input").val();
        $.get("/download/ics", {
            url: url
        }, function (response) {
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
    $.get("/download/csv", {
        url: url
    }, function (response) {
        ts = response.ts;
        window.location.href = '/timetables/timetable_' + ts + '.csv';
    });

});

$("#apple").click(function () {
    var url = $("#url_input").val();
    $.get("/download/ics", {
        url: url
    }, function (response) {
        ts = response.ts;
        window.location.href = '/timetables/timetable_' + ts + '.ics';
    });

});


//google analytics
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-68681929-1', 'auto');
ga('send', 'pageview');

//facebook like/share button
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.5&appId=1917246968500417";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


