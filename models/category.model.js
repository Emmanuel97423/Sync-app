const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    codeFamille: { type: String, required: true },
    libelleFamille: { type: String, required: true },
})

module.exports = mongoose.model("Category", categorySchema)