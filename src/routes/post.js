const router = require('express').Router();
const postController = require('../controllers/post.controller');
const {auth, verify, savePhoto} = require('../utils/middleware');


router.route('/').get(auth, postController.list);
router.route('/').post(auth, savePhoto, postController.create); //Se añade middleware que manejo de archivos
router.route('/:postId').put(verify, savePhoto, postController.update);  //Actualizar un post
router.route('/:postId').get(postController.show);
router.route('/:postId').delete(verify, postController.destroy);



router.route('/subcategory/:subcategoryName').get(auth, postController.showAll);




module.exports = router;