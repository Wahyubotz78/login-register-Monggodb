const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login', {
        layout: 'login'
    }));
// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register', {
        layout: 'register'
    }));

// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Silakan isi semua formulir' });
  }

  if (password != password2) {
    errors.push({ msg: 'Sandi confirm password tidak cocok' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Kata sandi harus minimal 6 karakter' });
  }

var pwuser = password

  if (errors.length > 0) {
    res.render('register', {
      layout: 'register',
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email tersebut sudah ada' });
        res.render('register', {
          layout: 'register',
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          pwuser
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'Anda sekarang terdaftar dan dapat masuk'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
    })(req, res, next);
});


// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Anda telah  logout');
  res.redirect('/users/login');
});

module.exports = router;