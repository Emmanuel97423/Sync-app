const csv = require('csvtojson');
const csvFilePath = './assets/test.csv';
const fsExtra = require('fs-extra');
// import { sendProduct } from '../utils/sendProduct.js';
const sendProduct = require('../utils/sendProduct.js')
const ProductGamme = require('../models/productGamme.model');
const Gamme = require('../models/gamme.model');


exports.convertToJson = async (req, res, next) => {
    const directory = './assets/images/'
    const productsCsv = './assets/import/production/articles.txt'

    //Convert to bas64 and send to server
    try {

        const data = await csv({


            noheader: false,
            headers: ['codeArticle', 'libelle', 'codeFamille', 'libelleFamille', 'codeSousFamille', 'libelleSousFamille', 'pvHt', 'tva', 'pvTtc', 'brand', 'imageUrl', 'stock', 'ean', 'codeGamme', 'gammesValue', 'gamme', 'description'],
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
            delimiter: ";",
            fork: true,
            // ignoreColumns: /(description)/,
            checkColumn: true,
            colParser: {
                "pvHt": 'number',
                "pvTtc": 'number',

                "description": "string",
            },
            // checkType: true

        }).fromFile(csvProductGammesPath);
        const resultArray = []
        const dataLength = data.length
        console.log('dataLength:', dataLength)
        try {

            data.map((product) => {
                console.log('codeArticleGamme:', product.codeArticleGamme)
                ProductGamme.findOne({ codeArticleGamme: product.codeArticleGamme }, (error, productGamme) => {
                    if (error) {
                        console.log('error:', error)
                        res.status(500).json({ error: error })
                    }
                    if (!productGamme) {
                        const productGamme = new ProductGamme({
                            codeArticleGamme: product.codeArticleGamme,
                            libelle: product.libelle,
                            codeFamille: product.codeFamille,
                            libelleFamille: product.libelleFamille,
                            codeSousFamille: product.codeSousFamille,
                            sousFamilleLibelle: product.sousFamilleLibelle,
                            brand: product.brand,
                            pvHt: product.pvHt,
                            tva: product.tva,
                            imageUrl: [],
                            pvTtc: product.pvTtc,
                            description: product.description,
                            isAProductGamme: true,
                        });
                        try {
                            productGamme.save((error, result) => {
                                if (error) { console.log('error:', error) }
                                if (result) {
                                    // console.log('result:', result)
                                    resultArray.push(result);
                                    data.length--
                                    if (data.length === 0) {
                                        res.status(200).json(resultArray)
                                    }
                                    // console.log("Article Gammes enregistré")
                                    // res.status(200).json(result)
                                }

                            });
                        } catch (error) {
                            console.log('error:', error)

                        }
                    }
                    if (productGamme) {

                        ProductGamme.updateOne({
                            codeArticleGamme: product.codeArticleGamme,
                            libelle: product.libelle,
                            codeFamille: product.codeFamille,
                            libelleFamille: product.libelleFamille,
                            codeSousFamille: product.codeSousFamille,
                            sousFamilleLibelle: product.sousFamilleLibelle,
                            brand: product.brand,
                            pvHt: product.pvHt,
                            tva: product.tva,
                            imageUrl: product.imageUrl,
                            pvTtc: product.pvTtc,
                            description: product.description,
                            isAProductGamme: true,

                        }
                            , (error, result) => {
                                if (error) console.log('error:', error)
                                if (result) {
                                    // console.log('result:', result)
                                    data.length--
                                    resultArray.push(productGamme);
                                    if (data.length === 0) {
                                        res.status(200).json({ "Données mise à jour": resultArray })
                                    }

                                    // res.status(200).json(result)

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
            Gamme.findOneAndUpdate({ _id: gamme._id }, {
                $set: {
                    gammeCode: gamme.gammeCode,
                    libelle: gamme.libelle,
                    elementsGammeLibelle: gamme.elementsGammeLibelle,
                    gammeValue: gamme.gammeValue,
                    ordreGamme: gamme.ordreGamme,
                }
            }, { new: true }, (error, gammeUpdateResult) => {
                console.log('gammeUpdateResult:', gammeUpdateResult)
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
                        console.log('gammeSaveResult:', gammeSaveResult)
                        if (error) console.log(error);
                        if (gammeSaveResult) {
                            console.log("🚀 ~ file: productsImport.controller.js ~ line 175 ~ gammeSchema.save ~ result", gammeSaveResult)
                            gammeArray.push(gammeSaveResult)
                        }
                    });
                }
                else {
                    gammeArray.push(gammeUpdateResult)


                }
            })
        })
        return res.status(200).json({ message: 'Gamme enregisté: success' })
    }).catch((error) => console.log(error));

}



