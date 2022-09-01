const mongoose = require('mongoose');

const SubCategorySchema = mongoose.Schema({
    codeSousFamille: { type: String, required: true },
    libelleSousFamille: { type: String, required: true },
    codeFamille: { type: String, required: true },
})

module.exports = mongoose.model("SubCategory", SubCategorySchema)