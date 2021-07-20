const mongoose = require('mongoose');
const MesaSchema = mongoose.Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    }
})

module.exports = mongoose.model('Mesa',MesaSchema);