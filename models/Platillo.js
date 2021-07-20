const mongoose = require('mongoose');

const PlatilloSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    precio: {
        type: Number,
        require: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    disponible: {
        type: Boolean,
        require: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ('Categoria')
    }
});

module.exports = mongoose.model('Platillo',PlatilloSchema);