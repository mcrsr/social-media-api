const query = require('../models/dbModel');

exports.sendMessage = async (req, res) => {
    const { content } = req.body;
    const senderId = req.user.id;
    const receiverId = req.params.receiverId;

    try {
        const user =  await query('SELECT * FROM Users WHERE id=?', [receiverId]);
        if(user.length === 0) return res.status(404).json({"message":"User Not Found!"});
        try {
            const followers = await query('SELECT * FROM Followers WHERE followed_id=? AND follower_id=?', [receiverId,senderId]);
            if(followers.length === 0) return res.status(403).json({"message":`You are not following  ${receiverId}`});
            try {
                await query('INSERT INTO Messages (sender_id, receiver_id, content) VALUES (?, ?, ?)', [senderId, receiverId, content]);
                res.status(201).json({ message: 'Message sent successfully!' });
            } catch (error) {
                console.log(error.message);
                return res.status(500).json({ error: "Internal Server Error!" });
            }
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ error: "Internal Server Error!" });
        }    
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
};

exports.getMessages = async (req, res) => {
    const userId = req.user.id;
    const otherUserId = req.params.userId;

    try {
        const messages = await query('SELECT * FROM Messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)', [userId, otherUserId, otherUserId, userId]);
        res.status(200).json(messages);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
};
