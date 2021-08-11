const Generales = require('../models/Generales');
const Usuario = require('../models/Usuario');
const Categoria = require('../models/Categoria');
const Mesa = require('../models/Mesa');
const {mongoose} = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Platillo = require('../models/Platillo');
const Pedido = require('../models/Pedido');
require('dotenv').config({ path: 'variables.env'});

const crearTokenUsuario = (usuario, secreta, expiresIn) => {
    const {id, nombre, apellidos, email, status, rol} = usuario;
    return jwt.sign({id,nombre,apellidos,email,status,rol},secreta, { expiresIn } );

}

const resolvers = {
        Query: {
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
                const platillos = await Platillo.find({}).populate('categoria');
                return platillos;
            },
            obtenerPlatillosDisponibles: async (_,{},ctx) => {
                const platillos = await Platillo.find({disponible: true}).populate('categoria');
                return platillos;
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
            obtenerPedido: async (_,{},ctx) => {
                const existePedido = await Pedido.findById(id);
                if(!existePedido){
                    throw new Error("El platillo no existe");
                }
                return existePedido;
            }
        },
        Mutation: {
            crearNuevoUsuario: async (_,{input}, ctx) => {
                const {email, password} = input;
                try {
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