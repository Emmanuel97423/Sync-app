// const { Product, ProductGamme, Gamme } = require('../../models/index');
const mongoose = require('mongoose');
const ProductGamme = require('../../models/productGamme.model');
const Product = require('../../models/product.model');
const Gamme = require('../../models/gamme.model')
const csv = require('csvtojson');
const request = require('request');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const cloudinary = require('cloudinary');
require('dotenv').config();

//Cloudinary access config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});



export default class ConvertProduct {
    constructor(productsCsv, productGammeCsv, gammes) {
        this._productsCsv = productsCsv
        this._productGammeCsv = productGammeCsv
        this._gammes = gammes
        this._imageUrl = ""
        this._productData = ""
        this._productGammesData = ""
        this._gammesData = ""
        this._gammesArrayTemp = []
        this._gammesValueArrayTemp = []

    }
    // set setImageUrl(imageUrl) { this._imageUrl = imageUrl }
    get getImageUrl() { return this._imageUrl }
    get getProductGammesData() { return this._productGammesData }
    get getproductData() { return this._productData }
    get productsCsv() { return this._productsCsv }
    get getProductCsvToJson() { return this.productCsvToJson() }
    get getProductGammeCsvToJson() { return this.producGammesCsvToJson() }

    //Convert CSV to Json for product CSV

