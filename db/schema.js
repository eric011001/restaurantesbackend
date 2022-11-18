const {gql} = require('apollo-server');

const typeDefs = gql`

    enum Rol {
        USUARIO
        ADMINISTRADOR
        SUPERADMINISTRADOR
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
        restaurante: ID
    }

    type Fecha {
        year: Int
        month: Int 
        day: Int
        hour: Int
    }

    type IngresosyPedidos {
        fecha: Fecha
        ingresos: Float
        noPedidos: Int
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
        fecha: String
        fechaFinal: String
    }

    type PedidoPlatillo {
        nombre: String
        cantidad: Int 
        precio: Float
        extras: [String]
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
        restaurante: ID
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
        extras: [String]
    }

    type CategoriaRestaurante {
        nombre: String
        id: ID
    }

    type Horario {
        dia: String
        apertura: String
        cierre: String
    }

    type Restaurante {
        id: ID
        nombre: String
        direccion: String
        Ciudad: String
        Estado: String
        latitud: Float
        longitud: Float
        telefono: String
        horario: [Horario]
        correoResponsable: String
        categoria: CategoriaRestaurante
        subcategorias: [Categoria]
        facebook: String
        instagram: String
    }

    input CategoriaRestauranteInput {
        nombre: String!
    }

    input HorarioInput {
        dia: String!
        apertura: String!
        cierre: String!
    }

    input RestauranteInput {
        nombre: String!
        direccion: String!
        Ciudad: String!
        Estado: String!
        latitud: Float!
        longitud: Float!
        telefono: String!
        horario: [HorarioInput!]
        correoResponsable: String
        categoria: ID
        subCategorias: [CategoriaInput]
        facebook: String
        instagram: String
    }

    input CoordenadasInput {
        latitud1: Float
        longitud1: Float
        latitud2: Float
        longitud2: Float
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
        obtenerPlatillosDisponiblesCategoria(categoria: ID!): [Platillo]
        obtenerPlatillosDisponibles: [Platillo]
        obtenerPlatillo(id: ID!): Platillo
        #pedidos
        obtenerPedidos: [Pedido]
        obtenerPedidosActivos: [Pedido]
        obtenerPedido(id: ID!): Pedido
        
        #estadisticas
        obtenerIngresosyPedidos: [IngresosyPedidos]
        #restaurantes
        obtenerRestaurantes(input: CoordenadasInput): [Restaurante]
        obtenerRestaurante(id: ID!): Restaurante
    }
    type Mutation {
        #Restaurantes
        crearNuevoRestaurante(input: RestauranteInput): Restaurante
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