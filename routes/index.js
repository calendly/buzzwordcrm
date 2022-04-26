const express = require('express');
const { isUserAuthenticated, formatEventDateTime } = require('../utils');
const CalendlyService = require('../services/calendlyService');
const router = express.Router();

router
  .get('/', (req, res) => {
    res.render('index');
  })
  .get('/logout', (req, res) => {
    if (req.user) {
      req.session = null;
    }
    res.redirect('/');
  })
  .get('*', (req, res) => {
    res.render('index');
  });

module.exports = router;
