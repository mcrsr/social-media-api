const query = require('../models/dbModel');

exports.isPostOwner = async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.user.id;

    try {
        const post = await query('SELECT * FROM Posts WHERE id = ?', [postId]);

        if (post.length === 0) return res.status(404).json({ message: 'Post not found' });
        if (post[0].user_id !== userId) return res.status(403).json({ message: 'You are not authorized to modify this post' });

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.isCommetOwner = async (req, res, next) => {
    const commentId = req.params.commentId;
    const userId = req.user.id;

    try {
        const comment = await query('SELECT * FROM Comments WHERE id = ?', [commentId]);

        if (comment.length === 0) return res.status(404).json({ message: 'Comment not found' });
        if (comment[0].user_id !== userId) return res.status(403).json({ message: 'You are not authorized to delete this comment' });

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
