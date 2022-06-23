const mongoose = require('mongoose');

const gammeSchema = mongoose.Schema({
    gammeCode: { type: String, required: true },
    libelle: { type: String, required: true },
    elementsGammeLibelle: { type: String, required: true },

});

module.exports = mongoose.model("Gamme", gammeSchema)