import { ResizeClass } from './resizeImage.js'
import { UploadToCloud } from './upload.js'
import { ConvertGamme } from './convertGamme.js'

const fs = require('fs');
const path = require('path');


const Product = require('../models/product.model')

export const sendProduct = (base64str, filename, productName, dataObject) => {
    //Convert csv to json
    let buf = Buffer.from(base64str, 'base64');
    fs.writeFile(path.join('./assets/images/', filename), buf, (error) => {
        if (error) {
            console.log(error);
        } else {
            const img = './assets/images/' + filename;
            const imgResize = './assets/images/Resize' + filename;
            //Resize Image
            try {
                const resizeResult = new ResizeClass(img, imgResize, 360, 540);
                resizeResult.resize
                // console.log('resizeResult:', resizeResult.resize)
                //Upload Image

                try {
                    const uploadResult = new UploadToCloud(imgResize, filename)
                    uploadResult.upload
                    setTimeout(() => {

                        try {
                            //Send data product to MongoDB
                            if (uploadResult._urlImg != null) {
                                // console.log('URL:', uploadResult._urlImg)
                                // console.log('Libellé:', dataObject.libelle)
                                // console.log('Prix HT:', parseFloat(dataObject.PVHT))
                                Product.findOne({ codeArticle: dataObject.codeArticle }).then((codeArticle) => {

                                    // const convertGamme = new ConvertGamme(dataObject);
                                    // convertGamme.getGammes.map(gamme => { console.log('gammes', gamme) })
                                    // console.log('convertGamme:', convertGamme.getGammes)
                                    // return
                                    if (codeArticle) {
                                        console.log("L'Article " + dataObject.libelle + " est déjà existant")

                                        Product.updateOne({ codeArticle: dataObject.codeArticle }, {
                                            ...dataObject,
                                            // codeArticle: dataObject.codeArticle,
                                            // name: dataObject.libelle,
                                            imageUrl: uploadResult._urlImg,
                                            pvHt: parseFloat(dataObject.pvHt),
                                            pvTtc: parseFloat(dataObject.pvTtc),
                                            // description: dataObject.description,
                                            // quantity: dataObject.stock
                                        }).then((res) => {
                                            console.log('Nombre de document modifié: ' + res.modifiedCount)
                                        }).catch((err) => { console.log('Erreur de modification: ' + err) })
                                    } else {
                                        const product = new Product({
                                            ...dataObject,
                                            imageUrl: uploadResult._urlImg,
                                            pvHt: parseFloat(dataObject.pvHt),
                                            pvTtc: parseFloat(dataObject.pvTtc),
                                            // codeArticle: dataObject.codeArticle,
                                            // name: dataObject.libelle,
                                            // imageUrl: uploadResult._urlImg,
                                            // priceHt: parseFloat(dataObject.PVHT),
                                            // priceTtc: parseFloat(dataObject.PVTTC),
                                            // description: dataObject.description,
                                            // quantity: dataObject.stock
                                        });
                                        product.save().then(() => console.log("Produit enregister sur la base de données"))
                                            .catch((error) => console.log(error));
                                    }
                                }).catch((error) => console.log(error));

                            } else {
                                // console.log("image absente")
                            }


                        } catch (error) {
                            console.log("error", error)
                            return false;

                        }
                    }, 8000)
                    // console.log('Import terminé!')
                } catch (error) {
                    console.log('Import échoué!')
                    console.log("error", error)
                    return false;
                }


            } catch (error) {
                console.log("error", error)
                return false;
            }

            return true;
        };
    });
};

// module.exports = sendProduct