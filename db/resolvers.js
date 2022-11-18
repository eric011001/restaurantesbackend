const Generales = require('../models/Generales');
const Usuario = require('../models/Usuario');
const Categoria = require('../models/Categoria');
const Mesa = require('../models/Mesa');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Platillo = require('../models/Platillo');
const Pedido = require('../models/Pedido');
const { off } = require('commander');
const Restaurante = require('../models/Restaurante');
require('dotenv').config({ path: 'variables.env'});

const crearTokenUsuario = (usuario, secreta, expiresIn) => {
    const {id, nombre, apellidos, email, status, rol,restaurante} = usuario;
    return jwt.sign({id,nombre,apellidos,email,status,rol,restaurante},secreta, { expiresIn } );

}

const resolvers = {
        Query: {
            obtenerRestaurantes: async (_, {input},ctx) => {
                const {latitud1,longitud1,latitud2,longitud2} = input;

                const restaurantes = await Restaurante.find({
                    "latitud": {$lte: (latitud1>latitud2 ? latitud1 : latitud2),$gte: (latitud1>latitud2 ? latitud2 : latitud1)},
                    "longitud" : {$lte : (longitud1>longitud2 ? longitud1 : longitud2), $gte : (longitud1>longitud2 ? longitud2 : longitud1)}
                });
                return restaurantes;
            },
            obtenerRestaurante: async (_,{id},ctx) => {
                const restaurante = await Restaurante.findById(id);
                if(!restaurante) {
                    throw new Error("El restaurante no existe");
                }
                return restaurante;
            },
            obtenerGenerales: async () => {
                const generales = await Generales.find({});
                return generales;
            },
            obtenerCategorias: async (_, {}, ctx) => {
                if(ctx.rol !== "ADMINISTRADOR" && ctx.status === "INACTIVO"){
                    throw new Error('No cuentas con los permisos para esta acción');
                }
                
                const categorias = await Categoria.find({}).sort({orden: 1});
                return categorias;
            },
            obtenerCategoria: async (_,{id},ctx) => {
                if(ctx.rol !== "ADMINISTRADOR" && ctx.status === "INACTIVO"){
                    throw new Error('No cuentas con los permisos para esta acción');
                }
                const categoria = await Categoria.findById(id);
                if(!categoria){
                    throw new Error("La categoria no existe");
                }

                return categoria;
            },
            obtenerUsuarios: async (_,{},ctx) => {
                if(ctx.rol !== "ADMINISTRADOR" && ctx.status === "INACTIVO"){
                    throw new Error('No cuentas con los permisos para esta acción');
                }

                const usuarios = await Usuario.find({});
                return usuarios;
            },
            obtenerUsuario: async (_,{id},ctx) => {
                const usuario = await Usuario.findById(id);
                if(!usuario){
                    throw new Error("El usuario no existe");
                }
                return(usuario);
            },
            obtenerMiUsuario: async (_,{},ctx) => {
                return ctx;
            },
            obtenerMesas: async (_,{},ctx) => {
                const mesas = await Mesa.find({});
                return mesas;
            },
            obtenerMesa: async (_,{id},ctx) => {
                const mesa = await Mesa.findById(id);
                if(!mesa){
                    throw new Error('la mesa no existe');
                }
                return mesa;
            },
            obtenerPlatillos: async (_,{},ctx) => {
                try {

                    //const platillos = await Platillo.find({}).populate({path: "categoria",options: {sort: [['categoria.orden','asc']]}});
                    
                    const platillos = await Platillo.aggregate([
                        {$match: {}},
                        {
                            $lookup: {
                              from: 'categorias',
                              localField: 'categoria',
                              foreignField:'_id',
                              as: 'categoria'
                            }
                        },
                        {
                            $unwind: '$categoria' // this to convert the array of one object to be an object
                        },
                        {
                            $project: {
                              _id: 1,
                              descripcion: 1,
                              extras: {
                                  precio: 1,
                                  nombre: 1
                              },
                              disponible: 1,
                              nombre: 1,
                              precio: 1,
                              // project the values from damages in the spells array in a new array called damages
                              orden: '$categoria.orden',
                              categoria: {
                                _id: 1,
                                nombre: 1,
                                orden: 1
                              }
                            }
                        },
                        {
                            $project: {
                              _id: 0,
                              id: '$_id',
                              descripcion: 1,
                              extras: 1,
                              nombre: 1,
                              precio: 1,
                              categoria: {
                                id: '$categoria._id',
                                nombre: 1,
                                orden: 1
                              },
                              disponible: 1,
                              maxDamage: {$max: '$orden'}
                            }
                        },
                        {
                            $sort: {maxDamage: 1}
                        }
                    ])
                    return platillos;
                } catch (error) {
                    console.log(error);
                }
                
            },
            obtenerPlatillosDisponiblesCategoria: async (_,{categoria},ctx) => {
                try {
                    const platillos = await Platillo.find({categoria: `${categoria}`, disponible: true}).populate('categoria');
                    console.log(platillos);
                    
                    //const platillos = await Platillo.find({}).populate({path: "categoria",options: {sort: [['categoria.orden','asc']]}});
                    
                    /*const platillos = await Platillo.aggregate([
                        {$match: {disponible: true, categoria: '6374e55858c90bad838116fe'}},
                        {
                            $lookup: {
                              from: 'categorias',
                              localField: 'categoria',
                              foreignField:'_id',
                              as: 'categoria'
                            }
                        },
                        {
                            $unwind: '$categoria' 
                        },
                        {
                            $project: {
                              _id: 1,
                              descripcion: 1,
                              extras: {
                                  precio: 1,
                                  nombre: 1
                              },
                              disponible: 1,
                              nombre: 1,
                              precio: 1,
                              
                              orden: '$categoria.orden',
                              categoria: {
                                _id: 1,
                                nombre: 1,
                                orden: 1
                              }
                            }
                        },
                        {
                            $project: {
                              _id: 0,
                              id: '$_id',
                              descripcion: 1,
                              extras: 1,
                              nombre: 1,
                              precio: 1,
                              categoria:{
                                id: '$categoria._id',
                                nombre: 1,
                                orden: 1
                              },
                              disponible: 1,
                              maxDamage: {$max: '$orden'}
                            }
                        },
                        {
                            $sort: {maxDamage: 1}
                        }
                    ])*/
                    return platillos;
                } catch (error) {
                    console.log(error);
                }
            },
            obtenerPlatillosDisponibles: async (_,{},ctx) => {
                try {

                    //const platillos = await Platillo.find({}).populate({path: "categoria",options: {sort: [['categoria.orden','asc']]}});
                    
                    const platillos = await Platillo.aggregate([
                        {$match: {disponible: true}},
                        {
                            $lookup: {
                              from: 'categorias',
                              localField: 'categoria',
                              foreignField:'_id',
                              as: 'categoria'
                            }
                        },
                        {
                            $unwind: '$categoria' // this to convert the array of one object to be an object
                        },
                        {
                            $project: {
                              _id: 1,
                              descripcion: 1,
                              extras: {
                                  precio: 1,
                                  nombre: 1
                              },
                              disponible: 1,
                              nombre: 1,
                              precio: 1,
                              // project the values from damages in the spells array in a new array called damages
                              orden: '$categoria.orden',
                              categoria: {
                                _id: 1,
                                nombre: 1,
                                orden: 1
                              }
                            }
                        },
                        {
                            $project: {
                              _id: 0,
                              id: '$_id',
                              descripcion: 1,
                              extras: 1,
                              nombre: 1,
                              precio: 1,
                              categoria:{
                                id: '$categoria._id',
                                nombre: 1,
                                orden: 1
                              },
                              disponible: 1,
                              maxDamage: {$max: '$orden'}
                            }
                        },
                        {
                            $sort: {maxDamage: 1}
                        }
                    ])
                    return platillos;
                } catch (error) {
                    console.log(error);
                }
            },
            obtenerPlatillo: async (_,{id},ctx) => {
                const existePlatillo = await Platillo.findById(id).populate('categoria');
                if(!existePlatillo){
                    throw new Error("El platillo no existe");
                }
                return existePlatillo;
            },
            obtenerPedidos: async (_,{},ctx) => {
                const pedidos = await Pedido.find({});
                return pedidos;
            },
            obtenerPedidosActivos: async (_,{},ctx) => {
                const pedidos = await Pedido.find({estado : {$ne : "COMPLETADO"}});
                return pedidos;
            },
            obtenerPedido: async (_,{id},ctx) => {
                const existePedido = await Pedido.findById(id);
                if(!existePedido){
                    throw new Error("El platillo no existe");
                }
                return existePedido;
            },
            obtenerIngresosyPedidos: async(_,{},ctx) => {
                const offset = 21600000;
                const now = new Date(Date.now()-offset);
                let today = new Date(Date.now());
                let week = new Date(Date.now()-518400000);
                let morning =new Date(`${now.getFullYear()}-${now.getMonth()+1<10 ? ("0") :""}${now.getMonth()+1}-${now.getDate()<10 ? ("0") : ""}${now.getDate()}:00:00.000Z`);
                
      

                const datos = await Pedido.aggregate([
                    {$match: {estado: "COMPLETADO",fecha: {$gte: week, $lte: today}} },
                    {
                        $project: {
                            "y":{"$year":"$fecha"},
                            "m":{"$month":"$fecha"},
                            "d":{"$dayOfMonth":"$fecha"},
                            "h":{"$hour":"$fecha"},
                            "total":1

                        }
                    },
                    {
                        $group: {
                            _id: { "year":"$y","month":"$m","day":"$d","hour":"$h"},
                            //_id: "$h",
                            ingresos: {$sum: "$total"},
                            noPedidos:{$sum:1}

                        }
                    }
                ]);
                let final = [];
                datos.forEach(dato => {
                    final.push({fecha: dato._id, ingresos: dato.ingresos, noPedidos: dato.noPedidos});
                })
                console.log(final);
                return final;

            }
        },
        Mutation: {
            crearNuevoRestaurante: async(_,{input},ctx) => {
                const {rol} = ctx;
                if(rol !== "SUPERADMINISTRADOR"){
                    throw new Error("No cuentas con las credenciales para realizar esta acción");
                }
                const restaurante = new Restaurante(input);
                
                restaurante.save();
                return restaurante;
            },
            crearNuevoUsuario: async (_,{input}, ctx) => {
                const {email, password,rol,restaurante} = input;
                try {
                    if(rol === "ADMINISTRADOR" || rol === "USUARIO"){
                        if(!restaurante || restaurante === ""){
                            throw new Error("Se requiere de un restaurante");
                        }
                    }
                    const usuarioExiste = await Usuario.findOne({email});

                    if(usuarioExiste){
                        throw new Error('El usaurio ya existe');
                    }

                    const salt = await bcryptjs.genSalt(10);
                    input.password = await bcryptjs.hash(password, salt);

                    const usuario = new Usuario(input);
                    usuario.save();
                    return usuario;
                } catch (error) {
                    throw new Error(error);
                }
            },
            autenticarUsuario: async (_,{input},ctx) => {
                const {email, password} = input;
                const usuarioExiste = await Usuario.findOne({email});
                if(!usuarioExiste) {
                    throw new Error('El usuario no existe');
                }
                const passwordCorrecto = await bcryptjs.compare(password,usuarioExiste.password);
                if(!passwordCorrecto){
                    throw new Error('El usuario o la contraseña estan mal escritos');
                }
                if(usuarioExiste.status === 'INACTIVO'){
                    throw new Error('El usaurio se encuentra inactivo en este momento');
                }


                return{
                    token: crearTokenUsuario(usuarioExiste,process.env.SECRETA,'28D')
                }
            },
            actualizarUsuario: async(_, {id,input},ctx) => {
                const {lastPassword} = input;
                const usuario = await Usuario.findById(id);
                if(!usuario){
                    throw new Error("El usuario no existe");
                }
                const newUsuario = await Usuario.findOneAndUpdate({_id: id},input, { new: true});
                return newUsuario;

            },
            cambiarClaveUsuario: async (_,{id,input}, ctx) => {
                const {lastPassword,newPassword,confirmNewPassword} = input;
                const usuario = await Usuario.findById(id);
                if(newPassword !== confirmNewPassword){
                    throw new Error("Las claves no coinciden")
                }
                if(!usuario){
                    throw new Error("El usuario no existe");
                }
                const passwordCorrecto = await bcryptjs.compare(lastPassword,usuario.password);
                if(!passwordCorrecto){
                    throw new Error('La confirmación de la contraseña no es correcta');
                }
                const salt = await bcryptjs.genSalt(10);
                const password = await bcryptjs.hash(newPassword, salt);

                const newUsuario = await Usuario.findOneAndUpdate({_id: id}, {password: password},{new: true});
                return newUsuario;
            },
            eliminarUsuario: async (_,{id},ctx) => {
                if(ctx.rol !== "ADMINISTRADOR" && ctx.status === "INACTIVO"){
                    throw new Error('No cuentas con los permisos para esta acción');
                }
                const existeUsuario = Usuario.findById(id);
                if(!existeUsuario){
                    throw new Error("El usuario no existe");
                }
                try { 
                    await Usuario.findByIdAndDelete(id);
                    return "Usuario eliminado"
                } catch (error) {
                    throw new Error(error);
                }
                
            },
            crearNuevaCategoria: async (_,{input},ctx) => {
                if(ctx.rol !== "ADMINISTRADOR" && ctx.status === "INACTIVO"){
                    throw new Error('No cuentas con los permisos para esta acción');
                }
                try {
                    const categoria = new Categoria(input);
                    categoria.save();
                    return categoria;
                } catch (error) {
                    throw new Error(error);
                }
                console.log(ctx);
            },
            actualizarCategoria: async (_,{id,input}, ctx) => {
                const existeCategoria = Categoria.findById(id);
                if(!existeCategoria){
                    throw new Error("La categoria no existe");
                }
                const respuesta = Categoria.findOneAndUpdate({_id: id}, input, {new: true});
                return respuesta;
            },
            eliminarCategoria: async (_,{id},ctx) => {
                if(ctx.rol !== "ADMINISTRADOR" && ctx.status === "INACTIVO"){
                    throw new Error('No cuentas con los permisos para esta acción');
                }
                const existeCategoria = Categoria.findById(id);
                if(!existeCategoria){
                    throw new Error("La categoria no existe");
                }
                try {
                    await Categoria.findByIdAndRemove(id);
                } catch (error) {
                    throw new Error(error);
                }
            },
            crearPlatillo: async (_, {input}, ctx) => {
                if(ctx.rol !== "ADMINISTRADOR" && ctx.status === "INACTIVO"){
                    throw new Error('No cuentas con los permisos para esta acción');
                }
                try {
                    const platillo = new Platillo(input);
                    platillo.save()
                    return platillo;
                } catch (error) {
                    throw new Error(error);
                }
            },
            actualizarPlatillo: async(_,{id,input},ctx) => {
                if(ctx.rol !== "ADMINISTRADOR" && ctx.status === "INACTIVO"){
                    throw new Error('No cuentas con los permisos para esta acción');
                }
                const existePlatillo = Platillo.findById(id);
                if(!existePlatillo){
                    throw new Error("El platillo no existe");
                }

                try {
                    const respuesta = await Platillo.findByIdAndUpdate({_id: id},input,{new: true});
                    return respuesta;
                } catch (error) {
                    throw new Error(error);
                }
            },
            eliminarPlatillo: async(_,{id},ctx) => {
                if(ctx.rol !== "ADMINISTRADOR" && ctx.status === "INACTIVO"){
                    throw new Error('No cuentas con los permisos para esta acción');
                }
                const existePlatillo = Platillo.findById(id);
                if(!existePlatillo){
                    throw new Error("El platillo no existe");
                }
                try {
                    await Platillo.findByIdAndDelete(id);
                    return "Platillo eliminado"
                } catch (error) {
                    throw new Error(error);
                }
            },
            crearMesa: async(_,{input},ctx) => {
                if(ctx.rol !== "ADMINISTRADOR" && ctx.status === "INACTIVO"){
                    throw new Error('No cuentas con los permisos para esta acción');
                }
                try {
                    const mesa = new Mesa(input);
                    mesa.save();
                    return(mesa);
                } catch (error) {
                    throw new Error(error);
                }
            },
            actualizarMesa: async(_,{id,input},ctx) => {
                if(ctx.rol !== "ADMINISTRADOR" && ctx.status === "INACTIVO"){
                    throw new Error('No cuentas con los permisos para esta acción');
                }
                const existeMesa = Mesa.findById(id);
                if(!existeMesa){
                    throw new Error("La mesa no existe");
                }

                try {
                    const respuesta =  await Mesa.findByIdAndUpdate({_id: id}, input, {new: true});
                    return respuesta;
                } catch (error) {
                    throw new Error(error);
                }
            },
            eliminarMesa: async(_,{id},ctx) => {
                if(ctx.rol !== "ADMINISTRADOR" && ctx.status === "INACTIVO"){
                    throw new Error('No cuentas con los permisos para esta acción');
                }
                const existeMesa = await Mesa.findById(id);
                if(!existeMesa){
                    throw new Error("La mesa no existe");
                }

                try {
                    await Mesa.findByIdAndDelete(id);
                    return "Mesa eliminada";
                } catch (error) {
                    throw new Error(error);
                }
            },
            crearPedido: async(_,{input}, ctx) => {
                if(ctx.rol !== "ADMINISTRADOR" && ctx.status === "INACTIVO"){
                    throw new Error('No cuentas con los permisos para esta acción');
                }
                try {
                    const pedido = new Pedido(input);
                    pedido.save();

                    return pedido;
                } catch (error) {
                    throw new Error(error);
                }
            },
            actualizarPedido: async (_,{id,input}, ctx) => {
                if(ctx.rol !== "ADMINISTRADOR" && ctx.status === "INACTIVO"){
                    throw new Error('No cuentas con los permisos para esta acción');
                }
                const existePedido = await Pedido.findById(id);
                if(!existePedido){
                    throw new Error("El pedido no existe");
                }
                try {
                    if(input.estado === "COMPLETADO"){
                        input.fechaFinal = Date.now();
                        console.log(input);
                        console.log(id);
                    }
                    const respuesta = await Pedido.findByIdAndUpdate({_id: id}, input, {new: true});
                    return respuesta;
                } catch (error) {
                    throw new Error(error);
                }
            },
            eliminarPedido: async (_,{id},ctx) => {
                if(ctx.rol !== "ADMINISTRADOR" && ctx.status === "INACTIVO"){
                    throw new Error('No cuentas con los permisos para esta acción');
                }
                const existePedido = await Pedido.findById(id);
                if(!existePedido){
                    throw new Error("El pedido no existe");
                }
                try {
                    await Pedido.findByIdAndDelete(id);
                    return "Pedido eliminado";
                } catch (error) {
                    throw new Error(error);
                }
            },
            EscribirGenerales: async (_,{input}, ctx) => {
                try {
                    const generales = new Generales(input);
                    generales.save();
                    return generales;
                } catch (error) {
                    throw new Error(error);
                }
            }
        }
}
module.exports = resolvers;