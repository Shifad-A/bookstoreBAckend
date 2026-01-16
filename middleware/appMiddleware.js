const appMiddleware=(req,res,next)=>{
    console.log("inside app middleware")
    next()
}
module.exports =appMiddleware