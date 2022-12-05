import mongoose from "mongoose";



const collectionSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : [true,"Please provide a catagory name."],
            trim : true,
            maxLength : [120,"Collection name cannot exceed 120 characters."],

        },
    },
    {
        timestamps : true,
    },
);

export default mongoose.model("Collection",collectionSchema);