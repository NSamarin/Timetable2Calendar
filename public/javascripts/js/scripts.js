// Empty JS for your own code to be here

$(document).ready(function(){
    $("div.toggle").toggle();
    $(".btn-primary").click(function(){
        $("div.toggle").toggle(1000);
    });
});

