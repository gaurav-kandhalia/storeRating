import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middleware/auth.middleware.js";
import { loginUser, registerUser } from "../controllers/user.controller.js";
import { createStore, getAllStores, getAllUsers } from "../controllers/Admin/admin.controller.js";
import { create } from "domain";

const adminRouter = Router();

adminRouter.post("/createUser",isAuthenticated, isAdmin,registerUser)
adminRouter.get('/getAllUser',isAuthenticated,isAdmin,getAllUsers)
adminRouter.post("/createStore",isAuthenticated,isAdmin,createStore)
adminRouter.get("/getAllStores",isAuthenticated,isAdmin,getAllStores)

export default adminRouter;