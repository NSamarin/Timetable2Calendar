var fs = require('fs');
var generateICS = require('./generateICS');

function downloadICS(year, month, day, items) {
    var data = generateICS(year, month, day, items);

    var csvData = [];

    csvData.push("BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Timetable2Calendar//EN\r\nCALSCALE:GREGORIAN\r\nX-WR-CALNAME;VALUE=TEXT:timetable");

    data.forEach(function (item, index, array) {
        csvData.push("BEGIN:VEVENT\r\nSUMMARY:" + item.subject + "\r\nDESCRIPTION:\r\nDTSTAMP:" + item.dateStamp + "\r\nDTSTART:" + item.startDate + "\r\nDTEND:" + item.endDate + "\r\nLOCATION:" + item.location + "\r\nEND:VEVENT\r\n");
    });

    csvData.push("END:VCALENDAR");
    // download stuff
    var buffer = csvData.join("\n");
    var uri = "data:text/csv;charset=utf8," + encodeURIComponent(buffer);
    var fileName = "timetable.ics";
    fs.writeFile(fileName, buffer, function (err) {
        console.log('File successfully written! - Check your project directory for the timetable.ics file');
    });
}

module.exports = downloadICS;