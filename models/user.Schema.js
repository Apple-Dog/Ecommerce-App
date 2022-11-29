import mongoose from "mongoose";

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

    }
)