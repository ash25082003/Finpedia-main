import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";

export const verifyAdminJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.adminAccessToken || // Use admin-specific cookie
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized access");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken");

        if (!admin) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.admin = admin; // Custom middleware adds admin field to the request
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
