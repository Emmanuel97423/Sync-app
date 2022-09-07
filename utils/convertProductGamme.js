
const csv = require('csvtojson');
const ProductGamme = require('../models/productGamme.model');
const csvProductGammesPath = "./assets/import/production/articles-gamme.txt";


const convertProductGamme = async () => {



    try {
        const data = await csv({
            noheader: false,
            headers: ['codeArticleGamme', 'libelle', 'codeFamille', 'libelleFamille', 'codeSousArticle', 'libelleSousFamille', 'brand', 'pvHt', 'tva', 'pvTtc', 'gammes', 'description', 'imageBase64'],
            trim: true,
        }).fromFile(csvProductGammesPath);

        try {
            data.map((product) => {


                ProductGamme.findOneAndUpdate({ codeArticleGamme: product.codeArticleGamme }, {
                    // upsert: true,
                }, (error, productGamme) => {
                    if (error) {
                        console.log('error:', error)
                        // res.status(500).json({ error: error })
                    }
                    if (productGamme === null) {
                        const productGamme = new ProductGamme({
                            ...product,
                            tva: product.tva,
                            pvTtc: parseFloat(product.pvTtc),
                            pvHt: parseFloat(product.pvHt),
                            isAProductGamme: true
                        });
                        try {
                            productGamme.save((error, result) => {
                                if (error) { console.log('error:', error) }
                                if (result) {
                                    console.log("Article Gammes enregistré")
                                    // res.status(200).json(result)
                                }

                            });
                        } catch (error) {
                            console.log('error:', error)

                        }
                    } else {

                        ProductGamme.findOneAndUpdate({ codeArticleGamme: product.codeArticleGamme }, { ...product, isAProductGamme: true }, (error, result) => {
                            if (error) console.log('error:', error)
                            if (result) {

                            }
                        })
                    }
                    // console.log('productGamme:', productGamme)
                })

            })
        } catch (error) {
            console.log('error:', error)
            // res.status(500).send(error.message)
        }
    } catch (error) {
        console.log('error:', error)
        // res.status(500).send(error.message)
    }
}

module.exports = convertProductGamme();