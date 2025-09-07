import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import userRouter from './routes/normalUser.router.js';
import adminRouter from './routes/Admin.router.js';
import storeOwnerRouter from './routes/storeOwner.router.js';
 const app = express();

app.use(morgan("dev"))
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}));

app.use(express.urlencoded({
    limit:"16kb",
    extended:true
}))

app.use("/api/v1/user",userRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/storeOwner",storeOwnerRouter);

app.get("/",(_,res)=>{
    res.send("Server is running....")
})



export default app;


app.use((err, req, res, next) => {
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});
