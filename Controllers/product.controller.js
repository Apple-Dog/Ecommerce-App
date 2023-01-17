import Product from "../models/product.Schema";
import formidable from "formidable";
import fs from "fs";
import {uploadFile , deleteFile} from "../services/imageHandler";
import { Mongoose } from "mongoose";
import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";
import config from "../config/env.config";


//------------------------ API ROUTES ------------------------



/******************************************************
 * @ADD_PRODUCT
 * @REQUEST_TYPE POST
 * @Route http://localhost:4000/api/product/add
 * @Description 1.Controller used for Creating a New Product
 *              2. Only Admin can Create the Coupon
 *              3. Uses AWS S3 Bucket for image upload
 * @Parameters Error as err |Fields as name, price, description | Files as [Image Files]
 * @Returns Product Object
 ******************************************************/

export const addProduct = asyncHandler (async (req, res) => {
    
    // Create Form Using Formidable
    const form = formidable({
        multiples : true,
        keepExtensions : true,
    });

    // Takes Errors, Field and Files from the Form Or From Front End
    form.parse(req, async function(err, fields, files) {

        try {
            if (err){
                throw new CustomError(err.message || "Oops! Something has gone wrong with our servers.", 500);
            };

            // Generate Custom Product Id
            const productId = new Mongoose.Types.ObjectId().toHexString();
            
             // Check For Fields

             if(!fields.name || !fields.price || !fields.description || collectionId) {

                throw new CustomError("Please fill all the details.", 400);

            };

            // #### Handling Images ####

            // Wraps All of the Promises
            const imgArrayResponse = Promise.all(

                // Forcefully Casting into an Array for Safety Purpose
                Object.keys(files).map(async (filekey, index) => {

                    // Contains File of Current Index
                    const element = files[filekey];

                    // Contains Data of Current File
                    const data = fs.readFileSync(element.filepath);

                    const upload = await uploadFile({
                        bucketName : config.S3_BUCKET_NAME,
                        key : `products/${productId}/photo-${index + 1}`,   //  Unique File Name to Prevent Dublicacy
                        body : data,                                        // File Data
                        contentType : element.mimetype,                     // Extension of File
                    });

                    return ({
                        secure_url : await upload.Location,                 // Location of File Where it got Uploaded
                    });
                })
            );

            // List Of All Images
            const imgArray = await imgArrayResponse;

            //Creating a Product Entry Into a Database
            const product = await Product.create({
                _id : productId,
                photos : imgArray,
                ...fields,
            });

            // CHECK : When Product Not Found throw Error
            if(!product){
                throw new CustomError("Product was not Created.", 400);

                // Remove Image From AWS Code .....
            };

            // When Successful Send Response
            res.status(200).json({
                success : true,
                product,
            });

            
        } catch (error) {
            return res.status(500).json({
                success : false,
                message : error.message || "Oops! Something has gone wrong with our servers.",
            });
        };
        
    });

});





/******************************************************
 * @GET_ALL_PRODUCT
 * @REQUEST_TYPE GET
 * @Route http://localhost:4000/api/product/all
 * @Description 1.Controller used for Getting all Products Details
 *              2. User and Admin can get all the Products
 * @Parameters None
 * @Returns Product Object
 ******************************************************/

export const getAllProducts = asyncHandler (async (_req, res) => {

    // Find All Products From The Database
    const products = await Product.find({});
    
    // CHECK : When Product Not Found throw Error
    if(!products) {
         throw new CustomError("No Product was Found",404);
    };

    // When Successful Send Response
    res.status(201).json({
        success : true,
        products
    });
});





/******************************************************
 * @GET_PRODUCT_BY_ID
 * @REQUEST_TYPE GET
 * @Route http://localhost:4000/api/product/:id
 * @Description 1.Controller used for Getting Single Product Details
 *              2. User and Admin can get Single Product details
 * @Parameters ID
 * @Returns Product Object
 ******************************************************/

export const getProductById = asyncHandler (async (req, res) => {

    // Get id from URL as productId
    const {id : productId} = req.params;

    const products = await Product.findById(productId);

    // CHECK : When Product Not Found throw Error
    if(!products) {
         throw new CustomError("No Product was Found",404);
    };

    // When Successful Send Response
    res.status(201).json({
        success : true,
        products
    });
});








