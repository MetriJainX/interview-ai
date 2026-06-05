const userModel=require("../models/user.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const tokenBlacklistModel=require("../models/blacklist.model")


// func to register user
async function registerUserController(req,res){
    const{username,email,password}=req.body
    if(!username || !email || !password){
        return res.status(400).json({message:"all fields are required"})
    }
    const userAlreadyExists=await userModel.findOne({
        $or:[{username:username},{email:email}]
    })
    if(userAlreadyExists){
        return res.status(400).json({
            message:"account already exists with this username or email address"})
    }


    const hash=await bcrypt.hash(password,10)
    const user=await  userModel.create({
        username,
        email,
        password:hash
    })
    
    const token=jwt.sign({
        id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"})

// token created above with the help of id and username is set here
       res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
});

        res.status(201).json({
            message:"user registered successfully",
            user:{
                id:user._id,username:user.username,
                email:user.email,
            }
            })
        }

        /**
         * @name loginUserController
         * @desc login a user,expects email,password in the req body
         * @access Public
         */
// func to login user
async function loginUserController(req,res){
    // fetchng user email nd password from req.body(user ne jo login req bheji waha se nikalna data)
    const {email,password}=req.body
    // finding in the user model if such user exists
    const user=await userModel.findOne({email})
    // user na mile to error
    if(!user){                               
        return res.status(400).json({
            message:"invalid credentials"})
    }
// user agr mil gya now validate the password comapring (string:password)with password jo database me hash hoke stored h to compare krna padega bycrypt ki help se
    const isPasswordValid=await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        return res.status(400).json({
            message:"invalid credentials"
        })
    }
    // once user is validate ab usko jwt secret,id,username ke sth token me bheja
    const token=jwt.sign({
        id:user._id,username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"})
// cookie me set krke response me deatils bheji
        res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
});
        res.status(200).json({
            message:"user logged in successfully",
            user:{
                id:user._id,
                username:user.username,
                email:user.email
            }
        })
}

/**
 * @name logoutUserController
 * @desc logout a user by blacklisting the token
 * @access Public           
 */
async function logoutUserController(req,res){
    const token=req.cookies.token
    // Save the token to the blacklist
    await tokenBlacklistModel.create({ token })
    // Clear the token cookie
    res.clearCookie("token")
    res.status(200).json({
        message:"user logged out successfully"
    })
}


/**
 * @name getMeController
 * @desc get the details of the logged in user
 * @access Private  
 */
async function getMeController(req,res){
    const user=await userModel.findById(req.user.id)
    res.status(200).json({
        message:"user details fetched successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
    
}        

module.exports={
    registerUserController
    ,loginUserController,
    logoutUserController,getMeController
}