const express = require("express");
const router = express.Router();
const productsImportCtrl = require('../controllers/productsImport.controller')

const upload = require('../middleware/upload')

router.get('/import', productsImportCtrl.convertToJson)
router.post('/import', upload, productsImportCtrl.convertToJson)
router.get('/import/product-gammes', upload, productsImportCtrl.sendProductGamme)
router.get('/import/gammes', productsImportCtrl.sendGamme)
module.exports = router;