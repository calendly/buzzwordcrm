require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const initializeDatabase = require('./db/initializeDatabase');
const passport = require('passport');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const port = process.env.PORT || '3000';
const {
  mockCalendlyAuthentication,
  mockCalendlyScheduledEvents,
  mockCalendlyEventTypes,
  mockCalendlyEvent,
  mockCalendlyInvitees,
  mockCalendlyNoShows,
  mockCalendlyUndoNoShow,
  mockCalendlyCancelEvent,
} = require('./utils/test.js');

(async () => {
  await initializeDatabase();
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.use(express.static(path.join(__dirname, 'public')));

// cookie configuration
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
    keys: ['randomstringhere'],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(require('./calendlyOauth2Strategy'));
passport.serializeUser((user, next) => {
  next(null, user);
});
passport.deserializeUser((user, next) => {
  next(null, user);
});

// routes
app.use('/oauth', require('./routes/oauth'));
app.use('/api', require('./routes/api'));
app.use('/', require('./routes'));

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

if (process.env.NODE_ENV === 'test') {
  mockCalendlyAuthentication();
  mockCalendlyEventTypes();
  mockCalendlyScheduledEvents();
  mockCalendlyEvent();
  mockCalendlyInvitees();
  mockCalendlyNoShows();
  mockCalendlyUndoNoShow();
  mockCalendlyCancelEvent();
}

app.listen(port, () => {
  console.log(`Server ready at http://localhost:${port}`);
});
