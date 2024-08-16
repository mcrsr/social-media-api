const query = require('../models/dbModel');

exports.createPost = async (req, res) => {
    const { content, media_url } = req.body;
    if(!content) return res.status(400).json({"message":"content required"});
    const userId = req.user.id;

    try {
        await query('INSERT INTO Posts (user_id, content, media_url) VALUES (?, ?, ?)', [userId, content, media_url]);
        res.status(201).json({ message: 'Post created successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getPosts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const posts = await query('SELECT * FROM Posts ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset]);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await query('SELECT * FROM Posts WHERE id = ?', [req.params.postId]);
        if(post.length === 0) return res.status(404).json({"message":"Post not found!"});
        res.status(200).json(post[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    const { content, media_url } = req.body;
    try {
        await query('UPDATE Posts SET content = ?, media_url = ? WHERE id = ?', [content, media_url, req.params.postId]);
        res.status(200).json({ message: 'Post updated successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        await query('DELETE FROM Posts WHERE id = ?', [req.params.postId]);
        return res.status(204);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
