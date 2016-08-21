var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var ejs = require("ejs");


var request = require('request');
var cheerio = require('cheerio'); //scraping tool


var generateCSV = require('./public/javascripts/generateCSV');
var downloadCSV = require('./public/javascripts/downloadCSV');
var downloadICS = require('./public/javascripts/downloadICS');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

/*
    App parameters
    Enter year, (month-1) and day when the semester starts (Monday of the study week 1)
*/
var startYear = 2016;
var startMonth = 8;
var startDay = 19;

var skipWeek = false;
var url = "https://browser.ted.is.ed.ac.uk/generate?courses[]=BITE10013_SS1_YR&courses[]=BITE10002_SV1_SEM1&courses[]=BITE10001_SV1_SEM1&courses[]=BITE10007_SV1_YR&courses[]=BITE10006_SV1_SEM2&courses[]=CMSE10002_SV1_SEM1&show-close=1&show-close=1&period=SEM1";

var port = process.env.PORT || 3000;
//pp.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//app.use(express.static(path.join(__dirname, 'views')));

app.get('/', function(req, res) {
  res.render('index.html');
});

app.get('/generate/csv', function(req, res) {
    var url = req.query.url;
    console.log("Generating from " + url);
    if (!url) {
        res.redirect('/');
        return;
    }
    generateFile(url, true, function(data) {
        res.send(data);
    });
});

app.get('/download/csv', function(req, res) {
    var url = req.query.url;
    console.log(url);
    if (!url) {
        res.redirect('/');
        return;
    }
    getFile(url, true, function(ts) {
        console.log(ts);
        res.send({ts:ts});
        //console.log("ping from csv");
    });
});

app.get('/download/ics', function(req, res) {
    var url = req.query.url;
    console.log(url);
    if (!url) {
        res.redirect('/');
        return;
    }
    getFile(url, false, function(ts) {
        console.log(ts);
        res.send({ts:ts});
        //console.log("ping from ts");
    });

});


/*
 Main Function Start
 */

function getFile(url, isCSVRequest, callback) {

    //url = 'https://browser.ted.is.ed.ac.uk/generate?courses[]=BILG09014_SV1_SEM2&courses[]=BUST10118_SV1_SEM2&courses[]=BUST10021_SV1_SEM2&show-close=1&period=SEM2#';
    var ts = 0;

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

            var test = [];

            //var newDay = "";


            $('div.event').each(function (i) {

                var self = this;

                function getOption(){
                    var opt = $(self).find('span.label').text();
                    if (opt) opt = opt.split(" ")[1];
                    return opt;
                }

                function getWeeks(){
                    var weeks = [];
                    $(self).find('table.weeks td.on').each(function (j){
                        weeks.push($(this).text());
                    });
                    return weeks;
                }

                function getDay(i){
                    var day = $(self).parent().parent().find('th').text();
                    if (day == '' && i != 0) day = test[i - 1].day;
                    return day;
                    //if (day != "") newDay = day;
                    //return newDay;
                }

                function getLocation() {
                    var location = $(self).find('ul.facts').children().last().clone().find('span').remove().end().text().trim();
                    if (location.match(/Sem/g)) location = "";
                    return location;

                    //$(this).find('ul.facts > li:nth-of-type(2)').text().trim().replace(/Location:\r\n\t\t\t\t/, ""),
                }

                test[i] = {
                    course: $(this).find('span.course').text(),
                    option: getOption(),
                    type: $(this).find('span.type > small.centre').remove().end().find('span.type').text().trim(),
                    times: {
                        start: $(this).find('div.times > strong:nth-of-type(1)').text(),
                        end: $(this).find('div.times > strong:nth-of-type(2)').text()
                    },
                    location: $(this).find('ul.facts > li:nth-of-type(2)').text().trim().replace(/Location:\r\n\t\t\t\t/, ""),
                    //location: $(this).find('ul.facts > li:nth-of-type(2) span').remove().end().find('ul.facts > li:nth-of-type(2)').text().trim(),
                    weeks: getWeeks(),
                    day: getDay(i)
                };

            });

            //console.log(test);


            $('.event-head span.course').each(function (i, elem) {
                items[i] = {
                    course: $(this).text()
                };



                items[i].day = $(this).parent().parent().parent().parent().find('th').text();
                if (items[i].day == '' && i != 0) {
                    items[i].day = items[i - 1].day;
                }
            });

            $('.type').each(function (i, elem) {
                items[i].type = $(this).clone().find('br').remove().end().find('small').remove().end().text().replace(/\s+/g, "");
            });

            $('div.times').each(function (i, elem) {
                items[i].times = $(this).clone().find('i').remove().end().text().replace(/\s+/g, "");
            });

            $('ul.facts').each(function (i, elem) {
                items[i].location = $(this).children().last().clone().find('span').remove().end().text().trim();
            });

            $('table .weeks').each(function (i, elem) {
                items[i].weeks = [];
                $(this).find('.on').each(function (n, nelem) {
                    items[i].weeks.push($(this).text());
                });
            });

            if (isCSVRequest) {
                ts = downloadCSV(startYear, startMonth, startDay, test);
                callback(ts);
            }
            else {
                ts = downloadICS(startYear, startMonth, startDay, items);
                callback(ts);
            }



        } else {
            console.log('url request failed');
        }

    });
}

/*
 Main Function End
 */

function generateFile(url, isCSVRequest, returnCall) {

    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            var events = [];


            $('div.event').each(function (i) {

                var self = this;

                function getOption(){
                    var opt = $(self).find('span.label').text();
                    if (opt) opt = opt.split(" ")[1];
                    return opt;
                }

                function getWeeks(){
                    var weeks = [];
                    $(self).find('table.weeks td.on').each(function (j){
                        weeks.push($(this).text());
                    });
                    return weeks;
                }

                function getDay(i){
                    var day = $(self).parent().parent().find('th').text();
                    if (day == '' && i != 0) day = events[i - 1].day;
                    return day;
                }


                events[i] = {
                    course: $(this).find('span.course').text(),
                    option: getOption(),
                    type: $(this).find('span.type > small.centre').remove().end().find('span.type').text().trim(),
                    times: {
                        start: $(this).find('div.times > strong:nth-of-type(1)').text(),
                        end: $(this).find('div.times > strong:nth-of-type(2)').text()
                    },
                    location: $(this).find('ul.facts > li:nth-of-type(2)').text().trim().replace(/Location:\r\n\t\t\t\t/, ""),
                    weeks: getWeeks(),
                    day: getDay(i)
                };

            });

            if (isCSVRequest) {
                var data = generateCSV(startYear, startMonth, startDay, events);
                returnCall(data);
            }

        } else {
            console.log('url request failed');
        }

    });
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        //res.render('error', {
        //    message: err.message,
        //    error: err
        //});
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    //res.render('error', {
    //    message: err.message,
    //    error: {}
    //});
});

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});

//app.listen(app.get('port'));
//console.log('Express server listening on port ' + app.get('port'));

module.exports = app;
