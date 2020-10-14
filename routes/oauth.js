const passport = require('passport');
const express = require('express');
const router = express.Router();

router.get('/', passport.authenticate('oauth2')).get(
    '/callback',
    passport.authenticate('oauth2', {
        successRedirect: '/dashboard',
        failureRedirect: '/'
    })
);

module.exports = router;
