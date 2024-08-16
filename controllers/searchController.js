const query = require('../models/dbModel');

exports.searchUsers = async (req, res) => {
    const searchTerm = `%${req.query.q}%`;

    try {
        const users = await query('SELECT id, username, email, profile_picture FROM Users WHERE username LIKE ?', [searchTerm]);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.searchPosts = async (req, res) => {
    const searchTerm = `%${req.query.q}%`;

    try {
        const posts = await query('SELECT * FROM Posts WHERE content LIKE ?', [searchTerm]);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
