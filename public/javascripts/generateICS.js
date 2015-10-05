var exportArray = [];

function generateICS(startYear, startMonth, startDay, items) {
    //Filter "items" array so that only lecture events are created
    var lectures = items.filter(function (item) {
        return item.type == "Lecture";
    });

    //loop through lectures
    for (var i = 0; i < lectures.length; i++) {
        var currentItem = lectures[i];
        //get the weeks property
        var weeks = currentItem["weeks"];
        //extract correctly formatted start and end times
        var times = extractTimeICS(currentItem["times"]);
        //get day offsets for the current item
        var dayOffset = getDayOffset(currentItem["day"]);
        //loop the weeks array to create events for one item corresponding to all weeks
        for (var k = 0; k < weeks.length; k++) {
            //get the week offset - that is how many days need to be added to the initial date
            var weekOffset = (parseInt(weeks[k]) - 1) * 7;
            //create the date object for all the events for a particular item
            var date = new Date(startYear, startMonth, (startDay + dayOffset + weekOffset));
            //format dates to ICS standard (date + T + time + Z)
            var dateStart = formatDateICS(date, times["start"]);
            var dateEnd = formatDateICS(date, times["end"]);

            //get current date info & create a time stamp
            var currentDate = new Date();
            var currentHours = currentDate.getHours().toString();
            var currentMinutes = currentDate.getMinutes().toString();
            if (currentHours.length == 1) currentHours = "0" + currentHours;
            if (currentMinutes.length == 1) currentMinutes = "0" + currentMinutes;
            var dateStamp = formatDateICS(currentDate, currentHours + currentMinutes + "00");

            //format location so that it maches specification
            var location = formatLocationICS(currentItem["location"]);

            //push events to the export array
            exportArray.push({
                subject: currentItem["course"],
                startDate: dateStart,
                endDate: dateEnd,
                dateStamp: dateStamp,
                location: location
            });
        }
    }
    return exportArray;
}


function getDayOffset(day) {
    var dayOffset;
    switch (day) {
        case "Monday":
            dayOffset = 0;
            break;
        case "Tuesday":
            dayOffset = 1;
            break;
        case "Wednesday":
            dayOffset = 2;
            break;
        case "Thursday":
            dayOffset = 3;
            break;
        case "Friday":
            dayOffset = 4;
            break;
        case "Saturday":
            dayOffset = 5;
            break;
        case "Sunday":
            dayOffset = 6;
            break;
    }
    return dayOffset;
}

function extractTimeICS(timeProperty) {
    var times = timeProperty.split(",");
    var start = times[0].substr(6);
    var end = times[1].substr(4);
    return {start: formatTimeICS(start), end: formatTimeICS(end)};
}

function formatTimeICS(time) {
    var hour = time.split(":")[0];
    if (hour.length == 1) hour = "0" + hour;
    var minutes = time.split(":")[1];
    return hour + minutes + "00";
}

function formatDateICS(date, time) {
    var month = (date.getMonth() + 1).toString();
    var day = date.getDate().toString();
    if (month.length == 1) month = "0" + month;
    if (day.length == 1) day = "0" + day;
    return date.getFullYear().toString() + month + day + 'T' + time;
}

function formatLocationICS(location) {
    var formattedLocation = "";
    var locations = location.split(",");
    for (var i = 0; i < locations.length; i++) {
        formattedLocation += locations[i];
        if (i + 1 != locations.length) formattedLocation += "\\,";
    }
    return formattedLocation;
}

module.exports = generateICS;