import CustomError from "../utils/customError";
import asyncHandler from "../services/asyncHandler";

export const hasRoles = asyncHandler((...permittedRoles) => {
     
      // Middleware for doing Role-Based Permissions

     // Return Middleware
    return (req, _res, next) => {

        // Taking Out user from Request
        const {user} = req;

        // Checking Whether user role is in the permittedRoles List
        if (!user && !permittedRoles.includes(user.role)){
            throw new CustomError("Forbidden", 403);  // user is Forbidden
        };

        next(); // Role is Allowed, So Continue on the Next Middleware
    };
});