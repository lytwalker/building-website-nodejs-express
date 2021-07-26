const express = require('express');

const router = express.Router();

module.exports = (params) => {
  const { speakersService } = params;

  router.get('/', async (request, response) => {
    const speakers = await speakersService.getList();
    response.render('pages/Speakers', {
      pageTitle: 'Speakers',
      speakers: JSON.stringify(speakers),
    });
    // return response.json(speakers);
  });
  router.get('/:shortname', (request, response) => {
    response.render('pages/Speakers', {
      pageTitle: `Speakers Details page of ${request.params.shortname}`,
    });
    // response.send(`Speakers Details page of ${request.params.shortname}`);
  });

  return router;
};
