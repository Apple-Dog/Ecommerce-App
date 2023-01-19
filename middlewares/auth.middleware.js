import User from "../models/user.Schema.js";
import JWT from "jsonwebtoken";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import config from "../config/env.config.js";


export const isSignnedIn = asyncHandler(async(req, _res, next) => {
    // Declaring token so that it could be used in whole block
    let token;

    // Checking token in Cookies & in Bearer Token
    if (req.cookies.token || 
       (req.headers.Authorization && 
       req.headers.Authorization.startsWith("Bearer")))
       {
            // Fetching Token Value from either Cookies or From Bearer Token and Storing in "token".
            token = req.cookies.token || req.headers.Authorization.split(" ")[1];
       };

       // Checking Whether token (tokenValue) is present or not
       if(!token) {
            throw new CustomError("Not Authorized to Access this Route.",401);
       };


       try {

        // Verifying Token
        const decodedJwtPayload = JWT.verify(token, config.JWT_SECRET);

        // Finding User based on "_id" and with Selected Fields (Name, Email, Role) and Sending it to req.user
        req.user = await User.findById(decodedJwtPayload._id, "name email role");

        next();

       } catch (error) {
            throw new CustomError("Not Authorized to Access this Route.",401);
       };
});