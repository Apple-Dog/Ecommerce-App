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

export const signUp = asyncHandler(async (req,res)=>{

    //Collect all Information
    const {name , email, password} = req.body;

    //Validate the Data if exists
    if(!name || !email || !password){
        throw new CustomError("Please Fill All Fields",400);
    };

    //Check If User Exists
    const existingUser = await User.findOne({email});

    if(existingUser){
        throw new CustomError("User Already Exists",400);
    }

    //Checks Wether email is Valid or Not on the Bases Of Pattern
    
    if (!(emailValidation(email)))
    {
        throw new CustomError("Invalid Email",400);
    };
    //Creating New User Entry in the Database
    const user = await User.create({
        name,
        email,
        password
    });

    //Token Generation using Predefined Method in User Schema
    const token = user.getJwtToken();
    console.log(user);

    //Setting Password undefined so that it couldn't be passed through token
    user.password = undefined; 


    //Creating Cookies Along with Some Data
    res.cookie("token", token, CookieOptions);

    //Sending Bearer Token
    res.setHeader("Authorization", "Bearer "+ token);

    //Sending Response if User Entry gets Sucessfully Created in the Database
    res.status(200).json({
        success : true,
        token,
        user,
    });


});




