import { Router } from 'express'
import { UserController } from '../controllers/user.js'

export const userRouter = Router()

userRouter.get('/', UserController.getAll)
userRouter.patch('/metadata', UserController.updateMetadata)
userRouter.get('/metadata', UserController.getUserMetadata)
