import User from "../models/user.Schema";
import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";
import cookieOptions from "../utils/cookieOptions";
import emailValidation from "../utils/emailValidation";


//Cookie Options
export const CookieOptions = cookieOptions(3*24*60*60*1000);



//------------------------ API ROUTES ------------------------



/******************************************************
 * @SIGNUP
 * @REQUEST_TYPE POST
 * @Route http://localhost:4000/api/auth/signup
 * @Description User signUp Controller for creating new user
 * @Parameters name, email, password
 * @Returns User Object
 ******************************************************/




});