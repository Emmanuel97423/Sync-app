const express = require('express');
const router = express.Router();


const productsCsv = './assets/import/production/articles.txt';
const productGammeCsv = './assets/import/production/articles-gamme.txt';
const gammes = './assets/import/production/gammes.txt';

// import ConvertProduct from '../utils/classes/convertClasse';
const ConvertProduct = require('../utils/classes/convertClasse')

router.get('/products', async (req, res, next) => {
    // let productGammes = null;
    // let products = null;
    // let productImageUrl = null;

    const convertProduct = new ConvertProduct(productsCsv, productGammeCsv, gammes);
    convertProduct.getProductCsvToJson.then((result) => {
        console.log('result:', result)
        res.status(202).json({ result })

    })


})

module.exports = router;