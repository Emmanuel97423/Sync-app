const cloudinary = require('cloudinary');
const fs = require('fs');

require('dotenv').config()

//Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// const upload = (imgResize, filename) => {


// }

// module.exports = upload
// cloudinary.image("turtles.jpg", { width: 70, height: 53, crop: "scale" })

class UploadToCloud {
    constructor(imgResize, filename, result, urlImg) {
        this._imgResize = imgResize;
        this._filename = filename;
        this._result = result
        this._urlImg = urlImg;

    }
    get upload() {
        return this.uploadMethod()
    }
    uploadMethod() {
        // console.log('this._imgResize:', this._imgResize)
        // try {
        setTimeout(() => {
            cloudinary.v2.uploader.upload(this._imgResize, {

                public_id: this._filename,
            },
                (error, result) => {
                    if (result) {
                        // console.log('result:', result)

                        this._result = result;
                        this._urlImg = result.url;
                        // console.log("Image: " + this._filename + " uploader avec succée!")
                        try {
                            fs.unlinkSync(this._imgResize)
                        } catch (error) {
                            console.log("Impossible de supprimer l'image: " + error)
                        }
                    } else {
                        // console.log("Image: " + this._filename + " upload errooooor!: " + error)

                        return error
                    }
                })
        }, 2000)


        // } catch (err) {
        //     console.log(err);
        // }
    }
};

module.exports = UploadToCloud;





