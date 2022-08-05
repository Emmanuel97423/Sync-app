const csv = require('csvtojson');
const csvFilePath = './assets/test.csv';
const fsExtra = require('fs-extra');
import { sendProduct } from '../utils/sendProduct.js';
const ProductGamme = require('../models/productGamme.model');
const Gamme = require('../models/gamme.model');


exports.convertToJson = async (req, res, next) => {
    const directory = './assets/images/'
    const productsCsv = './assets/import/production/articles.txt'

    //Convert to bas64 and send to server
    try {

        const data = await csv({


            noheader: false,
            headers: ['codeArticle', 'libelle', 'codeFamille', 'libelleFamille', 'codeSousFamille', 'libelleSousFamille', 'pvHt', 'tva', 'pvTtc', 'brand', 'imageUrl', 'stock', 'ean', 'codeGamme', 'gammesValue', 'gamme'],
            trim: true,
        }).fromFile(productsCsv);

        //Loop data json

        const dataConvert = await Object.keys(data).forEach(key => {
            //Csv to json Object
            let dataObject = data[key];
            //Product name
            let productName = data[key].libelle;


            //to lower case product name
            productName = productName.toLowerCase().replace(/\s/g, '-')

            let imageName = productName
            // let imageUrl = "./assets/images/" + imageName
            //Convert base64 to file
            let base64String = data[key].imageUrl;

            if (base64String) {

                try {

                    sendProduct(base64String, imageName, productName, dataObject)


                    setTimeout(() => {
                        try {

                            fsExtra.emptyDirSync(directory)
                            // console.log("Supression image en cache terminé")
                            // console.log("message: Import envoyé")
                            return res.status(201).send({ message: 'Import envoyé' })
                        } catch (error) {
                            // console.log("La suppression des images du dossier à échouer: " + error)

                        }

                    }, 15000)

                } catch (e) {
                    console.error(e)
                    console.log('Import  échoué!')
                    res.status(400).send({ message: 'Importation erreur' })
                }

            }


        });

    } catch (error) {
        console.log('Import échoué!')
        res.status(500).send(error.message)
    }

}

exports.sendProductGamme = async (req, res, next) => {


    const csvProductGammesPath = './assets/import/production/articles-gamme.txt'
    try {
        const data = await csv({
            noheader: false,
            headers: ['codeArticleGamme', 'libelle', 'libelleFamille', 'libelleSousFamille', 'brand', 'pvHt', 'tva', 'pvTtc', 'gammes', 'description', 'imageBase64'],
            trim: true,
        }).fromFile(csvProductGammesPath);

        try {
            data.map((product) => {


                ProductGamme.findOneAndUpdate({ codeArticleGamme: product.codeArticleGamme }, {
                    // upsert: true,
                }, (error, productGamme) => {
                    if (error) {
                        console.log('error:', error)
                        res.status(500).json({ error: error })
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
                                console.log("🚀 ~ file: productsImport.controller.js ~ line 126 ~ ProductGamme.findOneAndUpdate ~ result", result)

                            }
                        })
                    }
                    // console.log('productGamme:', productGamme)
                })

            })
        } catch (error) {
            console.log('error:', error)
            res.status(500).send(error.message)
        }
    } catch (error) {
        console.log('error:', error)
        res.status(500).send(error.message)
    }
}

exports.sendGamme = async (req, res, next) => {
    const csvGamme = './assets/import/production/gammes.txt'
    try {
        const data = await csv({

            noheader: false,
            headers: ['gammeCode', 'libelle', 'elementsGammeLibelle'],
            trim: true,
        }).fromFile(csvGamme);

        try {
            data.map((result) => {
                console.log('result:', result)
                Gamme.findOneAndUpdate({ gammeCode: result.gammeCode }, {
                }, (error, gamme) => {
                    if (error) {
                        console.log('error:', error)
                        res.status(500).json({ error: error })
                    }
                    if (gamme === null) {
                        console.log('gamme:', gamme)
                        const gammeSchema = new Gamme({
                            gammeCode: result.gammeCode,
                            libelle: result.libelle,
                            elementsGammeLibelle: result.elementsGammeLibelle,
                        });
                        console.log('gammeSchema:', gammeSchema)
                        try {
                            gammeSchema.save();
                        } catch (error) {
                            console.log('error:', error)
                        }
                    }
                })

            })
        } catch (error) {
            console.log('error:', error)
            res.status(500).send(error.message)
        }
    } catch (error) {
        console.log('error:', error)
        res.status(500).send(error.message)
    }
}



