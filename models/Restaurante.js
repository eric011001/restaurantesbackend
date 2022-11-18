const mongoose = require('mongoose');
const RestauranteSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    direccion: {
        type: String,
        require: true,
        trim: String
    },
    latitud: {
        type: Number,
        require: true
    },
    longitud: {
        type: Number,
        require: true
    },
    telefono: {
        type: String,
        require: true,
        trim: String
    },
    horario: {
        type: Array,
    },
    correoResponsable: {
        type: String,
        trim: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ('CategoriaRestaurante')
    },
    subcategoria: {
        type: Array
    },
    facebook: {
        type: String,
        trim: true
    },
    instagram: {
        type: String,
        trim: true
    }
})

module.exports = mongoose.model('Restaurante',RestauranteSchema);