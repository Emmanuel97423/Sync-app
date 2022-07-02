const express = require('express');
const router = express.Router();


const productsCsv = './assets/articles-copy-txt.csv';
const productGammeCsv = './assets/article-gamme-txt.csv';
const gammes = './assets/export-gammes-txt.csv'

import ConvertProduct from '../utils/classes/convertClasse'

router.get('/products', async (req, res, next) => {
    let productGammes = null;
    let products = null;
    let productImageUrl = null;

    const convertProduct = new ConvertProduct(productsCsv, productGammeCsv, gammes);
    await convertProduct.getProductCsvToJson


})

module.exports = router;