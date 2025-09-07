import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middleware/auth.middleware.js";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { getAllUsers } from "../controllers/Admin/admin.controller.js";

const adminRouter = Router();

adminRouter.post("/createUser",isAuthenticated, isAdmin,registerUser)
adminRouter.get('/getAllUser',isAuthenticated,isAdmin,getAllUsers)

export default adminRouter;