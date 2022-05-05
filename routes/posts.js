
const express = require('express');
const router = express.Router();

const posts = require('../controllers/posts');
const Post = require('../models/post');




router.get('/', posts.index);


router.get('/:post_id', posts.getPost);


router.post('/new', posts.insertPost);


router.post('/delete/:post_id', posts.deletePost);

module.exports = router;