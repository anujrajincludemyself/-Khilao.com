const jwt=require("jsonwebtoken")
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs")

const verifyToken=async(req,res,next)=>{
    try {
        let token=req.headers["authorization"]

        if(!token){
            return res.status(401).json({error:"No token provided. Please login."})
        }

        // Extract token from "Bearer <token>" format
        token=token.split(" ")[1]
        
        if(!token){
            return res.status(401).json({error:"Invalid token format"})
        }

        jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
            if(err){
                console.error('Token verification error:', err)
                return res.status(401).json({error:"Invalid or expired token"})
            }
            else{
                console.log('Token verified for user:', decoded)
                req.user=decoded
                next() // Call next() inside the callback after successful verification
            }
        })
    } catch (error) {
        console.error('Auth middleware error:', error)
        return res.status(500).json({error: 'Authentication failed'})
    }
}
module.exports=verifyToken