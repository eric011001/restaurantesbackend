const mongoose = require('mongoose');

const GeneralesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    direccion: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    facebook: {
        type: String,
        trim: true
    },
    instagram: {
        type: String,
        trim: true
    },
    whatsapp: {
        type: String,
        trim: true
    }
})

module.exports = mongoose.model('Generales',GeneralesSchema);