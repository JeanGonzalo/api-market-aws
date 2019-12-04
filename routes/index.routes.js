var express = require("express");
var router = express.Router();

router.get("/signup/error", async (req, res, next) => {
    res.status(500).json({ message: "Usuario ya existe" });
  });
  
  router.get("/signin/error", async (req, res, next) => {
    res.status(500).json({ message: "Usuario y/o contraseña incorrectos" });
  });

  module.exports = router;