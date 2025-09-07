import {Router} from "express";
import { registerUser,loginUser,updatePassword, logoutUser } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";


const userRouter = Router();

userRouter.post("/signUp", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/updatePassword",isAuthenticated, updatePassword);
userRouter.post("/logout",isAuthenticated,logoutUser); 

export default userRouter;