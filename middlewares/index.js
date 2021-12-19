// Simplemente acortamos el codigo. Refactoramos
const validaCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');

// ...validarCampos para extraer todos los componentes necesarios de la funcion
module.exports = {
    ...validaCampos,
    ...validarJWT,
    ...validaRoles,
}