const express = require("express");
const router = express.Router();
const productsImportCtrl = require('../controllers/productsImport.controller')

const upload = require('../middleware/upload')

router.get('/import', productsImportCtrl.convertToJson)
router.post('/import/product-gammes', upload, productsImportCtrl.sendProductGamme)
router.post('/import/gammes', upload, productsImportCtrl.sendGamme)
module.exports = router;