const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    id: { type: mongoose.Schema.ObjectId, ref: "Product" },
    ean: { type: Number, required: false },
    codeArticle: { type: String, required: false },
    name: { type: String, required: false },
    type: { type: String, required: false },
    manufacturer: { type: String, required: false },
    shortDescription: { type: String, required: false },
    description: { type: String, required: false },
    imageUrl: { type: String, required: false },
    costPrice: { type: Number, required: false },
    priceHt: { type: Number, required: false },
    priceTtc: { type: Number, required: false },
    quantity: { type: Number, default: 1, min: 0 },
    actived: { type: String, required: false },
    tax: { type: Number, required: false },
});

module.exports = mongoose.model("Product", productSchema);