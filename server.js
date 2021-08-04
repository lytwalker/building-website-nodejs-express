const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const httpErrors = require('http-errors');
const bodyParser = require('body-parser');

const FeedbackService = require('./services/FeedbackService');
const SpeakersService = require('./services/SpeakerService');

const routes = require('./routes');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakersService = new SpeakersService('./data/speakers.json');

const app = express();

const port = 3000;

app.set('trust proxy', 1);

app.use(
  cookieSession({
    name: 'session',
    keys: ['whateverrandomstring', 'whateverotherrandomstring'],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.locals.siteName = 'ROUX Meetups';

app.use(express.static(path.join(__dirname, './static')));

app.use(async (request, response, next) => {
  try {
    const names = await speakersService.getNames();
    response.locals.speakerNames = names;
    return next();
  } catch (error) {
    return next(error);
  }
});

app.use(
  '/',
  routes({
    feedbackService,
    speakersService,
  })
);

app.use((req, res, next) => {
  return next(httpErrors(404, 'File Not Found'));
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const errorMessage = status == 500 ? 'Something went wrong.' : err.message;
  console.error(err);
  res.status(status);
  try {
    return res.render('layout', {
      pageTitle: 'Error',
      template: 'error',
      status,
      message: errorMessage,
    });
  } catch (error) {
    return next(error);
  }
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
