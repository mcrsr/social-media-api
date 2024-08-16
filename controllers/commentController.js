const query = require('../models/dbModel');

exports.addComment = async (req, res) => {
    const { content } = req.body;
    const userId = req.user.id;
    const postId = req.params.postId;

    try {
        await query('INSERT INTO Comments (user_id, post_id, content) VALUES (?, ?, ?)', [userId, postId, content]);
        res.status(201).json({ message: 'Comment added successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const comments = await query('SELECT * FROM Comments WHERE post_id = ?', [req.params.postId]);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comments = await query('SELECT * FROM Comments WHERE id = ?', [req.params.commentId]);
        if(comments.length === 0) return res.status(404).json({"message":"Comment not found!"});
        try {   
            await query('DELETE FROM Comments WHERE id = ?', [req.params.commentId]);
            res.status(200).json({ message: 'Comment deleted successfully!' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }   
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
