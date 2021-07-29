const express = require('express');

const speakersRoute = require('./speakers');
const feedbackRoute = require('./feedback');

const router = express.Router();

module.exports = (params) => {
  const { speakersService } = params;

  router.get('/', async (request, response) => {
    // // Testing cookie sessions
    // if (!request.session.visitcount) {
    //   request.session.visitcount = 0;
    // }
    // request.session.visitcount++;
    // console.log(`Number of visits is: ${request.session.visitcount}`);
    const speakers = await speakersService.getList();
    const allArtwork = await speakersService.getAllArtwork();
    response.render('layout', {
      pageTitle: 'Welcome',
      template: 'index',
      speakers,
      allArtwork,
    });
  });
  router.use('/speakers', speakersRoute(params));
  router.use('/feedback', feedbackRoute(params));

  return router;
};
