const router = require('express').Router();
const postController = require('../controllers/post.controller');

router.route('/').get(postController.list);
router.route('/').post(postController.create);
router.route('/:postId').put(postController.update);
router.route('/:postId').get(postController.show);
router.route('/:postId').delete(postController.destroy);

router.route('/subcategory/:subcategoryName').get(postController.showAll);

module.exports = router;