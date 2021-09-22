const csv = require('csvtojson');
const csvFilePath = './assets/test.csv'
const fs = require('fs');
const path = require('path');
const fsExtra = require('fs-extra')

// const uploadFile = require('../utils/upload.js')

import { ResizeClass } from '../utils/resizeImage.js'
import { UploadToCloud } from '../utils/upload.js'
// const resize = require('../utils/resizeImage.js');
// const upload = require('../utils/upload.js');

// const url = 'http://monserver.com'

exports.convertToJson = async (req, res, next) => {


    const decodeBase64 = (base64str, filename, productName, dataObject) => {
        let urlImg = ""
        let buf = Buffer.from(base64str, 'base64');
        fs.writeFile(path.join('./assets/images/', filename), buf, (error) => {
            if (error) {
                console.log(error);
            } else {
                const img = './assets/images/' + filename;
                const imgResize = './assets/images/Resize' + filename;


                //Resize Image
                try {
                    const resizeResult = new ResizeClass(img, imgResize, 400);
                    resizeResult.resize
                    // console.log('resizeResult:', resizeResult.resize)
                    //Upload Image

                    try {
                        const uploadResult = new UploadToCloud(imgResize, filename)
                        uploadResult.upload
                        setTimeout(() => {
                            try {
                                if (urlImg) {
                                    console.log('uploadResult:', uploadResult._result)
                                    urlImg = uploadResult._urlImg
                                    console.log('urlImg', urlImg)
                                    console.log('productName:', productName)

                                    console.log('libelle:', dataObject.libelle)
                                    console.log('Prix HT:', parseFloat(dataObject.PVHT))

                                    console.log('Envoi terminé avec succée!')
                                } else {
                                    console.log('Envoi refusé: image abscente')
                                    return false;
                                }



                            } catch (error) {
                                console.log("error", error)
                                return false;

                            }
                        }, 5000)
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
    //Convert to bas64 and send to server
    try {

        const data = await csv({

            noheader: false,
            headers: ['codeArticle', 'libelle', 'PVHT', 'PVTTC', 'codeBar', 'image1'],
            trim: true,
        }).fromFile(csvFilePath);
        // console.log('data:', data)
        const dataConvert = await Object.keys(data).forEach(key => {
            //Csv to json Object
            let dataObject = data[key];
            //Product name
            let productName = data[key].libelle;
            //to lower case product name
            productName = productName.toLowerCase().replace(/\s/g, '-')

            let imageName = productName + '.jpg'
            // let imageUrl = "./assets/images/" + imageName
            //Convert base64 to file
            let base64String = data[key].image1;
            // console.log('base64String:', base64String)

            if (base64String) {
                console.log(productName)
                try {
                    const decodeBase = decodeBase64(base64String, imageName, productName, dataObject)

                    setTimeout(() => {
                        try {
                            const directory = './assets/images/'
                            fsExtra.emptyDirSync(directory)
                            console.log("Supression image en cache terminé")

                        } catch (error) {
                            console.log("La suppression des images du dossier à échouer: " + error)

                        }

                    }, 10000)

                } catch (e) {
                    console.error(e)
                    console.log('Import  échoué!')
                }

            }


        });

    } catch (error) {
        console.log('Import échoué!')
        res.status(500).send(error.message)
    }

}



