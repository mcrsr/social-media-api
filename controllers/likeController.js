const query = require('../models/dbModel');

exports.likePost = async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.postId;

    try {
        await query('INSERT INTO Likes (user_id, post_id) VALUES (?, ?)', [userId, postId]);
        res.status(200).json({ message: 'Post liked successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.unlikePost = async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.postId;

    try {
        const likes = await query('SELECT * FROM Likes WHERE post_id = ?', [postId]);
        if(likes.length === 0) return res.status(404).json({"message":`There is no post ${postId} or like associated to post ${postId}`});
        const logedInUserLikes = await query('SELECT * FROM Likes WHERE user_id = ? AND post_id = ?', [userId,postId]);
        if(logedInUserLikes.length === 0) return res.status(403).json({"message":"You are not authorized to unlike this post."});
        try {
            const likes = await query('DELETE FROM Likes WHERE user_id = ? AND post_id = ?', [userId, postId]);
            return res.status(200).json({ message: 'Post unliked successfully!' });
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ error: "Internal Server error!" });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Internal Server error!" });
    }
};
