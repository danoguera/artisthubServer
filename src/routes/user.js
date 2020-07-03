const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { auth }  = require('../utils/middleware');


router.route('/').get(auth, userController.list);
//router.route('/').post(userController.create);
router.route('/').put(auth, userController.update);
router.route('/get').get(auth,userController.show);
router.route('/').delete(auth, userController.destroy);

router.route('/signin').post(userController.signin);
router.route('/signup').post(userController.create);
router.route('/recover').post(userController.recover);
router.route('/updatepassword').put(auth, userController.updatePassword);

module.exports = router;