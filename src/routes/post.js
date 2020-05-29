const router = require('express').Router();
const postController = require('../controllers/post.controller');
const {auth, verify} = require('../utils/middleware');

router.route('/').get(postController.list);
router.route('/').post(auth, postController.create); 
router.route('/:postId').put(verify, postController.update);  //Actualizar un post
router.route('/:postId').get(postController.show);
router.route('/:postId').delete(verify, postController.destroy);



router.route('/subcategory/:subcategoryName').get(auth, postController.showAll);




module.exports = router;