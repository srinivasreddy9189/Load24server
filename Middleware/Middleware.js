const jwt = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
    try {
        const authH = req.headers['authorization'];
        if (!authH) {
            return res.status(401).json({ message: 'Authorization header is missing' });
        }
        const tokenParts = authH.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return res.status(401).json({ message: 'Invalid Authorization format' });
        }

        const jwtToken = tokenParts[1];
        jwt.verify(jwtToken, process.env.JWT_SECRET_KEY || 'default_secret', (error, payLoad) => {
            if (error) {
                return res.status(401).json({ message: 'JWT Verification Failed' });
            }
            req.id = payLoad.id;
            next();
        });

    } catch{
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = jwtAuth;
