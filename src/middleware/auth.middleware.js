// middleware/isAuthenticated.ts
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import prisma from "../db/db.js";

export const isAuthenticated = asyncHandler(async (req, _, next) => {
   console.log("isAuthenticated middleware called");
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      );
     
      if (!decodedToken || typeof decodedToken !== 'object' || !('id' in decodedToken)) {
        throw new ApiError(401, "Invalid access token payload");
      }

   
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user; // attach user to request object
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const isAdmin = asyncHandler(async (req, _, next) => {
      try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }, 
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while checking admin role",
      error: error.message,
    });
  }
});

export const isStoreOwner = asyncHandler(async (req, _, next) => {
    try {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { role: true },
        });
        if (!user || user.role !== "STORE_OWNER") {
        return res.status(403).json({
            message: "You are not authorized to perform this action",
        });
        } 
        next();
    }
    catch (error) {
        return res.status(500).json({
        message: "Something went wrong while checking store owner role",
        error: error.message,
        });
    }
});
