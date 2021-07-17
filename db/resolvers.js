const Generales = require('../models/Generales');
const Usuario = require('../models/Usuario');
const Categoria = require('../models/Categoria');

const {mongoose} = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
                
                const categorias = await Categoria.find({});
                return categorias;
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