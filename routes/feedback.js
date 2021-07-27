const express = require('express');

const router = express.Router();

module.exports = (params) => {
  const { feedbackService } = params;

  router.get('/', async (request, response) => {
    const feedback = await feedbackService.getList();
    response.render('layout', {
      pageTitle: 'Feedback',
      template: 'feedback',
      feedback: JSON.stringify(feedback),
    });
  });
  router.post('/', (request, response) => {
    response.send('Feedback form posted.');
  });

  return router;
};
