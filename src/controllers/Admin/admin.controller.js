import prisma from '../../db/db.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/AsyncHandler.js';
import {Role} from '../../../generated/prisma/index.js'
export const getAllUsers = asyncHandler(async (req, res) => {

    const { role, name, email, address, sortBy = "createdAt", order = "desc" } = req.query;
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
   console.log(req.query);
    const filters= {};
    if (role && Role[role]) filters.role = Role[role];
    if (name) filters.name = { contains: name, mode: "insensitive" };
    if (email) filters.email = { contains: email, mode: "insensitive" };
    if (address) filters.address = { contains: address, mode: "insensitive" };
    console.log(".........................",Role)
   console.log(filters);
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

export const createStore = asyncHandler(async (req, res) => {
    const { name, address,ownerId } = req.body;
    if (!name || !address || !ownerId) {
        throw new ApiError(400, "Store name and address ownerId is required are required");
    }
    const existingStore = await prisma.store.findUnique({where:{address}});
    if(existingStore){
        throw new ApiError(400,"Store with this address already exists");
    }
     
     if (ownerId) {
      const owner = await prisma.user.findUnique({ where: { id: ownerId } });
      if (!owner || owner.role !== "StoreOwner") {
        return res.status(400).json({ message: "Invalid Store Owner ID" });
      }
    }

    const store = await prisma.store.create({
        data: {
            name,
            address,
            ownerId
        }
    });
    if (!store) {
        throw new ApiError(500, "Unable to create store, please try again later");
    }
    res.status(201).json(new ApiResponse(201, { store }, "Store created successfully"));
})

export const getAllStores = asyncHandler(async (req, res) => {
    const { name, address,rating, sortBy = "createdAt", order  } = req.query;
    const filters= {};
    if (name) filters.name = { contains: name, mode: "insensitive" };
    if (address) filters.address = { contains: address, mode: "insensitive" };
    if (rating) filters.rating = Number(rating);    
    const stores = await prisma.store.findMany({
      where: filters,
      orderBy: { [sortBy]: order === "asc" ? "asc" : "desc" },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    address: true,
                    role: true
                }
            }
        }
    });
    if(stores.length===0){
        res.status(200).json(
            new ApiResponse(200,[],"no store exists",true)
        )
    }
    if(!stores){

            throw new ApiError(400,"Unable to fetch stores, please try again later",false);
    }
    res.status(200).json(
        new ApiResponse(200, { stores }, "Stores fetched successfully",true)
    )
}
)

