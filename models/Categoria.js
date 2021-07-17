const mongoose = require('mongoose');

const CategoriaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    orden: {
        type: Number,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Categoria',CategoriaSchema);