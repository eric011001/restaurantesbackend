const mongoose = require('mongoose');

const CategoriaRestauranteSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    }
})

module.exports = mongoose.model('CategoriaRestaurante',CategoriaRestauranteSchema);
