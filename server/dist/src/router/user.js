import { Router } from 'express';
import { UserController } from '../controllers/user.js';
export const userRouter = Router();
userRouter.get('/', UserController.getAll);
userRouter.get('/metadata', UserController.getUserMetadata);
userRouter.patch('/metadata', UserController.updateMetadata);
