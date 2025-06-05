import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken' 


const registerUser = async (req, res) => {
    try {
        const {name , email , password} = req.body;
        
        if( !name || !email || !password) {
            return res.json({sucess:false, message : 'Missing Details'})
        }

        const salt = await bcrypt.genSalt(10)
        const hasedPassword = await bcrypt.hash(password, salt);

        const userData= {
            name , email , password : hasedPassword
        }
        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
        res.json({sucess : true , token , user : {name: user.name}})
    }catch(e) {
        console.log(e);
        res.json({sucess:false , message : e.message})
    }
}

const loginUser = async (req,res)=>{
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({email})

        if(!user) {
            return res.json({sucess:false , message : 'User does not exist'})
        }

        const isMatch = await bcrypt.compare(password , user.password)

        if(isMatch) {
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
            res.json({sucess : true , token , user : {name: user.name}})
   
        }else {
           return  res.json({sucess:false , message : 'Invalid credenetials'});
        }
    }catch(e){
        console.log(e);
        res.json({sucess:false , message : e.message})
    }
}

const userCredits = async (req, res) => {
    // console.log(req.user.id);
    try{
        const userId= req.user.id
        const user = await userModel.findById(userId)
        res.json({sucess: true , credits : user.creditBalance , user : {name : user.name}})
    }catch(e) {
        console.log(e);
        res.json({sucess:false , message : e.message})
    }
}

export {registerUser , loginUser , userCredits};