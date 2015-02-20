var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio'); //scraping tool
var app = express();

app.get('/csvexport', function (req, res) {
    //put link to the PATH timetable
    url = 'https://browser.ted.is.ed.ac.uk/generate?courses[]=BILG09014_SV1_SEM2&courses[]=BUST10118_SV1_SEM2&courses[]=BUST10021_SV1_SEM2&show-close=1&period=SEM2#';

    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            var course, type, times, location, day;
            var weeks = [];
            var event = {
                course: "",
                type: "",
                location: "",
                times: "",
                day: "",
                weeks: []
            };
            event.weeks = [];
            var items = [];


            $('.event-head span.course').each(function (i, elem) {
                items[i] = {
                    course: $(this).text()
                };
                items[i].day = $(this).parent().parent().parent().parent().find('th').text();
                if (items[i].day == '' && i != 0) {
                    //console.log(' INSIDE IF ');
                    items[i].day = items[i - 1].day;
                }
                //console.log(items[i].day + ' we have ' + items[i].course);
            });

            $('.type').each(function (i, elem) {
                items[i].type = $(this).clone().find('br').remove().end().find('small').remove().end().text().replace(/\s+/g, "");
                //console.log(i + " type is " + items[i].type);            
            });

            $('div.times').each(function (i, elem) {
                items[i].times = $(this).clone().find('i').remove().end().text().replace(/\s+/g, "");
                //console.log(i + ' time is:' + items[i].times);
            });

            $('ul.facts').each(function (i, elem) {
                items[i].location = $(this).children().last().clone().find('span').remove().end().text().trim();
                //console.log(i+ ' location: ' + items[i].location);
            });

            $('table .weeks').each(function (i, elem) {
                //console.log(' GOT INTO WEEKS FIRST PART' + $(this).find('.on').text());
                items[i].weeks = new Array();
                $(this).find('.on').each(function (n, nelem) {
                    //console.log(' GOT INTO WEEKS SECOND PART = ' + $(this).text());
                    items[i].weeks.push($(this).text());
                    //console.log($(this).text() + ' has added into week array');
                });

            });

            items.forEach(function (obj) {
                //console.log(obj.course + ' ' + obj.type + ' ' + obj.location + ' ' + obj.times + ' ' + obj.day + ' ' + obj.weeks.join()) + "\n";
            });

            function downloadICS() {

                var data = generateICS(2015, 0, 12);
                var csvData = new Array();

                csvData.push("BEGIN:VCALENDAR\rVERSION:2.0\rPRODID:-//Timetable2Calendar//EN\rCALSCALE:GREGORIAN\rX-WR-CALNAME;VALUE=TEXT:timetable");

                data.forEach(function (item, index, array) {

                    csvData.push("BEGIN:VEVENT\rSUMMARY:" + item.subject + "\rDESCRIPTION:\rDTSTAMP:" + item.startDate + "\rDTSTART:" + item.startDate + "\rDTEND:" + item.endDate + "\rLOCATION:" + item.location + "\rEND:VEVENT\r");
                });

                csvData.push("END:VCALENDAR");
                // download stuff
                var buffer = csvData.join("\n");
                var uri = "data:text/csv;charset=utf8," + encodeURIComponent(buffer);
                var fileName = "timetable.ics";
                fs.writeFile(fileName, buffer, function (err) {
                    console.log('File successfully written! - Check your project directory for the timetable.ics file');
                })

                /*var link = document.createElement("a");

                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    link.setAttribute("href", uri);
                    link.setAttribute("download", fileName);
                } else if (navigator.msSaveBlob) { // IE 10+
                    link.addEventListener("click", function (event) {
                        var blob = new Blob([buffer], {
                            "type": "text/csv;charset=utf-8;"
                        });
                        navigator.msSaveBlob(blob, fileName);
                    }, false);
                } else {
                    // it needs to implement server side export
                    link.setAttribute("href", "http://www.example.com/export");
                }

                link.innerHTML = "Export to ICS";
                document.body.appendChild(link);
                */
            }


            function downloadCSV() {
                //enter year, (month-1) and day when the semester starts (Monday of the study week 1)
                var data = generateCSV(2015, 0, 12);
                var csvData = new Array();

                data.forEach(function (item, index, array) {
                    csvData.push(item.subject + "," + item.startDate + "," + item.startTime + "," + item.endDate + "," + item.endTime + "," + item.allDayEvent + "," + item.location + "," + item.private);
                });

                // download stuff
                var buffer = csvData.join("\n");
                var uri = "data:text/csv;charset=utf8," + encodeURIComponent(buffer);
                var fileName = "timetable.csv";
                fs.writeFile(fileName, buffer, function (err) {
                        console.log('File successfully written! - Check your project directory for the timetable.csv file');
                    })
                    /*
                      var link = document.createElement("a");
                      
                      if (link.download !== undefined) { // feature detection
                        // Browsers that support HTML5 download attribute
                        link.setAttribute("href", uri);
                        link.setAttribute("download", fileName);
                        }
                      
                        else if (navigator.msSaveBlob) { // IE 10+
                        link.addEventListener("click", function (event) {
                        var blob = new Blob([buffer], {
                        "type": "text/csv;charset=utf-8;"
                        });
                          navigator.msSaveBlob(blob, fileName);
                        }, false);
                      }
                      else {
                        // it needs to implement server side export
                        link.setAttribute("href", "http://www.example.com/export");
                      }

                      link.innerHTML = "Export to CSV";
                      document.body.appendChild(link);
                    */
            }



            function generateICS(startYear, startMonth, startDay) {
                /* var items = [{
                    course: "Calculus and its Applications",
                    type: "Lecture",
                    times: "Start:12:10,End:13:00",
                    weeks: [1, 3],
                    day: "Monday",
                    location: "George Square Lecture Theatre"
    }, {
                    course: "Psychology 1",
                    type: "Tutorial",
                    times: "Start:11:10,End:12:00",
                    weeks: [1, 2, 3],
                    day: "Wednesday",
                    location: "DHT Lecture Theatre A"
    }];
*/
                //var startYear = 2016;
                //var startMonth = 0;
                //var startDay = 11;

                var exportArray = [];
                var headersArray = ["Subject", "Start Date", "Start Time", "End Date", "End Time", "All Day Event", "Location", "Private"];

                var n = 0;

                // exportArray[n] = {subject: headersArray[0], startDate: headersArray[1], startTime: headersArray[2], endDate: headersArray[3], endTime: headersArray[4], allDayEvent: headersArray[5], location: headersArray[6], private: headersArray[7]};

                //n++;

                var numberOfEvents = items.length;

                for (i = 0; i < numberOfEvents; i++) {
                    if (items[i].type.indexOf("Lecture") !== -1) {

                        var numberOfWeeks = items[i].weeks.length;

                        var weekNumber;
                        var dayOffset;

                        switch (items[i].day) {
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


                        var newEvent = new Array(numberOfWeeks);
                        for (var j = 0; j < numberOfWeeks; j++) {
                            newEvent[j] = new Array(8);
                        }


                        for (j = 0; j < numberOfWeeks; j++) {

                            var date = new Date(startYear, startMonth, startDay);

                            if (items[i].weeks[j] <= 5) {
                                weekNumber = items[i].weeks[j];
                            } else {
                                weekNumber = parseInt(items[i].weeks[j]) + 1;
                            }

                            date.setDate(date.getDate() + (weekNumber - 1) * 7 + dayOffset);

                            var newDate = date.toISOString().split("T");
                            newNewDate = newDate[0].split("-");

                            var time = items[i].times.split(",");
                            var newTime1 = time[0].split(":");
                            var newTime2 = time[1].split(":");
                            //console.log(newTime1);

                            newEvent[j][0] = items[i].course + " (" + items[i].type + ")";
                            newEvent[j][1] = newNewDate[0] + newNewDate[1] + newNewDate[2] + "T" + newTime1[1] + newTime1[2] + "00";
                            newEvent[j][2] = time[0].substring(6) + ":00";
                            newEvent[j][3] = newNewDate[0] + newNewDate[1] + newNewDate[2] + "T" + newTime2[1] + newTime2[2] + "00";
                            newEvent[j][4] = time[1].substring(4) + ":00";
                            newEvent[j][5] = "False";
                            newEvent[j][6] = items[i].location;
                            newEvent[j][7] = "True";

                            exportArray[n + j] = {
                                subject: newEvent[j][0],
                                startDate: newEvent[j][1],
                                startTime: newEvent[j][2],
                                endDate: newEvent[j][3],
                                endTime: newEvent[j][4],
                                allDayEvent: newEvent[j][5],
                                location: newEvent[j][6],
                                private: newEvent[j][7]
                            };

                            console.log(newEvent[j]);

                        }

                        n += numberOfWeeks;

                    }
                }

                console.log(exportArray);
                return exportArray;

            }



            function generateCSV(startYear, startMonth, startDay) {

                var exportArray = [];
                var headersArray = ["Subject", "Start Date", "Start Time", "End Date", "End Time", "All Day Event", "Location", "Private"];

                var n = 0;

                exportArray[n] = {
                    subject: headersArray[0],
                    startDate: headersArray[1],
                    startTime: headersArray[2],
                    endDate: headersArray[3],
                    endTime: headersArray[4],
                    allDayEvent: headersArray[5],
                    location: headersArray[6],
                    private: headersArray[7]
                };

                n++;

                var numberOfEvents = items.length;
                var numberOfHeaders = headersArray.length;

                for (i = 0; i < numberOfEvents; i++) {
                    if (items[i].type.indexOf("Lecture") !== -1) {

                        var numberOfWeeks = items[i].weeks.length;

                        var weekNumber;
                        var dayOffset;

                        switch (items[i].day) {
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


                        var newEvent = new Array(numberOfWeeks);
                        for (var j = 0; j < numberOfWeeks; j++) {
                            newEvent[j] = new Array(8);
                        }

                        //    console.log(numberOfWeeks);
                        for (j = 0; j < numberOfWeeks; j++) {

                            var date = new Date(startYear, startMonth, startDay);

                            if (items[i].weeks[j] <= 5) {
                                weekNumber = items[i].weeks[j];
                            } else {
                                weekNumber = parseInt(items[i].weeks[j]) + 1;
                            }

                            date.setDate(date.getDate() + (weekNumber - 1) * 7 + dayOffset);

                            console.log(items[i].location);
                            //var dateShort = date.toLocaleDateString();

                            var time = items[i].times.split(",");

                            newEvent[j][0] = items[i].course + " (" + items[i].type + ")";
                            newEvent[j][1] = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                            newEvent[j][2] = time[0].substring(6) + ":00";
                            newEvent[j][3] = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
                            newEvent[j][4] = time[1].substring(4) + ":00";
                            newEvent[j][5] = "False";
                            newEvent[j][6] = '"' + items[i].location + '"';
                            newEvent[j][7] = "True";

                            exportArray[n + j] = {
                                subject: newEvent[j][0],
                                startDate: newEvent[j][1],
                                startTime: newEvent[j][2],
                                endDate: newEvent[j][3],
                                endTime: newEvent[j][4],
                                allDayEvent: newEvent[j][5],
                                location: newEvent[j][6],
                                private: newEvent[j][7]
                            };

                            console.log(newEvent[j]);

                        }

                        n += numberOfWeeks;
                    }
                }

                console.log(exportArray);
                return exportArray;

            }

            downloadCSV();
            downloadICS();
        } else {
            console.log('url request failed');
        }

        res.send('<b>timetable.csv and timetable.ics</b> have been successfully saved to your hard drive. ' + '<script>alert("timetable.csv and timetable.ics have been successfully saved to your hard drive.")</script>');
        //<div class=\'mydiv\'><button onclick="downloadCSV()">Generate CSV File</button></div>

    }); //request()
}); //app()


app.listen('8081');
console.log('Go to http://localhost:8081/csvexport');
exports = module.exports = app;
