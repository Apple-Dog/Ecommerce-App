import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : [true,"Please provide a product name."],
            trim : true,
            maxLength : [120,"Product name cannot exceed 120 characters."], 
        },

        price : {
            type : Number,
            required : [true,"Please provide a product price."],
            maxLength : [6,"Product price cannot exceed 6 figure."], 
        },

        description : {
            type : String,
            default:null,
            trim : true,
            minLength : [,"Product description cannot be less than 3 characters."], 
            //Used For Editor in Future - Changes can be made.
        },
        
        photos : [
            {
                secure_url : {
                    type : String,
                    required : true,
                }
            }
        ],

        stock : {
            type : Number,
            default : 0,
        },

        sold : {
            type : Number,
            default : 0,
        },

        ratings : [
            {
                star : {
                    type:Number,
                },
                postedBy : {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "User",
                }, 
            }
        ],

        totalRating : {
            type : String,
            deafult : 0,
        },
        
        collectionId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Collection",
        },
        
    },

    {
        timestamps : true,
    },
);

export default mongoose.model("Product",productSchema);