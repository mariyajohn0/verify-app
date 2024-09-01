const jwt = require('jsonwebtoken')
// Token Verification

const jwtMiddleware = (req,res,next) => {
    console.log('Inside jwt Middleware');
    try{
            //get token
    const token = req.headers['authorization'].slice(7)
    console.log(token)

    //verify the token
    const jwtVerification = jwt.verify(token,"superkey")
    console.log(jwtVerification); //payload - userId
    req.payload = jwtVerification.userId
    next()
    }
    catch(err){
        res.status(401).json({"Authorization error":err.message})
    }

        console.log('exiting');
}

module.exports = jwtMiddleware