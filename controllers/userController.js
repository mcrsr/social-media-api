const bcrypt = require('bcryptjs');
const query = require('../models/dbModel');

exports.getUser = async (req, res) => {
    try {
        const user = await query('SELECT id, username, email, profile_picture, bio FROM Users WHERE id = ?', [req.params.id]);
        res.status(200).json(user[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await query('SELECT id, username, email, profile_picture, bio FROM Users', []);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const { username, profile_picture, bio, password } = req.body;
    let hashedPassword = null;

    if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
    }

    try {
        const updateQuery = 'UPDATE Users SET username = ?, profile_picture = ?, bio = ?' + 
                            (hashedPassword ? ', password = ? ' : ' ') + 
                            'WHERE id = ?';
        
        const values = hashedPassword ? [username, profile_picture, bio, hashedPassword, req.params.id] 
                                      : [username, profile_picture, bio, req.params.id];
        
        await query(updateQuery, values);
        res.status(200).json({ message: 'User updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};