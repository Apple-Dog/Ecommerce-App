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
            required : [true,"Name is Required."],
            unique: true,
        }

    }
)