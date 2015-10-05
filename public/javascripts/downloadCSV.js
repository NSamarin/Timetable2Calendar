var fs = require('fs');
var generateCSV= require('./generateCSV');

function downloadCSV(year, month, day, items) {
    var data = generateCSV(year, month, day, items);
    var csvData = [];

    data.forEach(function (item, index, array) {
        csvData.push(item.subject + "," + item.startDate + "," + item.startTime + "," + item.endDate + "," + item.endTime + "," + item.allDayEvent + "," + item.location + "," + item.private);
    });


    // download stuff
    var buffer = csvData.join("\n");
    var uri = "data:text/csv;charset=utf8," + encodeURIComponent(buffer);
    var fileName = "timetable.csv";
    fs.writeFile(fileName, buffer, function (err) {
        console.log('File successfully written! - Check your project directory for the timetable.csv file');
    });
}

module.exports = downloadCSV;