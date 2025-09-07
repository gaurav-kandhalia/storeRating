
import prisma from '../../db/db.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/AsyncHandler.js';

export const getAllUsers = asyncHandler(async (req, res) => {

    const { role, name, email, address, sortBy = "createdAt", order = "desc" } = req.query;

   
    const filters= {};
    if (role) filters.role = role;
    if (name) filters.name = { contains: name, mode: "insensitive" };
    if (email) filters.email = { contains: email, mode: "insensitive" };
    if (address) filters.address = { contains: address, mode: "insensitive" };

    const users = await prisma.user.findMany({
      where: filters,
      orderBy: { [sortBy]: order === "asc" ? "asc" : "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true,
        createdAt: true,
      },
    });

    if(users.length===0){
        res.status(200).json(
            new ApiResponse(200,[],"no user exists",true)
        )
    }
    if(!users){
            throw new ApiError(400,"Unable to fetch users, please try again later",false);
    }

    
    res.status(200).json(
        new ApiResponse(200, { users }, "Users fetched successfully",true)
    )
})

