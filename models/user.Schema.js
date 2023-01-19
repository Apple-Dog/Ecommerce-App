import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";
import config from "../config/env.config.js"

// User Schema
const userSchema = mongoose.Schema(
    {
        name : {
            type : String,
            required : [true,"Name is Required."],
            maxLength : [50,"Name must be less than 50."], 
        },

        email : {
            type : String,
            required : [true,"Email is Required."],
            unique: true,
        },

        password : {
            type : String,
            required : [true,"Password is Required."],
            minLength : [8,"Password must be at least 8 characters."],
            select : false, 
        },

        role : {
            type : String,
            enum : Object.values(AuthRoles),
            default : AuthRoles.USER,
        },

        forgotPasswordToken : String,
        forgotPasswordExpiry : Date,
        

    },
    {
        timestamps : true,
    },
);

export default mongoose.model("User",userSchema);

//Password Encryption in Schema

userSchema.pre("save", async function(next){
    if(!this.modified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
});

// Add More Features Directly into Schema

userSchema.methods = {
    // Compare Password
    comparePassword :  async function(enteredPassword){
        return await bcrypt.compare(enteredPassword,this.password);
    },

    // Generate JWT TOKEN
    getJwtToken : function(){
        return JWT.sign(
            {
                _id : this._id,
                role : this.role,
            },
            config.JWT_SECRET,
            {
                expiresIn : config.JWT_EXPIRY,
            }
        );
    },

     // Generate Forgot Password Token TOKEN
    generateForgotPasswordToken : function(){
        const forgotToken = crypto.randomBytes(20).toString("hex");

        //Step 1 - Save to Database
        this.forgotPasswordToken = crypto.createHash("sha256").update(forgotToken).digest("hex");

        this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

        //Step 2 - Return values to user
        return forgotToken;

    },
    
};

