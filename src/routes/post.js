const router = require('express').Router();
const postController = require('../controllers/post.controller');
const {auth, verify, savePhoto} = require('../utils/middleware');
const { formData } = require('../utils/cloud');

router.route('/').get(auth, postController.list);
router.route('/').post(auth, formData, postController.create); //Se añade middleware que manejo de archivos
router.route('/:postId').put(verify, formData, postController.update);  //Actualizar un post
router.route('/:postId').get(postController.show);
router.route('/:postId').delete(verify, postController.destroy);



router.route('/subcategory/:subcategoryName').get(auth, postController.showAll);
router.route('/category/:categoryName').get(auth, postController.showAllCategory);

router.route('/:categoryName/:subcategoryName').get(auth, postController.filterByCategory); //Esta sirve para filtrar por categoria y subcategoria



module.exports = router;