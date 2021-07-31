const express = require('express');

const router = express.Router();

module.exports = (params) => {
  const { feedbackService } = params;

  router.get('/', async (request, response, next) => {
    try {
      const feedback = await feedbackService.getList();
      return response.render('layout', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedback,
      });
    } catch (error) {
      return next(error);
    }
  });
  router.post('/', (request, response) => {
    response.send('Feedback form posted.');
  });

  return router;
};
