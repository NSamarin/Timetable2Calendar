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

var downloadCSV = require('./public/javascripts/downloadCSV');
var downloadICS = require('./public/javascripts/downloadICS');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

/*
    App parameters
    Enter year, (month-1) and day when the semester starts (Monday of the study week 1)
*/
var startYear = 2017;
var startMonth = 0;
var startDay = 16;

var skipWeek = true;
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


    //res.setHeader('Content-disposition', 'attachment; filename=timetable.ics');
    //res.download('timetable.ics');
    //res.render('download.html');
    //
    //console.log("ping from ics");
    //res.setHeader('Content-disposition', 'attachment; filename=timetable.csv');
    //res.download('timetable.csv');
    //res.send('<b>timetable.csv and timetable.ics</b> have been successfully saved to your hard drive.');
});
//app.use('/users', users);

//router.get('/', function(req, res, next) {
//  res.render('index');
//});


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
                ts = downloadCSV(startYear, startMonth, startDay, items);
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
