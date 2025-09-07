import bcrypt from 'bcrypt'
import prisma from '../db/db.js';
import { Role } from '../../generated/prisma/index.js'; // Add this import

import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { generateAccessToken,generateRefreshToken } from '../utils/generateTokens.js';
import { asyncHandler } from '../utils/AsyncHandler.js';


export const registerUser = asyncHandler(async (req,res)=>{
    console.log("user register")
   const {name,email,password,address,role} = req.body;
   if(!name || !email || !password || !address){
    throw new ApiError(400,"Name, email and password address are required");
   }

    const existingUser = await prisma.user.findUnique({ where: { email } });
   if(existingUser){
    throw new ApiError(400,"User with this email already exists");
   }

   const hashedPassword = await bcrypt.hash(password,10);
   console.log("Role...............",Role)
   console.log("role//////////",role)
   
   const normalizedRole = Object.keys(Role).find(
    key => key.toLowerCase() === (role || '').toLowerCase()
  );
  const prismaRole = normalizedRole ? Role[normalizedRole] : Role.USER;
     
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            address,
            role: prismaRole
        }
    });

    if(!user){
        throw new ApiError(500,"Unable to create user, please try again later");
    }

     const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
20
     await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.status(201).json(new ApiResponse(201,{user:{id:user.id,name:user.name,address:user.address,email:user.email,role:user.role},accessToken,refreshToken},"User registered successfully"));


})

export const loginUser = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        throw new ApiError(400,"Email and password are required");
    }
    const user = await prisma.user.findUnique({where:{email}});
    if(!user){
        throw new ApiError(400,"Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        throw new ApiError(400,"Invalid email or password");
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
        });

    res.status(200).json(new ApiResponse(200,{user:{id:user.id,name:user.name,address:user.address,email:user.email},accessToken,refreshToken},"User logged in successfully"));
})
export const logoutUser = asyncHandler(async (req,res)=>{
    const userId = req.user.id;
    await prisma.user.update({
        where:{id:userId},
        data:{refreshToken:null}
    });
    res.status(200).json(new ApiResponse(200,{},"User logged out successfully"));
})

export const updatePassword = asyncHandler(async (req,res)=>{
    const userId = req.user.id;
    const {oldPassword,newPassword} = req.body;
    if(!oldPassword || !newPassword){
        throw new ApiError(400,"Old password and new password are required");
    }
    const user = await prisma.user.findUnique({where:{id:userId}});
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const isPasswordValid = await bcrypt.compare(oldPassword,user.password);
    if(!isPasswordValid){
        throw new ApiError(400,"Old password is incorrect");
    }   
    const hashedNewPassword = await bcrypt.hash(newPassword,10);
    await prisma.user.update({
        where:{id:userId},

        data:{password:hashedNewPassword}
    });
    res.status(200).json(new ApiResponse(200,null,"Password updated successfully"));
}
)


