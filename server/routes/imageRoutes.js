import express from 'express'
import { generateImage } from '../userControllers/imageController.js'
import userAuth from '../middlewears/auth.js'

const imageRouter = express.Router()

imageRouter.post('/generate-Image',userAuth,generateImage)

export default imageRouter;