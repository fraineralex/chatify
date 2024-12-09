
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e47dd8f8-9001-5778-935f-26c423d1c364")}catch(e){}}();
import { Router } from 'express';
import { UserController } from '../controllers/user.js';
export const userRouter = Router();
userRouter.get('/', UserController.getAll);
userRouter.get('/metadata', UserController.getUserMetadata);
userRouter.patch('/metadata', UserController.updateMetadata);
//# sourceMappingURL=user.js.map
//# debugId=e47dd8f8-9001-5778-935f-26c423d1c364
