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


    type Platillo {
        id: ID
        nombre: String
        precio: Float
        disponible: Boolean
        descripcion: String
        categoria: Categoria
    }

    type Mesa{
        id: ID
        nombre: String
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

    input ActualizarUsuarioInput {
        nombre: String!
        apellidos: String!
        email: String!
        password: String!
        lastPassword: String!
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

    input PlatilloInput {
        nombre: String!
        precio: Float!
        disponible: Boolean!
        descripcion: String!
        categoria: ID!
    }

    input MesaInput {
        nombre: String!
    }

    type Query {
        #Usuarios
        obtenerUsuarios: [Usuario]
        obtenerUsuario(id: ID!): Usuario
        #Categorias
        obtenerCategorias: [Categoria]
        obtenerCategoria(id: ID): Categoria
        obtenerGenerales: [General]
        #platillos
        obtenerPlatillos: [Platillo]
        obtenerPlatillo(id: ID!): Platillo
        
    }
    type Mutation {
        #Usuarios
        crearNuevoUsuario(input: UsuarioInput!): Usuario
        autenticarUsuario(input: AuthInput!): Token
        actualizarUsuario(id: ID!, input: ActualizarUsuarioInput): Usuario
        eliminarUsuario(id: ID!): String
        #categorias
        crearNuevaCategoria(input: CategoriaInput!): Categoria
        actualizarCategoria(id: ID!, input: CategoriaInput): Categoria
        eliminarCategoria(id:ID!): String
        #platillos
        crearPlatillo(input: PlatilloInput!): Platillo
        actualizarPlatillo(id: ID!, input: PlatilloInput): Platillo
        eliminarPlatillo(id:ID!):String
        #mesa
        EscribirGenerales(input: GeneralInput!): General
    }
`;

module.exports = typeDefs;