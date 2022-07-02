// const { Product, ProductGamme, Gamme } = require('../../models/index');
const mongoose = require('mongoose');
const ProductGamme = require('../../models/productGamme.model')
const Product = require('../../models/product.model')
const csv = require('csvtojson');
const request = require('request')
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
import { ResizeClass } from '../resizeImage.js'
const cloudinary = require('cloudinary');
require('dotenv').config()

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
        let resizeResponse = false;
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



                        if (imageUrl) {
                            //Convert image base64 to png
                            let buf = Buffer.from(imageUrl, 'base64');
                            let img = './assets/images/' + filename;
                            let imgResize = './assets/images/Resize' + filename;

                            try {
                                //Create image
                                return fs.writeFile(path.join('./assets/images/', filename), buf, async (error) => {

                                    if (error) {
                                        console.log({ 'error': error, 'message': 'Image invalide:' + filename })
                                    } else {
                                        try {
                                            //Resize Image product
                                            return sharp(img).resize(360, 540, {
                                                fit: 'cover',
                                                position: 'center',
                                            }).toFile(imgResize, (err, info) => {
                                                if (err) {
                                                    console.log(err);

                                                } else {

                                                    try {

                                                        //DeleteImage temp

                                                        return fs.unlink(img, (error) => {
                                                            if (error) {
                                                                console.log(error)
                                                            }
                                                            else {
                                                                //Upload Image to Cloudinary
                                                                return cloudinary.v2.uploader.upload(imgResize,

                                                                    { public_id: filename }, (error, result) => {
                                                                        if (result) {
                                                                            // console.log('result:', result.secure_url)
                                                                            this._imageUrl = result.secure_url;
                                                                            console.log('dataObject.codeArticle:', dataObject.codeArticle)
                                                                            //Import to Database 
                                                                            try {
                                                                                Product.findOne({ codeArticle: dataObject.codeArticle }, (error, product) => {


                                                                                    if (!product) {
                                                                                        console.log("Product inexistant");
                                                                                        const pvHt = parseInt(dataObject.pvHt)

                                                                                        const pvTtc = parseInt(dataObject.pvTtc)

                                                                                        // const stock = parseInt(dataObject.stock)


                                                                                        const productModel = new Product({
                                                                                            ...dataObject,
                                                                                            pvHt: pvHt,
                                                                                            pvTtc: pvTtc,
                                                                                            // stock: stock,
                                                                                            imageUrl: result.secure_url
                                                                                        })
                                                                                        try {
                                                                                            productModel.save((error, result) => {
                                                                                                if (result) console.log('result:', result.codeArticle)


                                                                                                if (error) console.log('error:', error)
                                                                                            })
                                                                                        } catch (error) {

                                                                                        }
                                                                                    }
                                                                                    if (error) {
                                                                                        console.log('error:', error)

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
                                                                                        console.log('Fichier supprimer: ' + imgResize)

                                                                                    }
                                                                                })
                                                                            } catch (error) {
                                                                                console.log('error:', error)
                                                                            }
                                                                            return result
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

                        console.log('productGamme.codeArticleGamme:', productGamme.codeArticleGamme)

                        ProductGamme.findOne({ codeArticleGamme: productGamme.codeArticleGamme }, (error, productGamme) => {



                            if (error) console.log(error);
                            if (productGamme) {

                                Product.find({ codeGamme: productGamme.codeArticleGamme }, (error, products) => {

                                    if (error) console.log(error);
                                    if (products) {

                                        products.map((product) => {
                                            ProductGamme.updateOne({ codeArticleGamme: product.codeGamme }, { $pull: { variantId: product._id } }, (error, result) => {
                                                if (error) console.error(error);
                                                if (result) {
                                                    ProductGamme.updateOne({ codeArticleGamme: product.codeGamme }, { $push: { variantId: product._id } }, (error, productG) => {
                                                        if (error) console.log(error);
                                                        if (productG) {
                                                            console.log('productG:', productG)


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


