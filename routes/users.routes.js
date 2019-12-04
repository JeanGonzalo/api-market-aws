var express = require("express");
var router = express.Router();
const passport = require('passport');

router.get('/', (req, res, next) => {
    res.send('Hallo welt');
  
  });

router.post("/signup",passport.authenticate('local-singup', {
    failureRedirect: '/signup/error',
    failureFlash: true
  }),function(req,res) {
    res.status(200).json({ message: "Usuario registrado" });
  });
  
  
  router.post("/signin",passport.authenticate('local-signin', {
    failureRedirect: '/signin/error',
    failureFlash: true
  }),function(req,res) {
    res.status(200).json({ user: req.user.username });
  });
  
  

module.exports = router;