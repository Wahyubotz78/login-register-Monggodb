const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('Welcome', {
        layout: 'Welcome'
    }));


// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.send(req.user)
);

module.exports = router;