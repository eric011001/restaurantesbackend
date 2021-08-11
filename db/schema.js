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

    enum EstadoPlatillo {
        PENDIENTE
        ENPREPARACION
        ENVIADO
        COMPLETADO
    }

    type Token {
        token: String
    }

    type ExtraPlatillo {
        nombre: String
        precio: Float
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
        extras: [ExtraPlatillo]
    }

    type Mesa{
        id: ID
        nombre: String
    }

    type Pedido {
        id: ID
        pedido: [PedidoPlatillo]
        total: Float
        estado: EstadoPlatillo
        comentario: String
        mesa: String
    }

    type PedidoPlatillo {
        nombre: String
        cantidad: Int 
        precio: Float
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
        rol: Rol!
        status: Status!
    }

    input cambioClaveInput {
        lastPassword: String!
        newPassword: String!
        confirmNewPassword: String!
    }

    input AuthInput {
        email: String!
        password: String!
    }

    input CategoriaInput {
        nombre: String!
        orden: Int
    }

    input ExtraPlatilloInput {
        nombre: String!
        precio: Float!
    }

    input PlatilloInput {
        nombre: String!
        precio: Float!
        disponible: Boolean!
        descripcion: String!
        categoria: ID!
        extras: [ExtraPlatilloInput]
    }

    input MesaInput {
        nombre: String!
    }

    input PedidoInput {
        pedido: [PedidoPlatilloInput!]
        total: Float!
        estado: EstadoPlatillo!
        comentario: String
        mesa: String!
    }

    input PedidoPlatilloInput {
        nombre: String!
        cantidad: Int!
        precio: Float!
    }

    type Query {
        #Usuarios
        obtenerUsuarios: [Usuario]
        obtenerUsuario(id: ID!): Usuario
        obtenerMiUsuario: Usuario
        #mesas
        obtenerMesas: [Mesa]
        obtenerMesa(id: ID): Mesa
        #Categorias
        obtenerCategorias: [Categoria]
        obtenerCategoria(id: ID): Categoria
        obtenerGenerales: [General]
        #platillos
        obtenerPlatillos: [Platillo]
        obtenerPlatillo(id: ID!): Platillo
        #pedidos
        obtenerPedidos: [Pedido]
        obtenerPedido(id: ID!): Pedido
        
    }
    type Mutation {
        #Usuarios
        crearNuevoUsuario(input: UsuarioInput!): Usuario
        autenticarUsuario(input: AuthInput!): Token
        actualizarUsuario(id: ID!, input: ActualizarUsuarioInput): Usuario
        cambiarClaveUsuario(id: ID!, input: cambioClaveInput): Usuario
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
        crearMesa(input: MesaInput): Mesa
        actualizarMesa(id: ID!,input: MesaInput!): Mesa
        eliminarMesa(id:ID!): String
        #pedido
        crearPedido(input: PedidoInput): Pedido
        actualizarPedido(id: ID!, input: PedidoInput): Pedido
        eliminarPedido(id: ID!): String

        EscribirGenerales(input: GeneralInput!): General
    }
`;

module.exports = typeDefs;