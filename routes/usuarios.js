const { Router } = require('express');
const {check } = require('express-validator');

// aqui requerimos el index.js en la carpeta middleware
const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');

const { esRoleValido, emailExiste, existeUsuarioPorID } = require('../helpers/db-validators');

const { usuariosGet,
        usuariosPost,
        usuariosPut,
        usuariosDelete
} = require('../controllers/usuarios');




// Llamando funcion
const router = Router();

router.get('/', usuariosGet);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorID),
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPut );

// Para definir un middelware simplemrnte sera el segundo argunmento del metodo
//router.post('/', [middelware] , usuariosPost);   
router.post('/', [
    // Check es un middelware para especificar el campo que queremos validar
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser mas de 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').custom( emailExiste ).isEmail(),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( esRoleValido ),
    validarCampos
] , usuariosPost);

router.delete('/:id', [
    validarJWT,

    // Aqui usamos el tieneRole middleware que puede especificar cuales role son permitidos en este endpoint
    tieneRole('ADMIN_ROLE', 'VENTAR_ROLE','OTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorID),
    validarCampos
], usuariosDelete);

module.exports = router;