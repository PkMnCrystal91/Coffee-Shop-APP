const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        //customizando nuestra ruta de llama al endpoint de nuestra API 
        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios',
        }      

        // Conectar a base de datos
        this.conectarDB();
        
        //Middlewares
        this.middlewares();

        this.routes();
    }

    async conectarDB() {
        await dbConnection()
    }

    middlewares(){

        // CORS
        this.app.use( cors() );

        // Parseo y lectura del body. PAra serializar la informacion enviada al backend desde un metodo http
        this.app.use( express.json() );

        // Directorio publico 
        this.app.use( express.static('public') );
    }

    routes() {
        
        // Ruta que nos sirve para invicar los metodo http dentro de user.js
        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.buscar, require('../routes/buscar'));
        this.app.use( this.paths.categorias, require('../routes/categorias'));
        this.app.use( this.paths.productos, require('../routes/productos'));
        this.app.use( this.paths.usuarios, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }
}

module.exports = Server;