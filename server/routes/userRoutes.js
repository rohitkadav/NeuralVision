import userAuth from '../middlewears/auth.js';
import {registerUser , loginUser, userCredits, paymentRazorpay, verifiedRazorPay} from '../userControllers/userController.js'
import express from 'express';

const userRouter = express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login' , loginUser);
userRouter.get('/credits',userAuth, userCredits)
userRouter.post('/pay-razor', userAuth , paymentRazorpay);
userRouter.post('/verify-razor', verifiedRazorPay)

export default userRouter

// http://localhost:4000/api/user/register
// http://localhost:4000/api/user/login
