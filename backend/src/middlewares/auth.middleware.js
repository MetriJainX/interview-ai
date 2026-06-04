/* profile view krte wqt ya fir logot krte wqt we need to verify ki requesting user authenticated bhi h ya nhi to uska to
uska token verify krte h using jwt.verify */


const jwt=require("jsonwebtoken")
// now chck whetthe rtoken blaclklist to nhi h ,if blacklist huaa then it hsldn,t be aloowed to use
const tokenBlacklistModel=require("../models/blacklist.model")


async function authUser(req,res,next){
    const token=req.cookies.token
    if(!token){
        return res.status(401).json({
            message:"No token provided."})
    }
    const isTokenBlacklisted=await tokenBlacklistModel.findOne({token})
    if(isTokenBlacklisted){
        return res.status(401).json({message:"Token is invalid"})
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decoded;    
        // yaha se jo data milega req.user k andr vo getme controller me pass hojata h
        next();
    }catch(err){
        return res.status(400).json({message:"Invalid token."});
    }
}
module.exports={authUser};