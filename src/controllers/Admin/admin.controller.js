import prisma from '../../db/db.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/AsyncHandler.js';
import {Role} from '../../../generated/prisma/index.js'
import bcrypt from 'bcrypt';
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
    
      stores: {
        select: {
          id: true,
          name: true,
          address: true,
          createdAt: true,
        },
      },
    },
  });

  console.log("users...................", users);

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
    }else{
          res.status(200).json(
        new ApiResponse(200, { stores }, "Stores fetched successfully",true)
    )
    }
    if(!stores){

            throw new ApiError(400,"Unable to fetch stores, please try again later",false);
    }
  
}
)

export const insertData = asyncHandler(async (req, res) => {
    const users = [
  { name: "Alice", email: "alice1@example.com", password: "12345678", address: "Delhi", role: "USER" },
  { name: "Bob", email: "bob1@example.com", password: "12345678", address: "Mumbai", role: "StoreOwner" },
  { name: "Charlie", email: "charlie1@example.com", password: "12345678", address: "Chennai", role: "USER" },
  { name: "David", email: "david1@example.com", password: "12345678", address: "Kolkata", role: "StoreOwner" },
  { name: "Eva", email: "eva1@example.com", password: "12345678", address: "Pune", role: "USER" },
  { name: "Frank", email: "frank1@example.com", password: "12345678", address: "Hyderabad", role: "StoreOwner" },
  { name: "Grace", email: "grace1@example.com", password: "12345678", address: "Jaipur", role: "USER" },
  { name: "Hank", email: "hank1@example.com", password: "12345678", address: "Goa", role: "StoreOwner" },
  { name: "Ivy", email: "ivy1@example.com", password: "12345678", address: "Bangalore", role: "USER" },
  { name: "Jack", email: "jack1@example.com", password: "12345678", address: "Ahmedabad", role: "StoreOwner" },
  { name: "Kim", email: "kim1@example.com", password: "12345678", address: "Surat", role: "USER" },
  { name: "Leo", email: "leo1@example.com", password: "12345678", address: "Lucknow", role: "StoreOwner" },
  { name: "Mona", email: "mona1@example.com", password: "12345678", address: "Indore", role: "USER" },
  { name: "Nina", email: "nina1@example.com", password: "12345678", address: "Nagpur", role: "StoreOwner" },
  { name: "Oscar", email: "oscar1@example.com", password: "12345678", address: "Patna", role: "USER" },
  { name: "Paul", email: "paul1@example.com", password: "12345678", address: "Bhopal", role: "StoreOwner" },
  { name: "Quinn", email: "quinn1@example.com", password: "12345678", address: "Kanpur", role: "USER" },
  { name: "Rita", email: "rita1@example.com", password: "12345678", address: "Agra", role: "StoreOwner" },
  { name: "Sam", email: "sam1@example.com", password: "12345678", address: "Varanasi", role: "USER" },
  { name: "Tina", email: "tina1@example.com", password: "12345678", address: "Meerut", role: "StoreOwner" }
];

const userData = await Promise.all(users.map(async user => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
      role: Role[user.role] 
    })));

        await prisma.user.createMany({ data: userData, skipDuplicates: true });

    res.status(201).json({ success: true, message: "20 dummy users inserted!" });
  } );


  // Add this to your admin controller or router
export const insertStores = asyncHandler(async (req, res) => {
const stores = [
{ name: "Pizza Hub",       address: "202 Marina Street, Chennai",     ownerId: 3 },   // Charlie
  { name: "Domino's",        address: "12 FC Road, Pune",               ownerId: 5 },   // Eva
  { name: "Burger King",     address: "45 MI Road, Jaipur",             ownerId: 7 },   // Grace
  { name: "KFC",             address: "76 MG Road, Bangalore",          ownerId: 9 },   // Ivy
  { name: "Starbucks",       address: "18 Ring Road, Surat",            ownerId: 11 },  // Kim
  { name: "Subway",          address: "9 MG Road, Indore",              ownerId: 13 },  // Mona
  { name: "Taco Bell",       address: "34 Fraser Road, Patna",          ownerId: 15 },  // Oscar
  { name: "Café Coffee Day", address: "27 Mall Road, Kanpur",           ownerId: 17 },  // Quinn
  { name: "McDonald's",      address: "88 Godowlia Road, Varanasi",     ownerId: 19 }   // Sam
];


  await prisma.store.createMany({ data: stores, skipDuplicates: true });

  res.status(201).json({ success: true, message: "10 dummy stores inserted!" });
});
