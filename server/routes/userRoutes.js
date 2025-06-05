import userAuth from '../middlewears/auth.js';
import {registerUser , loginUser, userCredits} from '../userControllers/userController.js'
import express from 'express';

const userRouter = express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login' , loginUser);
userRouter.post('/credits',userAuth, userCredits)

export default userRouter

// http://localhost:4000/api/user/register
// http://localhost:4000/api/user/login
