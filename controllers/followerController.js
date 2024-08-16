const query = require('../models/dbModel');

exports.followUser = async (req, res) => {
    const followerId = req.user.id;
    const followedId = req.params.userId;

    try {
        const users = await query('SELECT * FROM Users WHERE id=?', [followedId]);
        if(users.length === 0) return res.status(404).json({"message":"User Not Found!"});
        try {
            await query('INSERT INTO Followers (follower_id, followed_id) VALUES (?, ?)', [followerId, followedId]);
            res.status(200).json({ message: 'User followed successfully!' });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: "Internal Server Error!" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

exports.unfollowUser = async (req, res) => {
    const followerId = req.user.id;
    const followedId = req.params.userId;

    try {
        const users = await query('SELECT * FROM Users WHERE id=?', [followedId]);
        if(users.length === 0) return res.status(404).json({"message":"User Not Found!"});
        try {
            const followers = await query('SELECT * FROM Followers WHERE follower_id=? AND followed_id=?', [followerId,followedId]);
            if(followers.length === 0) return res.status(404).json({"message":`You are not following user  ${followedId}`});
            try {
                await query('DELETE FROM Followers WHERE follower_id = ? AND followed_id = ?', [followerId, followedId]);
                res.status(200).json({ message: 'User unfollowed successfully!' });
            } catch (error) {
                console.log(error.message);
                res.status(500).json({ error: "Internal Server Error!" });
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ error: "Internal Server Error!" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};
