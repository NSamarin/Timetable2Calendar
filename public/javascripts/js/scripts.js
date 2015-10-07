// Empty JS for your own code to be here

$(document).ready(function(){
    $("div.toggle").toggle();
    $(".btn-primary").click(function(){
        $("div.toggle").toggle(1000);
    });

    $("#google").click(function() {
        var url = $("#url_input").val();
        $.get( "/download/csv", {url: url}, function() {
            console.log("download performed");
            window.location.href = '/download/csv';
        });

    });

    $("#apple").click(function() {
        var url = $("#url_input").val();
        $.get( "/download/ics", {url: url}, function() {
            console.log("download performed");
            window.location.href = '/download/ics';
        });

    });
});

