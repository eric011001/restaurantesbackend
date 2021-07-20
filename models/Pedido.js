const mongoose = require('mongoose');

const PedidoSchema = mongoose.Schema({
    pedido: {
        type: Array
    },
    total: {
        type: Number,
        require: true
    },
    estado: {
        type: String,
        require: true,
        trim: true
    }
})

module.exports = mongoose.model('Pedido',PedidoSchema)