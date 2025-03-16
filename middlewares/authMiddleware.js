const  jwt = require('jsonwebtoken');


const authMiddleware = async (req, res, next) => {
    try{
        const { token } = req.cookies;
        // console.log(token)
        if(!token){
            return res.status(401).json({
                success: false,
                message: "User Unauthorized!"
            })
        }

        const isTokenValid = await jwt.verify(token, process.env.JWT_KEY);
        req.userId = isTokenValid.id;
        next();
    }catch(err){
        next(err)
    }
}


module.exports = authMiddleware;
