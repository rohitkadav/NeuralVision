import {registerUser , loginUser} from '../userControllers/userController.js'
import express from 'express';

const userRouter = express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login' , loginUser);

export default userRouter

// http://localhost:4000/api/user/register
// http://localhost:4000/api/user/login
