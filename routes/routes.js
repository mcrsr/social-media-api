const express = require('express');
const { register, login } = require('../controllers/authController');
const { getUser, updateUser,getUsers } = require('../controllers/userController');
const { createPost, getPosts, getPostById, updatePost, deletePost } = require('../controllers/postController');
const { likePost, unlikePost } = require('../controllers/likeController');
const { addComment, getComments, deleteComment } = require('../controllers/commentController');
const { followUser, unfollowUser } = require('../controllers/followerController');
const { sendMessage, getMessages } = require('../controllers/messageController');
const { searchUsers, searchPosts } = require('../controllers/searchController');
const authenticateToken = require('../middleware/authMiddleware');
const {isPostOwner, isCommetOwner} = require('../middleware/authorizationMiddleware');
const errorHandler = require('../middleware/errorHandler');

const router = express.Router();

router.use(errorHandler);

// Auth Routes
router.post('/register', register);
router.post('/login', login);

// User Routes
router.get('/users', authenticateToken, getUsers);
router.get('/users/:id', authenticateToken, getUser);
router.put('/users/:id', authenticateToken, updateUser);

// Post Routes
router.post('/posts', authenticateToken, createPost);
router.get('/posts', authenticateToken, getPosts);
router.get('/posts/:postId', authenticateToken, getPostById);
router.put('/posts/:postId', authenticateToken, isPostOwner, updatePost);
router.delete('/posts/:postId', authenticateToken, isPostOwner, deletePost);

// Like Routes
router.post('/posts/:postId/like', authenticateToken, likePost);
router.delete('/posts/:postId/unlike', authenticateToken, unlikePost);

// Comment Routes
router.post('/posts/:postId/comments', authenticateToken, addComment);
router.get('/posts/:postId/comments', authenticateToken, getComments);
router.delete('/comments/:commentId', authenticateToken,isCommetOwner, deleteComment);

// Follower Routes
router.post('/users/:userId/follow', authenticateToken, followUser);
router.delete('/users/:userId/unfollow', authenticateToken, unfollowUser);

// Message Routes
router.post('/users/:receiverId/messages', authenticateToken, sendMessage);
router.get('/users/:userId/messages', authenticateToken, getMessages);

// Search Routes
router.get('/search/users', authenticateToken, searchUsers);
router.get('/search/posts', authenticateToken, searchPosts);

module.exports = router;
