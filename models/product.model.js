const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    ean: { type: Number, required: false },
    codeArticle: { type: String, required: true },
    codeGamme: { type: String, required: false, ref: "productGamme" },
    codeFamille: { type: String, required: false },
    libelleFamille: { type: String, required: true },
    codeSousFamille: { type: String, required: false },
    libelleSousFamille: { type: String, required: false },
    libelle: { type: String, required: false },
    category: { type: String, required: true },
    type: { type: String, required: false },
    manufacturer: { type: String, required: false },
    shortDescription: { type: String, required: false },
    description: { type: String, required: false },
    size: { type: String, required: false },
    color: { type: String, required: false },
    weight: { type: String, required: false },
    imageUrl: { type: String, required: false },
    costPrice: { type: Number, required: false },
    priceHt: { type: Number, required: false },
    priceTtc: { type: Number, required: false },
    stock: { type: Number, default: 1, min: 0 },
    actived: { type: String, required: false },
    tva: { type: Number, required: false },
});

module.exports = mongoose.model("Product", productSchema);