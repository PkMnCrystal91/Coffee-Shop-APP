const { response } = require('express');
// Obtenemos el ObjectId para validarlo con el de nuestra base de datos
const { ObjectId } = require('mongoose').Types;
const {Usuario, Producto, Categoria} = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles'
];

const buscarUsuarios = async( termino = '', res = require ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE

    if ( esMongoID ) {
        const usuario = await Usuario.findById(termino);
        res.json({
            result: ( usuario ) ? [usuario] : []
        });
    }

    const regex = new RegExp( termino, 'i'); //Expresion regunlar para que la busqueda no sea case sensitive

    const usuario = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuario
    });
}

const buscar = ( req, res = response ) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion )) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;
        case 'categoria':

        break;
        case 'productos':

        break;
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta busqueda'
            })
    }
}

module.exports = {
    buscar
}