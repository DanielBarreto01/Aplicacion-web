const router = require('express').Router();
const controllersMaterias = require('../controllers/materias');
const authenticateToken = require('../controllers/auth');


router.get('/',controllersMaterias.getMaterias)
      .post('/:agregar',controllersMaterias.postAgrearMaterias)
      .patch('/:cambiar-estado',controllersMaterias.patchtcambiarEstado)
      .put('/:actualizar',controllersMaterias.putActualizar)
      ;
module.exports= router;