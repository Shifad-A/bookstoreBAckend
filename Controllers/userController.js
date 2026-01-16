const User=require('../Models/userModel')
const jwt =require('jsonwebtoken')

//logic for register

exports.userRegister=async (req,res)=>{
    const {username,email,password}=req.body
    const existingUser =await User.findOne({email})

    try {
        if (existingUser){
        res.status(401).json("User already exist")
    }else{
        const newUser =new User({username,email,password})
        await newUser.save()
        res.status(200).json({message:"User Added successfully",newUser})
    }
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.userLogin=async(req,res)=>{
    console.log("lnside login function");
    console.log(req.body);
    const {email,password} =req.body
    
    try {
        const existingUser=await User.findOne({email})
        if(existingUser){
            if(password==existingUser.password){
                //tocken genaration
                const token=jwt.sign({usermail:existingUser.email,role:existingUser.role},process.env.jwtkey)
                console.log(token);
                
                res.status(200).json({message:"Login Successfull",existingUser,token})
            }else{
                res.status(401).json("incorrect password")
            }
        }else{
            res.status(400).json("User not exist")
        }
        
    } catch (error) {
        res.staus(500).json(error)
    }
}

exports.googleLogin=async(req,res)=>{
    console.log("inside google login");
    
    const {username,email,password,profile} =req.body

    try {
        const existingUser=await User.findOne({email})
        if(existingUser){
            //tocken genaration
                const token=jwt.sign({usermail:existingUser.email,role:existingUser.role},process.env.jwtkey)
                console.log(token);
                res.status(200).json({message:"Login Successfull",existingUser,token})
        }else{
            const newUser =new User({username,email,password,profile})
            await newUser.save()
            // token genaration
            const token=jwt.sign({usermail:newUser.email,role:newUser.role},process.env.jwtkey)
             console.log(token);
             res.status(200).json({message:"User Added successfully",newUser,token})
        }
    } catch (error) {
        console.log("error",error);
        
    }
}

exports.getUser=async(req,res)=>{
    try {
        const allUsers=await User.find({role:{$ne:'admin'}})
        res.status(200).json(allUsers)
        
    } catch (error) {
        res.status(500).json("error",error)
    }
}
exports.updateAdmin=async(req,res)=>{
    // get body 
    const {username,password,bio,profile}=req.body
    // get email from payload
    const email=req.payload
    // get role
    const role=req.role
    //update profile photo :req.files
    const uploadedProfile = req.file? req.file.filename:profile
    try {
        const updateAdmin= await User.findOneAndUpdate({email},{username,email,password,profile:uploadedProfile,bio,role},{new:true})
        await updateAdmin.save()
        res.status(200).json({message:"updated successfully",updateAdmin})
         
    } catch (err) {
        res.status(500).json("error"+err)
    }
}

exports.getAdmin=async(req,res)=>{
    try {
        const admin=await User.findOne({role:{$eq:'admin'}})
        res.status(200).json(admin)
    } catch (error) {
        res.status(500).json(error)
        
    }
}
exports.getActiveUser=async(req,res)=>{
    const email=req.payload
    console.log(email);
    
    try {
        const activeUser= await User.findOne({email})
        res.status(200).json(activeUser)
        
    } catch (error) {
        res.status(500).json("error",error)
    }
    
}
exports.updateUser=async(req,res)=>{
    const {username,password,bio,profile}=req.body
    // get email from payload
    const email=req.payload
    // get role
    const role=req.role
    //update profile photo :req.files
    const uploadedProfile = req.file? req.file.filename:profile
    try {
        const updateUser= await User.findOneAndUpdate({email},{username,email,password,profile:uploadedProfile,bio,role},{new:true})
        await updateUser.save()
        res.status(200).json({message:"updated successfully",updateUser})
         
    } catch (err) {
        res.status(500).json("error"+err)
    }
}

