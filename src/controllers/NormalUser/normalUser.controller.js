

import prisma from "../../db/db.js";'';
import { Role } from '../../../generated/prisma/index.js'; // Add this import

import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

import { asyncHandler } from '../../utils/AsyncHandler.js';

export const rateStore = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  console.log("req.user.role", req.user.role);
  console.log("Role.USER", Role.USER);
  if (req.user.role !== Role.USER) {
    return res.status(403).json({ message: "Only normal users can rate stores" });
  }

  const { storeId, value } = req.body; 
  console.log("req.body", req.body);
  // 2. Validate input
  if (!storeId || !value) {
    throw new ApiError(400, "Store ID and rating value are required");
  }
  if (value < 1 || value > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  // 3. Ensure store exists
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  // 4. Upsert rating (create if not exists, update if exists)
  const rating = await prisma.rating.upsert({
    where: {
      userId_storeId: { userId, storeId }, 
    },
    update: { value }, // update existing rating
    create: { userId, storeId, value }, // create new rating
  });

  res.status(200).json(new ApiResponse(200, { rating }, "Rating submitted successfully"));
});

export const getAllStores = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    console.log("userId", userId);
    const { name, address, sortBy = "createdAt", order = "desc", } = req.query;
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
   console.log(req.query);
    const filters= {};
    if (name) filters.name = { contains: name, mode: "insensitive" };
    if (address) filters.address = { contains: address, mode: "insensitive" };  
    console.log(".........................",Role)
    console.log(filters);

const stores = await prisma.store.findMany({
    where: filters,
    orderBy: { [sortBy]: order === "asc" ? "asc" : "desc" },
    include: {
      ratings: {
        select: {
          value: true,
          userId: true,
        },
      },
    },
  });

  if (!stores || stores.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, [], "No stores found", true)
    );
  }

  

   const storesWithRatings = stores.map((store) => {
    const overallRating =
      store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length
        : null;

    const submittedRating =
      store.ratings.find((r) => r.userId === userId)?.value || null;

    return {
      id: store.id,
      name: store.name,
      address: store.address,
      overallRating,
      submittedRating,
    };
    });

    console.log("Stores with ratings:", storesWithRatings);
   return res.status(200).json(
    new ApiResponse(200, storesWithRatings, "Stores fetched successfully", true)
  );

}
)