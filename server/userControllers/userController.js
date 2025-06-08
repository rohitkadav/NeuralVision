import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken' 
import razorpay from 'razorpay'
import transactionModel from "../models/transactionModel.js"

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
        console.log(email);

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

const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const paymentRazorpay = async (req , res) => {
    try {
        const {userId , planId} = req.body;
        const userData = await userModel.findById(userId);

        if(!userId || !planId) {
            return res.json({sucess : false , message : "Missing Details"});
        }

        let credits, plan , amount , date 

        switch(planId) {
            case 'Basic' :
                plan = 'Basic'
                credits = 100
                amount = 10
                break;
            case 'Advance' :
                plan = 'Advance'
                credits = 500
                amount = 50
                break;
            case 'Business' :
                plan = 'Business'
                credits = 5000
                amount = 250
                break;
            
            default :
                return res.json({sucess : false , message : "Select Valid Plan"});
        }
        

        date = Date.now;

        const transacitonData = {
            userId , plan , amount , credits , date
        }

        const newTransaction = await transactionModel.create(transacitonData);

        const options= {
            amount : amount, 
            currency : process.env.CURRENCY,
            receipt : newTransaction._id,
        }    

        await razorpayInstance.orders.create(Options ,(error , order)=>{
            if(error) {
                console.log (error);
                return res.json({sucess : false , message : error})
            }
            res.json({sucess: true , order})
        } )

    } catch (error) {
      console.log(error);
      res.json({sucess : false , message : error.message})  
    }
}

const verifiedRazorPay = async (req , res) => {
    try{

        const {razorpay_order_id} = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);


        if(orderInfo.status ==='paid') {
            const transacitonData = await transactionModel.findById(orderInfo.receipt);
             

            if(transacitonData.payment) {
                return res.json ({sucess: false , message : "payment Failed"});
            }

            const userData = await userModel.findById(transacitonData.userId);

            const creditBalance = userData.creditBalance + transacitonData.credits

            await userModel.findByIdAndUpdate (userData._id , {creditBalance});


            await transactionModel.findByIdAndUpdate(transacitonData._id, {payment : true} )

            res.json ({sucess :true , message : "credits Added"})
        }else {
             res.json ({sucess :false , message : "payment Failed"})
        }
    }catch(error) {
        console.log(error);
        res.json({sucess : false , message : error.message})  
    }
}

export {registerUser , loginUser , userCredits , paymentRazorpay , verifiedRazorPay};