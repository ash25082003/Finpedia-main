import { Router } from "express";
import {
    loginAdmin,
    registerAdmin,
    logoutAdmin,
    refreshAccessToken,
    changeAdminPassword,
    getCurrentAdmin,
    updateAdminDetails,
    updateAdminAvatar
} from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAdminJWT } from "../middlewares/adminAuth.middleware.js";

const adminRouter = Router();

adminRouter.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),  // middleware for handling file uploads
    registerAdmin
);

adminRouter.route('/login').post(loginAdmin);

// Secure routes
adminRouter.route('/logout').post(
    verifyAdminJWT,
    logoutAdmin
);

adminRouter.route("/refresh-token").post(refreshAccessToken);

adminRouter.route("/change-password").post(upload.none() ,verifyAdminJWT, changeAdminPassword);
adminRouter.route("/current-admin").get(verifyAdminJWT, getCurrentAdmin);
adminRouter.route("/update-account").patch(upload.none() ,verifyAdminJWT, updateAdminDetails);
adminRouter.route("/avatar").patch(
    verifyAdminJWT,
    upload.single("avatar"),
    updateAdminAvatar
);

export default adminRouter;
