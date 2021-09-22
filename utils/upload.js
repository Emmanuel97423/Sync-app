const cloudinary = require('cloudinary');

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

export class UploadToCloud {
    constructor(imgResize, filename, result) {
        this._imgResize = imgResize;
        this._filename = filename;
        this._result = result

    }
    get upload() {
        return this.uploadMethod()
    }
    uploadMethod() {
        // try {
        setTimeout(() => {
            cloudinary.v2.uploader.upload(this._imgResize, {
                public_id: this._filename,
            },
                (error, result) => {
                    if (result) {
                        console.log(result)
                        return this._result = result;
                    } else { console.log(error) }
                })
        }, 2000)


        // } catch (err) {
        //     console.log(err);
        // }
    }
}



