
import prisma from "../../db/db.js";'';
import { Role } from '../../../generated/prisma/index.js'; // Add this import

import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

import { asyncHandler } from '../../utils/AsyncHandler.js';

export const getAllUsersRatedStores = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    console.log("userId", userId);
    console.log("req.user.role", req.user.role);
    if (req.user.role !== Role.StoreOwner) {
    throw new ApiError(403, "Only store owners can access this route");
  }

  
   const stores = await prisma.store.findMany({
  where: { ownerId: req.user.id }, // only this owner’s stores
  include: {
    ratings: {
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    },
  },
});
    console.log(".........................",stores)
    

    const usersWhoRated = stores.flatMap((store) =>
  store.ratings.map((r) => ({
    userId: r.user.id,
    name: r.user.name,
    email: r.user.email,
    storeId: store.id,
    storeName: store.name,
    rating: r.value,
  }))
);
    console.log("usersWhoRated", usersWhoRated);

    if(usersWhoRated.length===0){
        res.status(200).json(
            new ApiResponse(200,[],"no user has rated your stores yet",true)
        )
    }
    if(!usersWhoRated){
            throw new ApiError(400,"Unable to fetch users, please try again later",false);
    }   


//     if (!store || store.ownerId !== ownerId) {
//     throw new ApiError(403, "You are not authorized to view this store's ratings");
//   }

   
    res.status(200).json(
        new ApiResponse(200, { usersWhoRated }, "Users fetched successfully",true)
    )
})

