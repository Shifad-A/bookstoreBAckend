const jwt =require('jsonwebtoken')

const jwtMiddleware=(req,res,next)=>{
    console.log("inside jwt middleware")
    console.log(req.headers);
    try {
        const token= req.headers.authorization.slice(7)
        const jwtVerification =jwt.verify(token,process.env.jwtkey)
        console.log(jwtVerification);
        req.payload=jwtVerification.usermail
        
    } catch (err) {
         res.status(402).json("Authorization Error"+err)
    }
    next()
}
module.exports =jwtMiddleware