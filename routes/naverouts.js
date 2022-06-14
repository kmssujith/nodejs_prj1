const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
  console.log('Request for home recieved');
  res.render('about');
});

router.get('/home/about', (req, res) => {
  console.log('Request for about page recieved');
  res.render('about');
});

router.get('/home/contact', (req, res) => {
  console.log('Request for contact page recieved');
  res.render('contact');
});

module.exports = router;