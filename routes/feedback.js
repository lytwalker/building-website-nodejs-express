const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();

module.exports = params => {
  const { feedbackService } = params;

  router.get('/', async (request, response, next) => {
    try {
      const recentFeedback = await feedbackService.getList();
      const errors = request.session.feedback ? request.session.feedback.errors : false;
      const successMessage = request.session.feedback ? request.session.feedback.message : false;
      request.session.feedback = {};

      return response.render('layout', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedbackList: recentFeedback,
        errors,
        successMessage,
      });
    } catch (error) {
      return next(error);
    }
  });
  router.post(
    '/',
    [
      check('name')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage('Please enter valid name.'),
      check('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter valid email address.'),
      check('title')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage('Please enter valid title.'),
      check('message')
        .trim()
        .isLength({ min: 5 })
        .escape()
        .withMessage('Please enter valid message.'),
    ],
    async (request, response) => {
      const errors = validationResult(request);

      if (!errors.isEmpty()) {
        request.session.feedback = {
          errors: errors.array(),
        };
        return response.redirect('/feedback');
      }

      try {
        const { name, email, title, message } = request.body;
        await feedbackService.addEntry(name, email, title, message);
        request.session.feedback = { message: 'Thank you for your feedback.' };
      } catch (error) {
        return next(error);
      }
      return response.redirect('/feedback');
    }
  );

  return router;
};