    async productCsvToJson() {

        try {
            //Import CSV
            const jsonToCsvData = await csv({
                noheader: false,
                headers: ['codeArticle', 'libelle', 'codeFamille', 'libelleFamille', 'codeSousFamille', 'libelleSousFamille', 'pvHt', 'tva', 'pvTtc', 'brand', 'imageUrl', 'stock', 'ean', 'codeGamme', 'gammesValue', 'gamme'],
                trim: true,
            }).fromFile(this._productsCsv)
            try {
                if (jsonToCsvData) {

                    //Map product Datas
                    Object.keys(jsonToCsvData).map(async key => {

                        let dataObject = jsonToCsvData[key];
                        //Call convert and resize image
                        let filename = dataObject.libelle.toLowerCase().replace(/\s/g, '-').replace(',', '')

                        let imageUrl = dataObject.imageUrl
                        this._productData = dataObject;
                        const forceConvert = true


                        if (imageUrl || forceConvert) {
                            //Convert image base64 to png
                            let buf = Buffer.from(imageUrl, 'base64');
                            let img = './assets/images/' + filename;
                            let imgResize = './assets/images/Resize' + filename;

                            try {
                                //Create image
                                return fs.writeFile(path.join('./assets/images/', filename), buf, async (error, info) => {

                                    if (error) {
                                        console.log({ 'error': error, 'message': 'Image invalide:' + filename })
                                    }
                                    if (info || forceConvert) {
                                        try {
                                            //Resize Image product
                                            return sharp(img).resize(360, 540, {
                                                fit: 'cover',
                                                position: 'center',
                                            }).toFile(imgResize, (err, info) => {
                                                if (err) {
                                                    console.log(err);
                                                    fs.unlink(img, (error, info) => {
                                                        if (error) console.log(error)
                                                        if (info) console.log(info)
                                                    })

                                                }
                                                if (info || forceConvert) {

                                                    try {

                                                        //DeleteImage temp

                                                        return fs.unlink(img, (error, info) => {
                                                            if (error) {
                                                                console.log(error)
                                                            }
                                                            if (info || forceConvert) {
                                                                //Upload Image to Cloudinary
                                                                return cloudinary.v2.uploader.upload(imgResize,

                                                                    { public_id: filename }, (error, cloudinaryResult) => {
                                                                        //Callback convert Gammes to Array
                                                                        // const gammeConverted = (data, callback) => {
                                                                        //     let gammeArrayTemp = []
                                                                        //     let gammeValueArrayTemp = []
                                                                        //     if (data.gamme) {




                                                                        //         try {
                                                                        //             gammesArray.map((gamme) => {

                                                                        //                 Gamme.findOne({ gammeCode: gamme }, (error, result) => {
                                                                        //                     if (error) console.log(error);
                                                                        //                     if (result) {

                                                                        //                         gammeArrayTemp.push(result.libelle)
                                                                        //                         // this._gammesArrayTemp.push(result.libelle)
                                                                        //                         // console.log('this._gammesArrayTemp:', this._gammesArrayTemp)

                                                                        //                     }
                                                                        //                 })
                                                                        //             })


                                                                        //             gammesValueArray.map((gamme) => {

                                                                        //                 Gamme.findOne({ gammeCode: gamme }, (error, result) => {
                                                                        //                     if (error) console.log(error);
                                                                        //                     if (result) {
                                                                        //                         // this._gammesValueArrayTemp.push(result.libelle)
                                                                        //                         gammeValueArrayTemp.push(result.libelle)
                                                                        //                         // console.log('this._gammesArrayTemp:', this._gammesArrayTemp)

                                                                        //                     }
                                                                        //                 })
                                                                        //             });

                                                                        //         } catch (error) {
                                                                        //             console.log("🚀 ~ file: convertClasse.js ~ line 147 ~ ConvertProduct ~ gammeConverted ~ error", error)

                                                                        //         }




                                                                        //         setTimeout(() => {

                                                                        //             let resultat = {


                                                                        //                 gammesValue: gammesValueArray,
                                                                        //                 gamme: gammesArray
                                                                        //             }
                                                                        //             callback(null, resultat);
                                                                        //             console.log("🚀 ~ file: convertClasse.js ~ line 162 ~ ConvertProduct ~ setTimeout ~ resultat", resultat)
                                                                        //         }, 6000)

                                                                        //     }

                                                                        // }

                                                                        if (cloudinaryResult || forceConvert) {



                                                                            //Import to Database 
                                                                            try {
                                                                                Product.findOne({ codeArticle: dataObject.codeArticle }, (error, product) => {

                                                                                    console.log("dataObject", dataObject)
                                                                                    //Convert Gammes
                                                                                    const pvHt = parseInt(dataObject.pvHt)
                                                                                    const pvTtc = parseInt(dataObject.pvTtc)

                                                                                    //Callback
                                                                                    if (error) console.log('error:', error)
                                                                                    if (!product) {
                                                                                        // const gammesArray = dataObject.gamme.replace('¤', ' ').split(' ')
                                                                                        // console.log("🚀 ~ file: convertClasse.js ~ line 184 ~ ConvertProduct ~ Product.findOne ~ dataObject.gamme", dataObject.gamme)
                                                                                        // const gammesValueArray = dataObject.gammesValue.replace('¤', ' ').split(' ')
                                                                                        //gamme Convert callback
                                                                                        // gammeConverted(dataObject, (error, result) => {
                                                                                        //     if (error) console.log('error:', error)
                                                                                        //     if (result)

                                                                                        //     }
                                                                                        // })


                                                                                        const productModel = new Product({
                                                                                            ...dataObject,
                                                                                            isAProductGamme: false,

                                                                                            pvHt: pvHt,
                                                                                            pvTtc: pvTtc,
                                                                                            // stock: stock,
                                                                                            imageUrl: cloudinaryResult ? cloudinaryResult.secure_url : "https://dummyimage.com/640x360/fff/aaa",
                                                                                            gammesValueConvert: {
                                                                                                gammesValue: dataObject.gammesValue ? dataObject.gammesValue.replace('¤', ' ').split(' ') : null,
                                                                                                gammes: dataObject.gamme ? dataObject.gamme.replace('¤', ' ').split(' ') : null,

                                                                                            },

                                                                                        });
                                                                                        productModel.save((error, result) => {
                                                                                            if (error) console.log('error:', error)
                                                                                            if (result) {
                                                                                                console.log('result save model:', result)

                                                                                            }

                                                                                        })


                                                                                    };
                                                                                    console.log("🚀 ~ file: convertClasse.js ~ line 228 ~ ConvertProduct ~ Product.findOne ~ dataObject", dataObject)
                                                                                    if (product) {

                                                                                        Product.findOneAndUpdate({ codeArticle: product.codeArticle }, {
                                                                                            ...product,
                                                                                            pvHt: pvHt,
                                                                                            pvTtc: pvTtc,
                                                                                            imageUrl: cloudinaryResult ? cloudinaryResult.secure_url : "https://dummyimage.com/640x360/fff/aaa",
                                                                                            gammesValueConvert: {
                                                                                                gammesValue: product.gamme ? product.gamme.replace('¤', ' ').split(' ') : null,
                                                                                                gammes: product.gammesValue ? product.gamme.replace('¤', ' ').split(' ') : null,
                                                                                            },
                                                                                            isAProductGamme: false,

                                                                                        }, (error, result) => {

                                                                                            if (error) console.log(error);
                                                                                            if (result) console.log('result update product:', result);
                                                                                        })
                                                                                        // gammeConverted(dataObject, (error, result) => {
                                                                                        //     if (error) console.log(error);
                                                                                        //     if (result) {


                                                                                        //     }
                                                                                        // })


                                                                                    }


                                                                                })
                                                                                console.log("🚀 ~ file: convertClasse.js ~ line 258 ~ ConvertProduct ~ Product.findOne ~ dataObject", dataObject)
                                                                            } catch (error) {
                                                                                console.log('error:', error)

                                                                            }

                                                                            try {
                                                                                //Delete Image temp resized
                                                                                fs.unlink(imgResize, (error) => {
                                                                                    if (error) {
                                                                                        console.log('fs.unlink error:', error)
                                                                                    } else {
                                                                                        console.log('Fichier supprimer: ' + imgResize)

                                                                                    }
                                                                                })
                                                                            } catch (error) {
                                                                                console.log('error:', error)
                                                                            }

                                                                        } else {
                                                                            console.log("Image: " + filename + " upload errooooor!: " + error)
                                                                        }
                                                                    });
                                                            }
                                                        });
                                                    } catch (error) {
                                                        console.log('error:', error)
                                                    }


                                                }

                                            });

                                        } catch (error) {
                                            console.log('error:', error)
                                        }
                                        return true

                                    }
                                });



                            } catch (error) {
                                console.log('error:', error)
                            }
                            // return resizeResponse

                        } else {
                            console.log({ message: 'Image invalide ou abscente: ' + filename })

                        }


                    })
                    try {
                        //Call  product Gamme methods
                        this.producGammesCsvToJson()
                    } catch (error) {
                        console.log('error:', error)

                    }


                }
            } catch (error) {
                console.log('error:', error)

            }

        } catch (error) {
            console.log('error:', error)

        }

    }
    //
    async producGammesCsvToJson() {
        try {
            const jsonToCsvData = await csv({
                noheader: false,
                headers: ['codeArticleGamme', 'libelle', 'libelleFamille', 'libelleSousFamille', 'fournisseur', 'pvHt', 'tva', 'pvTtc', 'gammes', 'description'],
                trim: true,
            }).fromFile(this._productGammeCsv)
            try {
                if (jsonToCsvData) {
                    this._productGammesData = jsonToCsvData;
                    // console.log('this._productData:', this._productData)
                    // console.log('this._imageUrl:', this._imageUrl)
                    jsonToCsvData.map((productGamme) => {

                        ProductGamme.findOne({ codeArticleGamme: productGamme.codeArticleGamme }, (error, productGamme) => {

                            if (error) console.log(error);
                            if (productGamme) {

                                Product.find({ codeGamme: productGamme.codeArticleGamme }, (error, products) => {

                                    if (error) console.log(error);
                                    if (products) {

                                        products.map((product) => {

                                            ProductGamme.updateOne({ codeArticleGamme: product.codeGamme }, { $set: { variantId: [] } }, (error, result) => {
                                                if (error) console.error(error);
                                                if (result) {
                                                    console.log("🚀 ~ file: convertClasse.js ~ line 356 ~ ProductGamme.updateOne ~ result", result)
                                                    ProductGamme.updateOne({ codeArticleGamme: product.codeGamme }, { $push: { variantId: product.codeArticle } }, (error, productG) => {
                                                        if (error) console.log(error);
                                                        if (productG) {
                                                            console.log("🚀 ~ file: convertClasse.js ~ line 358 ~ ProductGamme.updateOne ~ productG", productG)



                                                        }
                                                    });
                                                }
                                            })



                                        })



                                    }

                                })
                            }

                        })

                    })
                    // return jsonToCsvData
                }

            } catch (error) {
                console.log('error:', error)
            }
        } catch (error) {
            console.log('error:', error)

        }
    }


}


