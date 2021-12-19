const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async( req = request, res = response, next ) => {
     
    // Key personalisado 'x-token' del token que va ser generado desde el header. Por lo general a este tambien se le ve como auth
    const token = req.header('x-token')

    // si no viene el token
    if ( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try{

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        // Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById( uid );

        // Si no existe usuario
        if ( !usuario ){
            return res.status(401).json({
                msg:'Token no válido - usuario no existe en la BD'
            });
        }

        // Verficar si el uid estado es true
        if ( !usuario.estado ){
            return res.status(401).json({
                msg:'Token no válido - usuario con estado: false'
            });
        }

        req.usuario = usuario;
        next();

    }catch (error){
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }

}

module.exports = {
    validarJWT
}