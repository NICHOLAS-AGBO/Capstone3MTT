const User = require('../models/user');

const auth = async (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).send({ error: 'Please authenticate.' });
    }

    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = auth;

