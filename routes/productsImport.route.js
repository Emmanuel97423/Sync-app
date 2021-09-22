const express = require("express");
const router = express.Router();
const productsImportCtrl = require('../controllers/productsImport.controller')

router.get('/import', productsImportCtrl.convertToJson)

module.exports = router;