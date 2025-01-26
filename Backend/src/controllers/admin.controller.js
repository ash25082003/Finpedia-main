import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import { Admin } from "../models/admin.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId);

        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();

        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
};

const registerAdmin = asyncHandler(async (req, res, next) => {
    const { fullName, email, enroll, password } = req.body;

    if ([fullName, email, enroll, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existingAdmin = await Admin.findOne({
        $or: [{ enroll }, { email }],
    });

    if (existingAdmin) {
        throw new ApiError(409, "Admin with email or enroll already exists");
    }

    const admin = await Admin.create({
        fullName,
        email,
        enroll,
        password,
    });

    const createdAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

    if (!createdAdmin) {
        throw new ApiError(500, "Something went wrong while registering the admin");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(admin._id);

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(201)
        .cookie("adminAccessToken", accessToken, options)
        .cookie("adminRefreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    admin: createdAdmin,
                    accessToken,
                    refreshToken,
                },
                "Admin registered and logged in successfully"
            )
        );
});

const loginAdmin = asyncHandler(async (req, res, next) => {
    const { email, enroll, password } = req.body;

    if (!(enroll || email)) {
        throw new ApiError(400, "Enroll or email is required");
    }

    const admin = await Admin.findOne({
        $or: [{ enroll }, { email }],
    });

    if (!admin) {
        throw new ApiError(404, "Admin does not exist");
    }

    const isPasswordValid = await admin.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(admin._id);

    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("adminAccessToken", accessToken, options)
        .cookie("adminRefreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    admin: loggedInAdmin,
                    accessToken,
                    refreshToken,
                },
                "Admin logged in successfully"
            )
        );
});

const logoutAdmin = asyncHandler(async (req, res) => {
    await Admin.findByIdAndUpdate(
        req.admin._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("adminAccessToken", options)
        .clearCookie("adminRefreshToken", options)
        .json(new ApiResponse(200, {}, "Admin logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.adminRefreshToken || req.body.adminRefreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const admin = await Admin.findById(decodedToken._id);

        if (!admin) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== admin.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        const { accessToken, newRefreshToken } =
            await generateAccessAndRefreshTokens(admin._id);

        return res
            .status(200)
            .cookie("adminAccessToken", accessToken, options)
            .cookie("adminRefreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});


const changeAdminPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin?._id);
    const isPasswordCorrect = await admin.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    admin.password = newPassword;
    await admin.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentAdmin = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.admin, "Current admin fetched"));
});

const updateAdminDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required");
    }

    const admin = await Admin.findByIdAndUpdate(
        req.admin?._id,
        {
            $set: {
                fullName: fullName,
                email: email,
            },
        },
        { new: true }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, admin, "Account details updated successfully"));
});

const updateAdminAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar");
    }

    const admin = await Admin.findByIdAndUpdate(
        req.admin?._id,
        {
            $set: { avatar: avatar.url },
        },
        {
            new: true,
        }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, admin, "Avatar updated successfully"));
});

export {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    refreshAccessToken,
    changeAdminPassword,
    getCurrentAdmin,
    updateAdminDetails,
    updateAdminAvatar,
};
