import mongoose from "mongoose";
import OrderStatus from "../utils/orderStatus.js";
import PaymentModes from "../utils/paymentModes.js";
import PaymentStatus from "../utils/paymentStatus.js";


const orderSchema = new mongoose.Schema(
    {
        products : {
             type : [
                 {
                    productId : {
                          type : mongoose.Schema.Types.ObjectId,
                          ref : "Product",
                          required : true,
                    }, 
 
                    count : {
                          type : Number, 
                          default : 0,
                    },
 
                    price : {
                          type : Number, 
                          default : null,
                      },
 
                },
           ],
           required : true,
        },

        user : {
            type : Object.Schema.Types.ObjectId,
            ref : "User",
            required : true,
        },

        address : {
            type : String,
            required : true,
            trim : true,
        },

        phoneNumber : {
            type : Number,
            required : true,
        },

        amount : {
            type : Number,
            required : true,
        },

        coupon : {
            type : String,
            default : null
        },

        transactionId : {
            type : String,
            default : null,
        },

        status : {
            type : String,
            enum : Object.values(OrderStatus),
            default : OrderStatus.ORDERED,
        
        },

        paymentModes : {
            type : String,
            enum : Object.values(PaymentModes),
            default : PaymentModes.COD,
        },

        paymentStatus : {
            type : String,
            enum : Object.values(PaymentStatus),
            default : PaymentStatus.CREATED,
        },

    },

    {
        timestamps : true,
    },
);

export default mongoose.model("Order",orderSchema);