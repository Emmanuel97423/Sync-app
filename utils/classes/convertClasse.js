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

class ConvertProduct {
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



        //Import CSV
        return csv({
            noheader: false,
            headers: ["codeArticle", "libelle", "codeFamille", "libelleFamille", "codeSousFamille", "libelleSousFamille", "pvHt", "tva", "pvTtc", "brand", "imageUrl", "stock", "ean", "codeGamme", "gammesValue", "gamme", "description"],
            trim: true,
            delimiter: ";",
            checkColumn: true,
            fork: true,
            colParser: {
                "pvHt": 'number',
                "pvTtc": 'number',
                // "tva": 'number',
                "description": "string",
            },

        }).fromFile(this._productsCsv).then(jsonToCsvData => {
            // jsonToCsvData.map(product => {
            //     console.log('product:', product.description)

            // })

            const regex = /[*/ ']/gm

            //Map product Datas
            Object.keys(jsonToCsvData).map(async key => {

                let dataObject = jsonToCsvData[key];
                // console.log('dataObject.codeArticle:', dataObject.libelle);
                //Call convert and resize image
                let filename = dataObject.libelle.replace(/\s/g, '-').replaceAll(',', '').replaceAll('/', '-').replaceAll('*', '-').toLowerCase()
                // let filename = dataObject.libelle.replaceAll(regex, "_").toLowerCase()

                let imageUrl = dataObject.imageUrl
                this._productData = dataObject;
                const forceConvert = true;


                if (imageUrl || forceConvert) {
                    //Convert image base64 to png
                    let buf = Buffer.from(imageUrl, 'base64');
                    let img = './assets/images/' + filename;
                    let imgResize = './assets/images/Resize' + filename;

                    // try {
                    //Create image
                    return fs.writeFile(path.join('./assets/images/', filename), buf, async (error, info) => {

                        if (error) {
                            console.log({ 'error': error, 'message': 'Image invalide:' + filename })
                        }
                        if (info || forceConvert) {

                            //                                 try {
                            //                                     //Text on imageUrl
                            //                                     const width = 100;
                            //                                     const height = 80;
                            //                                     const text = "Exo-trap";

                            //                                     const svgImage = `
                            // <svg width="${width}" height="${height}">
                            //   <style>
                            //   .title { fill: #001; font-size: 15px; font-weight: bold;}
                            //   </style>
                            //   <text x="50%" y="50%" text-anchor="middle" class="title">${text}</text>
                            // </svg>
                            // `;
                            //                                     const svgBuffer = Buffer.from(svgImage);
                            //Resize Image product
                            return sharp(img).resize(510, 600, {
                                fit: 'contain',
                                position: 'center',
                                background: { r: 255, g: 255, b: 255 }
                            }).toFile(imgResize, (err, info) => {
                                if (err) {
                                    console.log(err);
                                }
                                if (info || forceConvert) {

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
                                                        fs.unlink(imgResize, (error) => {
                                                            if (error) {
                                                                console.log('fs.unlink error:', error)
                                                            } else {
                                                                // console.log('Fichier supprimer: ' + imgResize)

                                                            }
                                                        })
                                                        //Import to Database 

                                                        Product.findOne({ codeArticle: dataObject.codeArticle }, (error, product) => {

                                                            //Convert Gammes
                                                            const pvHt = parseInt(dataObject.pvHt)
                                                            const pvTtc = parseInt(dataObject.pvTtc)


                                                            //Callback
                                                            if (error) console.log('error:', error)
                                                            if (!product) {



                                                                const productModel = new Product({
                                                                    ...dataObject,
                                                                    isAProductGamme: false,

                                                                    pvHt: pvHt,
                                                                    pvTtc: pvTtc,
                                                                    // stock: stock,
                                                                    imageUrl: cloudinaryResult ? cloudinaryResult.secure_url : null,
                                                                    gammesValueConvert: {
                                                                        gammesValue: dataObject.gammesValue ? dataObject.gammesValue.split('¤') : null,
                                                                        gammes: dataObject.gamme ? dataObject.gamme.split('¤') : null,

                                                                    },

                                                                });
                                                                productModel.save((error, resultSaveProduct) => {
                                                                    if (error) console.log('error:', error)
                                                                    if (resultSaveProduct) {
                                                                        const codeGammes = resultSaveProduct.codeGamme
                                                                        ProductGamme.findOneAndUpdate({
                                                                            codeArticleGamme: codeGammes
                                                                        }, {
                                                                            $set: {
                                                                                imageUrl: []
                                                                            }
                                                                        }, (error, resultFindOneAndUpdate) => {
                                                                            if (error) console.log('error:', error);
                                                                            if (resultFindOneAndUpdate) {
                                                                                ProductGamme.findOneAndUpdate({
                                                                                    codeArticleGamme: codeGammes
                                                                                }, { $addToSet: { imageUrl: resultSaveProduct.imageUrl } }, (error, resultUpdateProductGamme) => {
                                                                                    if (error) console.log('error:', error);
                                                                                    if (resultUpdateProductGamme) {
                                                                                        console.log("🚀 ~ file: convertClasse.js ~ line 161 ~ ConvertProduct ~ ProductGamme.findOneAndUpdate ~ resultUpdateProductGamme", resultUpdateProductGamme)
                                                                                        console.log("success save product")
                                                                                    }
                                                                                })
                                                                            }
                                                                        })


                                                                    }

                                                                })


                                                            };
                                                            if (product) {
                                                                console.log('product:', product.stock)

                                                                Product.findOneAndUpdate({ codeArticle: product.codeArticle }, {
                                                                    $set: {
                                                                        ean: dataObject.ean,
                                                                        codeGamme: dataObject.codeGamme,
                                                                        gammesValue: dataObject.gammesValue,
                                                                        gamme: dataObject.gamme,
                                                                        codeFamille: dataObject.codeFamille,
                                                                        libelleFamille: dataObject.libelleFamille,
                                                                        codeSousFamille: dataObject.codeSousFamille,
                                                                        libelleSousFamille: dataObject.libelleSousFamille,
                                                                        libelle: dataObject.libelle,
                                                                        brand: dataObject.brand,
                                                                        shortDescription: dataObject.shortDescription,
                                                                        description: dataObject.description,
                                                                        stock: dataObject.stock,
                                                                        pvHt: pvHt,
                                                                        pvTtc: pvTtc,
                                                                        tva: dataObject.tva,
                                                                        imageUrl: cloudinaryResult ? cloudinaryResult.secure_url : null,
                                                                        gammesValueConvert: {
                                                                            gammesValue: product.gammesValue ? product.gammesValue.split('¤') : null,
                                                                            gammes: product.gamme ? product.gamme.split('¤') : null,
                                                                        },
                                                                        isAProductGamme: false,
                                                                    }


                                                                }, { new: true }, (error, result) => {
                                                                    console.log('result:', result.stock)

                                                                    if (error) console.log(error);
                                                                    if (result) {
                                                                        const codeGammes = result.codeGamme
                                                                        ProductGamme.findOneAndUpdate({
                                                                            codeArticleGamme: codeGammes
                                                                        }, {
                                                                            $set: {
                                                                                imageUrl: []
                                                                            }
                                                                        }, (error, resultFindOneAndUpdate) => {
                                                                            if (error) console.log('error:', error);
                                                                            if (resultFindOneAndUpdate) {
                                                                                ProductGamme.findOneAndUpdate({
                                                                                    codeArticleGamme: codeGammes
                                                                                }, { $addToSet: { imageUrl: result.imageUrl } }, (error, resultUpdateProductGamme) => {
                                                                                    if (error) console.log('error:', error);
                                                                                    if (resultUpdateProductGamme) {
                                                                                        // console.log("🚀 ~ file: convertClasse.js ~ line 161 ~ ConvertProduct ~ ProductGamme.findOneAndUpdate ~ resultUpdateProductGamme", resultUpdateProductGamme)
                                                                                        return "success mise a jour"
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                    }
                                                                })


                                                            }


                                                        })


                                                    }
                                                    //  else {
                                                    //     console.log("Image: " + filename + " upload errooooor!: " + error)
                                                    // }
                                                });
                                        }
                                    });


                                }

                            });
                        }
                    });

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
            console.log(error)
            return error
        })




    }
    //
    async producGammesCsvToJson() {
        try {
            const jsonToCsvData = await csv({
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
                }
            }).fromFile(this._productGammeCsv)
            try {
                if (jsonToCsvData) {
                    this._productGammesData = jsonToCsvData;

                    jsonToCsvData.map((productGamme) => {
                        console.log('productGamme:', productGamme.codeArticleGamme)

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


};

module.exports = ConvertProduct


