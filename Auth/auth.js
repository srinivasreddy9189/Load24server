const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {signupData} = require('../Dataschemes/GlobalSchema');
const jwt = require('jsonwebtoken')
//signup authentication

router.post('/signup',async(req,res)=>{
    try{
        const {email,mobile,password,confirmPassword,name} = req.body;
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        const findUser = await signupData.findOne({ $or: [{ email }, { mobile }]});
        if(!email || !mobile || !password || !name|| !confirmPassword){
            return res.status(400).json({message:'All Fields Are Required'})
        }
        if(!gmailRegex.test(email)){
            return res.status(400).json({message:'Invalid Gmail Address'})
        }

        if(password !== confirmPassword){
            return res.status(400).json({message:'Passwords Do Not Match'})
        }
        if(mobile.length<10 ||mobile.length>10 ){
            return res.status(400).json({message:'Invalid Mobile Number'})
        }
        if(!findUser){
            const hashedPassword = await bcrypt.hash(password,10) 
            const newData = new signupData({ email,name, mobile, password:hashedPassword});
            newData.save();
            return res.status(200).json({message:'Registered Successfully'})
        }else{
            return res.status(409).json({message:'Email Or Mobile Number Exists'})
        }


    }catch(error){
        return res.status(500).json({message:'Internal Server Error'})
    }
})

//login authentication

router.post('/login',async(req,res)=>{
    try{
        const {email,password,mobile} = req.body;
        const findUser = await signupData.findOne({ $or: [{ email }, { mobile }]});
        if(!mobile || !password){
            return res.status(400).json({message:'Enter Mobile Number and Password'})  
        }
        if(!findUser){
            return res.status(404).json({message:'User not found'}) 
        }
        const matchPassword = await bcrypt.compare(password,findUser.password);
        if(!matchPassword){
            return res.status(400).json({message:'Invalid Password'})
        }
        let payLoad = {
            id:findUser._id
        }
        const accessToken = jwt.sign(payLoad, process.env.JWT_SECRET_KEY,{expiresIn:'1d'})
        return res.status(200).json({accessToken,message:'Login Success'})
    }catch(error){
        return res.status(500).json({message:'Internal Server Error'})
    }
})

//forgot password

router.put('/forgotpassword',async(req,res)=>{
    try {
        const {mobile,password,confirmPassword} = req.body;
        const findUser = await signupData.findOne({mobile})
        if(!mobile || !password || !confirmPassword){
            return res.status(400).json({message:'All Fields Are Required'})  
        }
        if(!findUser){
            return res.status(404).json({message:'User Not Found With This Mobile Number!'})
        }
       
        if(password !== confirmPassword){
            return res.status(404).json({message:'Password Do Not Match'})
        }
        const hashedPassword = await bcrypt.hash(password,10) 
         await signupData.updateOne({mobile},{password:hashedPassword});
       
        return res.status(200).json({message:'New Password Set Successfully!'})
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:'Internal Server Error'})
    }
})


module.exports = router