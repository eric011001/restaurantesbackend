const {gql} = require('apollo-server');

const typeDefs = gql`

    enum Rol {
        USUARIO
        ADMINISTRADOR
    }

    enum Status {
        ACTIVO
        INACTIVO
    }

    type Token {
        token: String
    }

    type General{
        id: ID
        nombre: String
        direccion: String
        telefono: String
        facebook: String
        instagram: String
        whatsapp: String
    }

    type Usuario {
        id: ID
        nombre: String
        apellidos: String
        email: String
        rol: Rol
        status: Status
    }

    type Categoria {
        id: ID
        nombre: String
        orden: Int
    }


    input GeneralInput{
        nombre: String!
        direccion: String!
        telefono: String!
        facebook: String
        instagram: String
        whatsapp: String
    }

    input UsuarioInput {
        nombre: String!
        apellidos: String!
        email: String!
        password: String!
        rol: Rol!
        status: Status!
    }

    input AuthInput {
        email: String!
        password: String!
    }

    input CategoriaInput {
        nombre: String!
        orden: Int!
    }

    type Query {
        #Usuarios
        obtenerUsuarios: [Usuario]
        obtenerUsuario(id: ID!): Usuario
        #Categorias
        obtenerCategorias: [Categoria]
        obtenerCategoria(id: ID): Categoria
        obtenerGenerales: [General]
        
    }
    type Mutation {
        #Usuarios
        crearNuevoUsuario(input: UsuarioInput!): Usuario
        autenticarUsuario(input: AuthInput!): Token

        #categorias
        crearNuevaCategoria(input: CategoriaInput!): Categoria

        EscribirGenerales(input: GeneralInput!): General
    }
`;

module.exports = typeDefs;