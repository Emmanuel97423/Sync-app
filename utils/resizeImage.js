const sharp = require('sharp');
// sharp.cache(false);

// const resize = async (img, imgResizeName, width) => {

//     try {
//         await sharp(img).resize(width).toFile(imgResizeName)
//     }
//     catch (err) {
//         console.log(err)
//     }
// }

export class ResizeClass {
    constructor(img, imgResizeName, width) {
        this._img = img;
        this._imgResizeName = imgResizeName;
        this._width = width;
    }

    get resize() {
        return this.resizeMedium()
    };

    async resizeMedium() {
        try {
            await sharp(this._img).resize(this._width).toFile(this._imgResizeName);
            console.log('Image redimensionné!')
        }
        catch (err) {
            console.log(err)
        }
    }
}

// module.exports = resize;