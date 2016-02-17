var ts;
var n = 0; // to track whether at least one checkbox has been selected to enable Downloading links

function generateRow(eventName, hasOptions) {
    var result = "<tr> <td> <div class='checkbox'> <label> <input id=" + "check_" + eventName.toLowerCase()
        + " type='checkbox' onclick=" + "enableOptions('" + eventName.toLowerCase() + "')" + ">" + eventName + "</label> </div> </td>";
    if (hasOptions) {
        result += "<td> <div id='select_group'> " +
            "<select id=" + "sel_" + eventName.toLowerCase() + " class='form-control' disabled> " +
            "<option selected='selected'>Select group</option> </select> </div> </td>";
    }
    result += "</tr>";
    return result;
}

function addOptions(events, eventType, allEventTypes) {

    var encounteredOptions = [];

    var items = events.filter(function (item) {
        if ($.inArray(item['option'], encounteredOptions) > -1) return false;
        encounteredOptions.push(item['option']);
        return item['type'] == eventType;
    });
    var label = $.inArray(eventType, allEventTypes) + 1;

    var text;
    for (var j = 0; j < items.length; j++) {
        text = items[j]['option'] + ': ' + items[j]['day'] + ' '
            + items[j]['startTime'] + ' - ' + items[j]['endTime'];
        $('table#event_list tr:nth-of-type(' + label + ') select').append($("<option></option>").text(text));
    }


}


function checkStatus(n) {
    if (n > 0) {
        $("img").removeClass("desaturated");
        $("a#google, a#apple").removeClass("make-gray");
    } else {
        $("img").addClass("desaturated");
        $("a#google, a#apple").addClass("make-gray");
    }
}

function enableOptions(id) {

    if (document.getElementById("check_" + id).checked) {
        if (document.getElementById("sel_" + id)) document.getElementById("sel_" + id).disabled = false;
        n++;
        checkStatus(n);
    } else {
        if (document.getElementById("sel_" + id)) document.getElementById("sel_" + id).disabled = true;
        n--;
        checkStatus(n);
    }
}


$(document).ready(function () {

    var receivedResponse = false;

    $(".btn-primary").click(function () {
        //Insert code after pressing the submit button here:
        var url = $("#url_input").val();

        if ($('input').val().indexOf("browser") == -1) {
            $($('input')).parents('div').addClass('has-warning');
            alert("Your link is not correct, please try again.");
            return false;
        } else {

            if (receivedResponse) {
                $("div.toggle").toggle(700); //TODO: REMOVE FOLDING BACK
                receivedResponse = false;
                setTimeout(function(){$('table#event_list tbody').html("");}, 700);
                return false;
            }

            else {
                $.get("/generate/csv", {url: url}, function (events) {

                    var encounteredEvents = [];
                    var encounteredEventsWithOptions = [];

                    for (var i = 0; i < events.length; i++) {
                        if ($.inArray(events[i]['type'], encounteredEvents) > -1 || events[i]['type'] == "Type") continue;

                        encounteredEvents.push(events[i]['type']);

                        if ($.inArray(events[i]['type'], encounteredEventsWithOptions) == -1 && events[i]["option"]) encounteredEventsWithOptions
                            .push(events[i]['type']);

                        // last parameter is equivalent to TRUE if option exists
                        $('table#event_list > tbody').append(generateRow(events[i]['type'], events[i]["option"]));

                    }

                    for (var j = 0; j < encounteredEventsWithOptions.length; j++) {
                        addOptions(events, encounteredEventsWithOptions[j], encounteredEvents);
                    }

                    receivedResponse = true;
                    $("div.toggle").toggle(700);

                });

                return false;

            }
        }

    });


    $("#google").click(function () {
        if (!$("a").hasClass("make-gray")) {
            $('<p class="text-success">Please wait, downloading will start in 5 sec...</p>').appendTo('#intro');
            var url = $("#url_input").val();
            $.get("/download/csv", {
                url: url
            }, function (response) {
                ts = response.ts;
                window.location.href = '/timetables/timetable_' + ts + '.csv';
            });
        } else {
            alert("Please, select at least one type of events to import.");
        }
    });

    $("#apple").click(function () {
        if (!$("a").hasClass("make-gray")) {
            $('<p class="text-success">Please wait, downloading will start in 5 sec...</p>').appendTo('#intro');
            var url = $("#url_input").val();
            $.get("/download/ics", {
                url: url
            }, function (response) {
                ts = response.ts;
                window.location.href = '/timetables/timetable_' + ts + '.ics';
            });
        } else {
            alert("Please, select at least one type of events to import.");
        }
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
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.5&appId=1917246968500417";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//<!-- Yandex.Metrika counter -->
(function (d, w, c) {
    (w[c] = w[c] || []).push(function () {
        try {
            w.yaCounter33045043 = new Ya.Metrika({
                id: 33045043,
                clickmap: true,
                trackLinks: true,
                accurateTrackBounce: true,
                webvisor: true
            });
        } catch (e) {
        }
    });

    var n = d.getElementsByTagName("script")[0],
        s = d.createElement("script"),
        f = function () {
            n.parentNode.insertBefore(s, n);
        };
    s.type = "text/javascript";
    s.async = true;
    s.src = "https://mc.yandex.ru/metrika/watch.js";

    if (w.opera == "[object Opera]") {
        d.addEventListener("DOMContentLoaded", f, false);
    } else {
        f();
    }
})(document, window, "yandex_metrika_callbacks");
//<!-- /Yandex.Metrika counter -->