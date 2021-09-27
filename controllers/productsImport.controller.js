const csv = require('csvtojson');
const csvFilePath = './assets/test.csv'
const fsExtra = require('fs-extra')


import { sendProduct } from '../utils/sendProduct.js'



exports.convertToJson = async (req, res, next) => {
    const directory = './assets/images/'

    //Convert to bas64 and send to server
    try {

        const data = await csv({

            noheader: false,
            headers: ['codeArticle', 'libelle', 'PVHT', 'PVTTC', 'codeBar', 'image1'],
            trim: true,
        }).fromFile(csvFilePath);

        //Loop data json

        const dataConvert = await Object.keys(data).forEach(key => {
            //Csv to json Object
            let dataObject = data[key];
            //Product name
            let productName = data[key].libelle;
            console.log('productName:', productName)
            //to lower case product name
            productName = productName.toLowerCase().replace(/\s/g, '-')

            let imageName = productName
            // let imageUrl = "./assets/images/" + imageName
            //Convert base64 to file
            let base64String = data[key].image1;

            if (base64String) {

                try {
                    sendProduct(base64String, imageName, productName, dataObject)

                    setTimeout(() => {
                        try {

                            fsExtra.emptyDirSync(directory)
                            console.log("Supression image en cache terminé")
                            console.log("message: Import envoyé")
                            return res.status(201).send({ message: 'Import envoyé' })
                        } catch (error) {
                            console.log("La suppression des images du dossier à échouer: " + error)

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



