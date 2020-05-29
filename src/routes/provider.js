const router = require('express').Router();
const providerController = require('../controllers/provider.controller');
const { auth }  = require('../utils/middleware');


router.route('/').get(auth, providerController.list);
//router.route('/').post(providerController.create);
router.route('/:userId').put(providerController.update);
router.route('/:userId').get(providerController.show);
router.route('/:userId').delete(providerController.destroy);

router.route('/signin').post(providerController.signin);
router.route('/signup').post(providerController.create);

module.exports = router;