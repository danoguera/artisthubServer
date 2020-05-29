const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { auth }  = require('../utils/middleware');


router.route('/').get(auth, userController.list);
//router.route('/').post(userController.create);
router.route('/:userId').put(userController.update);
router.route('/:userId').get(userController.show);
router.route('/:userId').delete(userController.destroy);

router.route('/signin').post(userController.signin);
router.route('/signup').post(userController.create);

module.exports = router;