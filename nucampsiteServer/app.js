let createError = require('http-errors');
let express = require('express');
let path = require('path');
let logger = require('morgan');
const passport = require('passport');
const config = require('./config');
const mongoose = require('mongoose');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');
const uploadRouter = require('./routes/uploadRouter');

const url = config.mongoUrl; // Recent updates, localhost does not work

const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'),
    err => console.log(err) // Another way to handle promise rejection
);

let app = express();
app.all('*', (req, res, next) => {
    if (req.secure) {
        // Request was through HTTPS
        return next(); // Go to next middleware function
    } else {
        console.log(`Redirecting to https://${req.hostname}:${app.get('secPort')}${req.url}`)
        res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`)
    }
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Auth
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

// Routers
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);
app.use('/imageUpload', uploadRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
