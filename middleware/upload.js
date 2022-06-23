const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'text/plain': 'csv'

}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, 'assets/')
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const uniqueSuffix = Date.now()
        const name = file.originalname.split('.').join('-')

        const extention = MIME_TYPES[file.mimetype]
        cb(null, name + '.' + extention)
    }

});


module.exports = multer({ storage: storage }).single('product-gamme');