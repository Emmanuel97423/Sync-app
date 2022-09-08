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
            headers: ['codeArticleGamme', 'libelle', 'codeFamille', 'libelleFamille', 'codeSousArticle', 'libelleSousFamille', 'brand', 'pvHt', 'tva', 'pvTtc', 'gammes', 'description', 'imageBase64'],
            trim: true,
        }).fromFile(csvProductGammesPath);

        try {
            data.map((product) => {
                // console.log("🚀 ~ file: productsImport.controller.js ~ line 93 ~ data.map ~ product", product.codeFamille)


                ProductGamme.findOne({ codeArticleGamme: product.codeArticleGamme }, (error, productGamme) => {
                    if (error) {
                        console.log('error:', error)
                        res.status(500).json({ error: error })
                    }
                    if (!productGamme) {
                        const productGamme = new ProductGamme({
                            ...product,
                            tva: product.tva,
                            pvTtc: parseFloat(product.pvTtc),
                            pvHt: parseFloat(product.pvHt),
                            imageUrl: [],
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
                                console.log('result:', result)

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
    const gammeArray = []
    const csvGammeFile = './assets/import/production/gammes.txt';
    await csv({
        noheader: false,
        headers: ['gammeCode', 'libelle', 'elementsGammeLibelle', 'gammeValue', 'ordreGamme'],
        trim: true,
        delimiter: ",",

        fork: true,
    }).fromFile(csvGammeFile).then((gammes) => {
        gammes.map((gamme) => {
            console.log('gamme:', gamme)
            Gamme.findOneAndUpdate({ gammeCode: gamme.gammeCode }, {
                $set: {
                    gammeCode: gamme.gammeCode,
                    libelle: gamme.libelle,
                    elementsGammeLibelle: gamme.elementsGammeLibelle,
                    gammeValue: gamme.gammeValue,
                    ordreGamme: gamme.ordreGamme,
                }
            }, (error, gammeUpdateResult) => {
                if (error) {
                    console.log('error:', error)
                    return res.status(500).json({ error: error })
                }
                if (!gammeUpdateResult) {
                    const gammeSchema = new Gamme({
                        gammeCode: gamme.gammeCode,
                        libelle: gamme.libelle,
                        elementsGammeLibelle: gamme.elementsGammeLibelle,
                        gammeValue: gamme.gammeValue,
                        order: gamme.ordreGamme
                    });
                    gammeSchema.save((error, gammeSaveResult) => {
                        if (error) console.log(error);
                        if (gammeSaveResult) {
                            console.log("🚀 ~ file: productsImport.controller.js ~ line 175 ~ gammeSchema.save ~ result", gammeSaveResult)
                            gammeArray.push(gammeSaveResult)
                        }
                    });
                }
                else {
                    console.log('gammeUpdateResult:', gammeUpdateResult)
                    gammeArray.push(gammeUpdateResult)


                }
            })
        })
        return res.status(200).json({ message: 'Gamme enregisté: success' })
    }).catch((error) => console.log(error));

}



