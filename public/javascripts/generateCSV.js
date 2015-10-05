var exportArray = [];

function generateCSV(startYear, startMonth, startDay, items) {
    //create export array and populate the headers
    exportArray = [{
        subject: "Subject",
        startDate: "Start Date",
        startTime: "Start Time",
        endDate: "End Date",
        endTime: "End Time",
        allDayEvent: "All Day Event",
        location: "Location",
        private: "Private"
    }];

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
        var times = extractTimeCSV(currentItem["times"]);
        //get day offsets for the current item
        var dayOffset = getDayOffset(currentItem["day"]);
        //loop the weeks array to create events for one item corresponding to all weeks
        for (var k = 0; k < weeks.length; k++) {
            //get the week offset - that is how many days need to be added to the initial date
            var weekOffset = (parseInt(weeks[k]) - 1) * 7;
            //create the date object for all the events for a particular item
            var date = new Date(startYear, startMonth, (startDay + dayOffset + weekOffset));
            var formattedDate = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();

            //push events to the export array
            exportArray.push({
                subject: currentItem["course"],
                startDate: formattedDate,
                startTime: times["startTime"],
                endDate: formattedDate,
                endTime: times["endTime"],
                allDayEvent: false,
                location: '\"' + currentItem["location"] + '\"',
                private: false
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

function extractTimeCSV(timeProperty) {
    var times = timeProperty.split(",");
    var start = times[0].substr(6);
    var end = times[1].substr(4);
    return {startTime: formatTimeCSV(start), endTime: formatTimeCSV(end)};
}

function formatTimeCSV(time) {
    var hour = parseInt(time.substr(0, 2));
    if (hour < 12 && hour != 0) time += " AM";
    else if (hour == 12) time += " PM";
    else if (hour == 0) time = "12" + time.substr(2) + " AM";
    else time = (hour - 12) + time.substr(2) + " PM";
    return time;
}

module.exports = generateCSV;