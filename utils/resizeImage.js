const sharp = require('sharp');
const fs = require('fs');
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
    constructor(img, imgResizeName, width, height) {
        this._img = img;
        this._imgResizeName = imgResizeName;
        this._width = width;
        this._height = height;
    }

    get resize() {
        return this.resizeMedium()
    };

    async resizeMedium() {
        try {

            await sharp(this._img).resize(this._width, this._height, {
                fit: 'cover',
                position: 'center',
            }).toFile(this._imgResizeName);
            console.log('Image: ' + this._imgResizeName + ' redimensionné!')
            try {
                fs.unlinkSync(this._img)
                console.log('Supression image:' + this._imgResizeName + ' Réussi!')
            } catch (error) {
                console.log('La suppression à échoué: ' + error)

            }
        }
        catch (err) {
            console.log("Le redimensionnement a échoué la Poooo!: Format d'image invalide!")
            return false
        }
    }
}

