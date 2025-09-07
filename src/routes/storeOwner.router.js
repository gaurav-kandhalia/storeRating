
import { Router } from 'express';
import { isAuthenticated, isStoreOwner } from '../middleware/auth.middleware.js';
import {getAllUsersRatedStores} from '../controllers/StoreOwner/storeOwner.controller.js'
const storeOwnerRouter = Router();

storeOwnerRouter.get('/userRatedStore',isAuthenticated,isStoreOwner,getAllUsersRatedStores)

export default storeOwnerRouter;