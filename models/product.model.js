const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    ean: { type: Number, required: false },
    codeArticle: { type: String, required: true },
    codeGamme: { type: String, required: false },
    gammesValue: { type: String, required: false },
    gamme: { type: String, required: false },
    codeFamille: { type: String, required: false },
    libelleFamille: { type: String, required: false },
    codeSousFamille: { type: String, required: false },
    libelleSousFamille: { type: String, required: false },
    libelle: { type: String, required: false },
    type: { type: String, required: false },
    brand: { type: String, required: false },
    shortDescription: { type: String, required: false },
    description: { type: String, required: false },
    size: { type: String, required: false },
    color: { type: String, required: false },
    weight: { type: String, required: false },
    imageUrl: { type: String, required: false },
    pvHt: { type: Number, default: 0, required: false },
    pvTtc: { type: Number, default: 0, required: false },
    stock: { type: Number, required: true },
    actived: { type: String, required: false },
    tva: { type: String, required: false },
    isAProductGamme: { type: Boolean, required: false },
    productGamme: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductGamme' },
    gammesValueConvert: {
        gammesValue: { type: Array, required: false },
        gammes: { type: Array, required: false }
    },

});

module.exports = mongoose.model("Product", productSchema);