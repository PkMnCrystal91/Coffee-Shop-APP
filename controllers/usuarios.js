const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {

    // const { limite = 5 } casteamos para que en caso no se mande un limite por defecto paginara solamente 5
    const { limite = 5, desde = 0 } = req.query;
    // Constante para mostrar los usarios que su estado es true "activo"
    const query = { estado: true };
/*     const usuarios = await Usuario.find()
        .skip( Number ( desde ) ) // desque numero del incide queremos iniciar paginacion
        // HAcemos el limite de paginacion por peticiones
        .limit( Number ( limite ) ); // Number hacemos que el query se convierta en numero y deje de ser string */

    const [ total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip( Number ( desde ) ) // desque numero del incide queremos iniciar paginacion
        // HAcemos el limite de paginacion por peticiones
        .limit( Number ( limite ) ) // Number hacemos que el query se convierta en numero y deje de ser string
    ]);

    res.status(200).json({
        total,
        usuarios

    });
}

const usuariosPut = async(req, res = response) => {

    /* la constante desestructurada debe ser igual al 
    asignado en la ruta router.put('/:id', usuariosPut ); */
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO validar el password contra la base de datos
    if ( password ){
        //Encriptar
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt);

    }

    // Encontrar objeto por id y tambien los actualiza
    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.status(404).json({
        usuario
    });
}

const usuariosPost = async(req, res = response) => {

    // Reciviendo la request enviada a nuestro backend
    // Tambien hacemos una destructuracion de datos para tener control de la informacion que deseamos obtener
    // const { nombre, edad} = req.body;

    const { nombre, correo, password, rol } = req.body;
    const usuario = Usuario( { nombre, correo, password, rol } );

    // Verificar si el correo existe
    // const existeEmail = await Usuario.findOne({ correo });
    // if( existeEmail ){
    //     return res.status(400).json({
    //         msg: 'Ese correo ya está registrado'
    //     });
    // }

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(); // genSaltSync(10) es el numero de vueltas que queremos darle a nuestra contraseña para que pueda ser descifrada. Por defeto vienen 10
    usuario.password = bcryptjs.hashSync( password, salt); // hashSync es para encriptarlo en una sola via

    // Guardar en BD
    await usuario.save();

    res.status(201).json({
        usuario
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    // const usuario = await Usuario.findByIdAndDelete( id ); Metodo para eliminar fiscicamente el usuario/registro de la base de datos

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false } ); // metodo solo para dejar de mostrar el registro, pero aun existe en la bd

    res.json(usuario);
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}