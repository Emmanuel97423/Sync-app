// const { Product, ProductGamme, Gamme } = require('../../models/index');
const ProductGamme = require('../../models/productGamme.model');
const Product = require('../../models/product.model');
const csv = require('csvtojson');
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
            csv({
                noheader: false,
                headers: ["codeArticle", "libelle", "codeFamille", "libelleFamille", "codeSousFamille", "libelleSousFamille", "pvHt", "tva", "pvTtc", "brand", "imageUrl", "stock", "ean", "codeGamme", "gammesValue", "gamme"],
                trim: true,
                delimiter: ";",

                fork: true,

            }).fromFile(this._productsCsv).then(jsonToCsvData => {



                //Map product Datas
                Object.keys(jsonToCsvData).map(async key => {

                    let dataObject = jsonToCsvData[key];
                    //Call convert and resize image
                    let filename = dataObject.libelle.toLowerCase().replace(/\s/g, '-').replaceAll(',', '')

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
                                        return sharp(img).resize(500, 600, {
                                            fit: 'cover',
                                            position: 'center',
                                        }).toFile(imgResize, (err, info) => {
                                            if (err) {
                                                console.log(err);
                                                // fs.unlink(img, (error, info) => {
                                                //     if (error) console.log(error)
                                                //     // if (info) console.log(info)
                                                // })

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

                                                                    if (error) console.log(error)
                                                                    if (cloudinaryResult || forceConvert) {

                                                                        //Import to Database 
                                                                        try {
                                                                            Product.findOne({ codeArticle: dataObject.codeArticle }, (error, product) => {

                                                                                //Convert Gammes
                                                                                const pvHt = parseInt(dataObject.pvHt)
                                                                                const pvTtc = parseInt(dataObject.pvTtc)

                                                                                // return
                                                                                //Callback
                                                                                if (error) console.log('error:', error)
                                                                                if (!product) {



                                                                                    const productModel = new Product({
                                                                                        ...dataObject,
                                                                                        isAProductGamme: false,

                                                                                        pvHt: pvHt,
                                                                                        pvTtc: pvTtc,
                                                                                        // stock: stock,
                                                                                        imageUrl: cloudinaryResult ? cloudinaryResult.secure_url : "https://dummyimage.com/640x360/fff/aaa",
                                                                                        gammesValueConvert: {
                                                                                            gammesValue: dataObject.gammesValue ? dataObject.gammesValue.split('¤') : null,
                                                                                            gammes: dataObject.gamme ? dataObject.gamme.split('¤') : null,

                                                                                        },

                                                                                    });
                                                                                    productModel.save((error, result) => {
                                                                                        if (error) console.log('error:', error)
                                                                                        if (result) {
                                                                                            // return result


                                                                                        }

                                                                                    })


                                                                                };
                                                                                if (product) {

                                                                                    Product.findOneAndUpdate({ codeArticle: product.codeArticle }, {
                                                                                        $set: {

                                                                                            pvHt: pvHt,
                                                                                            pvTtc: pvTtc,
                                                                                            imageUrl: cloudinaryResult ? cloudinaryResult.secure_url : "https://dummyimage.com/640x360/fff/aaa",
                                                                                            gammesValueConvert: {
                                                                                                gammesValue: product.gammesValue ? product.gammesValue.split('¤') : null,
                                                                                                gammes: product.gamme ? product.gamme.split('¤') : null,
                                                                                            },
                                                                                            isAProductGamme: false,
                                                                                        }


                                                                                    }, { new: true }, (error, result) => {

                                                                                        if (error) console.log(error);
                                                                                        if (result) {
                                                                                            console.log('result:', result)
                                                                                            return result
                                                                                        }
                                                                                    })


                                                                                }


                                                                            })
                                                                        } catch (error) {
                                                                            console.log('error:', error)

                                                                        }

                                                                        try {
                                                                            //Delete Image temp resized
                                                                            fs.unlink(imgResize, (error) => {
                                                                                if (error) {
                                                                                    console.log('fs.unlink error:', error)
                                                                                } else {
                                                                                    // console.log('Fichier supprimer: ' + imgResize)

                                                                                }
                                                                            })
                                                                        } catch (error) {
                                                                            console.log('error:', error)
                                                                        }

                                                                    }
                                                                    //  else {
                                                                    //     console.log("Image: " + filename + " upload errooooor!: " + error)
                                                                    // }
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
            }).catch(error => {
                console(error)
                return error
            })


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
                                                    ProductGamme.updateOne({ codeArticleGamme: product.codeGamme }, { $push: { variantId: product.codeArticle } }, (error, productG) => {
                                                        if (error) console.log(error);
                                                        if (productG) {



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


