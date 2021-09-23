const fs = require('fs');
const path = require('path');

import { ResizeClass } from './resizeImage.js'
import { UploadToCloud } from './upload.js'


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
                const resizeResult = new ResizeClass(img, imgResize, 400, 350);
                resizeResult.resize
                // console.log('resizeResult:', resizeResult.resize)


                //Upload Image

                try {
                    const uploadResult = new UploadToCloud(imgResize, filename)
                    uploadResult.upload
                    setTimeout(() => {

                        try {
                            //Send data product to MongoDB
                            if (uploadResult._urlImg) {
                                console.log('URL:', uploadResult._urlImg)
                                console.log('Libellé:', dataObject.libelle)
                                console.log('Prix HT:', parseFloat(dataObject.PVHT))
                                Product.findOne({ name: dataObject.libelle }).then((name) => {
                                    if (name) {
                                        console.log("L'Article " + dataObject.libelle + " est déjà existant")
                                    } else {
                                        const product = new Product({
                                            name: dataObject.libelle,
                                            imageUrl: uploadResult._urlImg,
                                            price: parseFloat(dataObject.PVHT),
                                        });
                                        product.save().then(() => console.log("Produit enregister sur la base de données"))
                                            .catch((error) => console.log(error));
                                    }
                                }).catch((error) => console.log(error));

                            }


                        } catch (error) {
                            console.log("error", error)
                            return false;

                        }
                    }, 8000)
                    console.log('Import terminé!')
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