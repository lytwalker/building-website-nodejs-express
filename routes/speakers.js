const express = require('express');

const router = express.Router();

module.exports = (params) => {
  const { speakersService } = params;

  router.get('/', async (request, response) => {
    const speakers = await speakersService.getList();
    const allArtwork = await speakersService.getAllArtwork();
    response.render('layout', {
      pageTitle: 'Speakers',
      template: 'speakers',
      speakers,
      allArtwork,
    });
    // return response.json(speakers);
  });
  router.get('/:shortname', async (request, response) => {
    const speaker = await speakersService.getSpeaker(request.params.shortname);
    const speakerArtwork = await speakersService.getArtworkForSpeaker(request.params.shortname);
    response.render('layout', {
      pageTitle: `Speaker - ${speaker.name}`,
      template: 'speaker',
      speaker,
      speakerArtwork,
    });
    // response.send(`Speakers Details page of ${request.params.shortname}`);
  });

  return router;
};
