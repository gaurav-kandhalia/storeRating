import dotenv from 'dotenv';
import {app} from './app.js';
import { connectDB } from './db/db.js';


dotenv.config({
    path: './.env'
});

connectDB();

app.listen(process.env.PORT,()=>{
    console.log("Server is listening at port",process.env.PORT)
})



