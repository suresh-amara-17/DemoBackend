const express = require('express');
const ctrl = require('../controllers/purchaseController');
const { verifyToken, checkRole } = require('../middlewares/auth');

const router = express.Router();
router.use(verifyToken);

router.post('/', checkRole('manager','admin'), ctrl.create);
router.get('/', checkRole('user','admin','manager'), ctrl.list);
router.get('/:id', checkRole('manager','admin'), ctrl.get);
router.put('/:id', checkRole('manager','admin'), ctrl.update);
router.delete('/:id', checkRole('manager','admin'), ctrl.remove);

module.exports = router;