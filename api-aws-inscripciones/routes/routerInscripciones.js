const router = require('express').Router();
const controllersInscripxiones = require('../controllers/inscripciones');
const authenticateToken = require('../controllers/auth');

router.get('/',controllersInscripxiones.getInscripciones)
      .post('/:agregar',controllersInscripxiones.postAgrearInscripcion)
      .put('/:actualizar',controllersInscripxiones.putActualizarInscripcion)
      .patch(':/cambiar-fecha',controllersInscripxiones.patchtcambiarFecha)
;
module.exports = router; 