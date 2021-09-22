const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const sharp = require("sharp");

require("dotenv").config();


const uploadFile = (file) => {

    const decodeBase64 = (base64str, filename) => {
        let buf = Buffer.from(base64str, 'base64');

        fs.writeFile(path.join('./assets/images/', filename), buf, (error) => {
            if (error) {
                throw new Error(error);
            } else {
                console.log('Image créée depuis base64: ' + filename);
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

        const dataConvert = Object.keys(data).forEach(key => {
            //Csv to json Object
            const dataObject = data[key];

            //Product name
            let productName = data[key].libelle;

            //to lower case product name
            productName = productName.toLowerCase().replace(/\s/g, '-')

            //Convert base64 to file
            let base64String = data[key].image1;
            if (base64String) {
                const imageName = productName + '.jpg'
                decodeBase64(base64String, imageName)

                //image url
                const imageUrl = url + '/' + productName + '.jpg'
                console.log(imageUrl);
            }

        });

        // console.log(typeof (dataConvert));
        res.json(dataConvert);
    } catch (error) {
        console.error(error)
    }



    aws.config.update({
        apiVersion: "2006-03-01",
        accessKeyId: process.env.AWSAccessKeyId,
        secretAccessKey: process.env.AWSSecretKey,
        region: process.env.AWSRegion,
    });
    const s3 = new aws.S3();

    multer({
        storage: multerS3({
            s3: s3,
            bucket: process.env.AWSBucket,
            shouldTransform: function (req, file, cb) {
                cb(null, /^image/i.test(file.mimetype));
            },
            transforms: [
                {
                    id: "original",
                    key: function (req, file, cb) {
                        cb(
                            null,
                            file.originalname
                            // Date.now().toString() + "image-original.jpg" + 
                        );
                    },
                    transform: function (req, file, cb) {
                        cb(null, sharp().resize(510, 600));
                    },
                },
                {
                    id: "thumbnail",
                    key: function (req, file, cb) {
                        cb(
                            null,
                            file.originalname
                            // Date.now().toString() + "image-thumbnail" + 
                        );
                    },
                    transform: function (req, file, cb) {
                        cb(null, sharp().resize(110, 200));
                    },
                },
            ],
            acl: "public-read",
            contentType: multerS3.AUTO_CONTENT_TYPE,
            metadata: (req, file, cb) => {
                cb(null, { fieldName: file.fieldname });
            },
            key: (req, file, cb) => {
                cb(null, Date.now().toString() + file.originalname);
            },
        }),
    });
}

