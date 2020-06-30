const router = require('express').Router();
const providerController = require('../controllers/provider.controller');
const { auth }  = require('../utils/middleware');


router.route('/').get(auth, providerController.list);
//router.route('/').post(providerController.create);
router.route('/').put(auth,providerController.update);
router.route('/get').get(auth,providerController.show);
router.route('/').delete(auth,providerController.destroy);

router.route('/signin').post(providerController.signin);
router.route('/signup').post(providerController.create);

module.exports = router;