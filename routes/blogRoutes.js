const express = require('express');
const blogController = require('../controllers/blogController');

const {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
} = require('../controllers/blogController');

const router = express.Router();
router.get('/', blogController.getBlogs);

router.post('/', createBlog);
router.get('/:id', getBlogById);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;
