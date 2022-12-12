import User from "../models/user.Schema";
import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";
import cookieHelper from "../utils/cookieHelper";
import emailValidation from "../utils/emailValidation";
import mailHelper from "../utils/mailHelper";
import config from "../config/index";
import crypto from "crypto";




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

    // Collect all Information
    const {name , email, password} = req.body;

    // Validate the Data if exists
    if(!name || !email || !password){
        throw new CustomError("Please Fill All Fields",400);
    };

    // Check If User Exists
    const existingUser = await User.findOne({email});

    if(existingUser){
        throw new CustomError("User Already Exists.",400);
    }

    // Checks Whether email is Valid or Not on the Bases Of Pattern or Whether Email is null
    
    if (!(emailValidation(email)))
    {
        throw new CustomError("Invalid Email.",400);
    };
    // Creating New User Entry in the Database
    const user = await User.create({
        name,
        email,
        password
    });

    // Token Generation using Predefined Method in User Schema
    const token = user.getJwtToken();
    console.log(user);

    // Setting Password undefined so that it couldn't be passed through token
    user.password = undefined; 

    //Cookie Helper Method for Creating Cookies and sending to Response
    //SET COOKIE & BEARER TOKEN VALUE AS "token"
    cookieHelper(token);

    // Sending Response if User Entry gets Sucessfully Created in the Database
    res.status(200).json({
        success : true,
        token,
        user,
    });


});




/******************************************************
 * @SIGNIN
 * @REQUEST_TYPE POST
 * @Route http://localhost:4000/api/auth/signin
 * @Description User signIn Controller for signing in user
 * @Parameters email, password
 * @Returns User Object
 ******************************************************/

export const signIn = asyncHandler(async (req,res)=>{

    // Collect all Information
    const {email, password} = req.body;

    // Validate if email and password or either of them missing
    if(!email || !password){
        throw new CustomError("Credentials cannot be empty!",400);
    };

    // Check user is in the Database or not
    const user = await User.findOne({email}).select("+password");

    if (!user){
        throw new CustomError("Invalid Credentials!",400);
    }

    // Compare Password Using Predefined Method in Schema "comparePassword"
    const isPasswordMatched = await user.comparePassword(password);

    if (isPasswordMatched){

         // Token Generation using Predefined Method in User Schema
        const token = user.getJwtToken();

        // Setting Password undefined so that it couldn't be passed through token
        user.password = undefined;

        //Cookie Helper Method for Creating Cookies and sending to Response
        //SET COOKIE & BEARER TOKEN VALUE AS "token"
        cookieHelper(token);

        // Sending Response if User gets SignIn Successfully
        res.status(200).json({
            success : true,
            token,
            user,
        });

    };
    
    throw new CustomError("Invalid Credentials!-Password",400);

});




/******************************************************
 * @SIGNOUT
 * @REQUEST_TYPE POST
 * @Route http://localhost:4000/api/auth/signout
 * @Description User signOut by clearing user cookies
 * @Parameters None
 * @Returns Success Message
 ******************************************************/

export const signOut = asyncHandler(async (_req,res)=>{

    // res.clearCookie() - Does not Give More Options, but can be Used

    //Cookie Helper Method for Creating Cookies and sending to Response 
    //SET COOKIE & BEARER TOKEN TO NULL
    cookieHelper(null);

    // Sending Response if User SignOuts Successfully
    res.status(200).json({
        success : true,
        message : "Sign Out"
    })
});




/******************************************************
 * @FORGOT_PASSWORD
 * @REQUEST_TYPE POST
 * @Route http://localhost:4000/api/auth/password/forgot
 * @Description User will submit an email and it will generate a token
 * @Parameters email
 * @Returns Success Message => Email Sent
 ******************************************************/

export const forgotPassword = asyncHandler(async (req,res)=>{

    // Grab Email
    const {email} = req.body;

    // Checks Whether email is Valid or Not on the Bases Of Pattern or Whether Email is null
    if (!(emailValidation(email)))
    {
        throw new CustomError("Invalid Email.",400);
    };

    // Check Wether User Exists or Not
    const user = User.findOne({email});

    if(!user){
        throw new CustomError("User Not Found.",404);
    }

    // Token Generation for Forgot Password using Predefined Method in User Schema "generateForgotPasswordToken"
    const resetToken = user.generateForgotPasswordToken();

    // Only Saving Data Without Running Validation in the Database - Forcefull Save
    await user.save({validateBeforeSave : false});

    // Custom Crafted Reset URL 
    const resetUrl = `${req.protocol}://${req.host}/api/auth/password/reset/${resetToken}`;

    //Custom Text Message
    const text = `Your Password Reset Url is \n\n${resetUrl}\n\n`;

    //Custom HTML For Heading Highlighting 
    const html = `<h3><b>Password Reset For Account</b></h3>`;

    try {

        await mailHelper({
            email : user.email,
            subject : config.SMTP_MAIL_RESET_PASSWORD_SUBJECT,
            text : text,
            html : html,

        });
        res.status(200).json({
            success : true,
            message : `Email Sent to ${user.email}`,
        });

    } catch (error) {

        // Rollback, Clear Fields & Save 
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;

        // Forcefull Save
        await user.save({validateBeforeSave : false});

        throw new CustomError(error.message||"Email Sent Failure",500);
    }



});




/******************************************************
 * @RESET_PASSWORD
 * @REQUEST_TYPE POST
 * @Route http://localhost:4000/api/auth/password/:resetToken
 * @Description User will be able to reset password based on url token
 * @Parameters Token from the Url, Password & Confirm Password
 * @Returns User Object
 ******************************************************/

export const resetPassword = asyncHandler(async (req,res)=>{

   // Grab Password Reset Token From Url 
   const {token : resetToken} = req.params;
   //Grab Password and Forgot password
   const {password, confirmPassword} = req.body;

   //Encrypt Password 
   const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

   //Find User on the Basis of Reset Password Token with a check that that Token Expiry Time is Greater than Current Time
   const user = await User.findOne({
        forgotPasswordToken : resetPasswordToken,
        forgotPasswordExpiry : {$gt : Date.now()}
    });

    // If User Not Found Throw Error
    if(!user) {
        throw new CustomError("Password Token is Invalid Or Expired.",400);
    };

    // If Password Does Not Match Confirm Password then Throw a Error 
    if (password !== confirmPassword) {
        throw new CustomError("Password & Confirm Password Does Not Match.",400);
    };

    // When All Checks Get Password then save the Current Password Given By User to the Database,
    // Which will Automatically get Encrypted Before Saving into Database. 
    user.password = password;

    // Set Garbage Data to Undefined(Data Of No Use After New Password Got Set).
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    // Generate Token & Send as Response
    const token = user.getJwtToken();
    user.password = undefined;

    //Cookie Helper Method for Creating Cookies and sending to Response
    //SET COOKIE & BEARER TOKEN VALUE AS "token"
    cookieHelper(token);

    // Sending Response if User Reset Password Successfully
    res.status(200).json({
        success : true,
        user,
    });

});




/******************************************************
 * @CHANGE_PASSWORD
 * @REQUEST_TYPE POST
 * @Route http://localhost:4000/api/auth/password/change
 * @Description User will be able to change password if User is SignIN and after User Authentication
 * @Parameters Token from the Url, Password & Confirm Password
 * @Returns User Object
 ******************************************************/








