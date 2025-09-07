

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

  const { storeId, ratingVal } = req.body; 
  // 2. Validate input
  if (!storeId || !ratingVal) {
    throw new ApiError(400, "Store ID and rating ratingVal are required");
  }
  if (ratingVal < 1 || ratingVal > 5) {
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
    update: { ratingVal }, // update existing rating
    create: { userId, storeId, ratingVal }, // create new rating
  });

  res.status(200).json(new ApiResponse(200, { rating }, "Rating submitted successfully"));
});