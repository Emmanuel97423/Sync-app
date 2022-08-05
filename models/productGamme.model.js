const mongoose = require('mongoose');

const productGammeSchema = mongoose.Schema({
    codeArticleGamme: { type: String, required: true },
    libelle: { type: String, required: true },
    libelleFamille: { type: String, required: true },
    brand: { type: String, required: false },
    pvHt: { type: Number, required: true },
    tva: { type: String, required: true },
    imageUrl: { type: String, required: false },
    pvTtc: { type: Number, required: true },
    description: { type: String, required: false },
    isAProductGamme: { type: Boolean, required: true },
    variantId: [{ type: Array, ref: 'Product' }]
})

module.exports = mongoose.model("ProductGamme", productGammeSchema)