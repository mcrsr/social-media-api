const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const query = require('../models/dbModel');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    if(!username || !password || !email){
        return res.status(400).json({"error":"username,password and email are required!"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await query('INSERT INTO Users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if(!password || !email){
        return res.status(400).json({"error":"email and password are required!"});
    }
    try {
        const user = await query('SELECT * FROM Users WHERE email = ?', [email]);

        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user[0].password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
