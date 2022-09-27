const sharp = require('sharp');
const fs = require('fs');
const cloudinary = require('cloudinary');
require('dotenv').config()

//Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


class ResizeClass {
    constructor(img, imgResizeName, width, height, filename) {
        this._img = img;
        this._imgResizeName = imgResizeName;
        this._width = width;
        this._height = height;
        this._filename = filename;
        this._imageUrl = ""

    }
    get imageUrl() { return this._imageUrl }
    get uploadResult() {
        return this._uploadResult;
    }

    get resize() {
        return this.resizeMedium()
    };

    async resizeMedium() {

        try {

            const resizeBySharp = await sharp(this._img).resize(this._width, this._height, {

                fit: 'cover',
                position: 'center',
            }).toFile(this._imgResizeName);

            if (resizeBySharp) {
                fs.unlink(this._img, async (error) => {
                    if (error) {
                        console.log(error)
                        return
                    }
                    else {
                        try {

                            return await cloudinary.v2.uploader.upload(this._imgResizeName,

                                { public_id: this._filename }, (error, result) => {
                                    if (result) {

                                        try {

                                            fs.unlink(this._imgResizeName, (error) => {
                                                if (error) {
                                                    console.log('fs.unlink error:', error)
                                                } else {
                                                    console.log('Fichier supprimer: ' + this._imgResizeName)
                                                    // console.log('result:', result.secure_url)
                                                    this._imageUrl = result.secure_url
                                                    return result.secure_url

                                                }
                                            })

                                        } catch (error) {
                                            console.log('error:', error)

                                        }


                                    } else {
                                        console.log("Image: " + this._filename + " upload errooooor!: " + error)

                                    }
                                })
                        } catch (error) {
                            console.log('error:', error)

                        }


                    }
                })


            }


        }
        catch (err) {
            console.log('err:', err)
        }



    }

}

module.exports = ResizeClass;