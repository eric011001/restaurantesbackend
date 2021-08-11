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
    },
    comentario: {
        type: String,
        trim: true
        
    },
    mesa: {
        type: String,
        require: true,
        trim: true
    },
    fecha:{
        type: Date,
        default: Date.now()
    },
    fechaFinal:{
        type: Date
    }
})

module.exports = mongoose.model('Pedido',PedidoSchema)