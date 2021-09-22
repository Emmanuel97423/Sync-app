const csv = require('csvtojson');
const csvFilePath = './assets/test.csv'
const fs = require('fs');
const path = require('path');

// const uploadFile = require('../utils/upload.js')

import { ResizeClass } from '../utils/resizeImage.js'
import { UploadToCloud } from '../utils/upload.js'
// const resize = require('../utils/resizeImage.js');
// const upload = require('../utils/upload.js');

// const url = 'http://monserver.com'



exports.convertToJson = async (req, res, next) => {
    const decodeBase64 = (base64str, filename) => {
        let buf = Buffer.from(base64str, 'base64');
        fs.writeFile(path.join('./assets/images/', filename), buf, (error) => {
            if (error) {
                console.log(error);
            } else {
                const img = './assets/images/' + filename;
                const imgResize = './assets/images/Resize' + filename;

                try {
                    // resize(img, imgResize, 400)
                    const resizeResult = new ResizeClass(img, imgResize, 400);
                    console.log('resizeResult:', resizeResult.resize);

                    try {
                        const uploadResult = new UploadToCloud(imgResize, filename)
                        // console.log('uploadResult:', uploadResult.upload)
                        try {
                            uploadResult.upload

                            try {
                                setTimeout(() => { const url = uploadResult._result.url; console.log('url', url) }, 5000)

                            } catch (err) {
                                console.log(err)
                            }

                            // const imgCloudinaryUrl = 
                            // console.log('imgCloudinaryUrl:', imgCloudinaryUrl)
                        } catch (err) { console.log(err) }



                    } catch (error) {
                        console.log(error);
                    }
                } catch (error) {
                    console.log(error);
                }
                return true;
            }
        });
    }
    //Convert to bas64 and send to server
    try {

        const data = await csv({
            noheader: false,
            headers: ['codeArticle', 'libelle', 'codeFamille', 'PVHT', 'PVTTC', 'image1', 'thumbail'],
            trim: true,
        }).fromFile(csvFilePath);

        const dataConvert = await Object.keys(data).forEach(key => {
            //Csv to json Object
            const dataObject = data[key];
            //Product name
            let productName = data[key].libelle;
            //to lower case product name
            productName = productName.toLowerCase().replace(/\s/g, '-')
            //Convert base64 to file
            let base64String = data[key].image1;

            if (base64String) {
                let imageName = productName + '.jpg'
                // let imageUrl = "./assets/images/" + imageName
                try {

                    decodeBase64(base64String, imageName)

                } catch (e) {
                    console.error(e)
                }

            }
        });
        res.send("hello");
    } catch (error) {
        console.error(error)
    }

}



