import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import crypto from "crypto";
import config from "../config/index"

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
};

