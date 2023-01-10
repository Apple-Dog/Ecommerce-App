import Product from "../models/product.Schema";
import formidable from "formidable";
import fs from "fs";
import {uploadFile , deleteFile} from "../services/imageHandler";
import Mongose, { Mongoose } from "mongoose";
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
    const form = formidable({
        multiples : true,
        keepExtensions : true,
    });

    form.parse(req, async function(err, fields, files) {

        try {
            if (err){
                throw new CustomError(err.message || "Oops! Something has gone wrong with our servers.", 500);
            };

            const productId = new Mongoose.Types.ObjectId().toHexString();
        
             if(!fields.name || !fields.price || !fields.description || collectionId) {

                throw new CustomError("Please fill all the details.", 400);

            };

            const imgArrayResponse = Promise.all(
                Object.keys(files).map(async (filekey, index) => {
                    const element = files[filekey];

                    const data = fs.readFileSync(element.filepath);

                    const upload = await uploadFile({
                        bucketName : config.S3_BUCKET_NAME,
                        key : `products/${productId}/photo-${index + 1}`,
                        body : data,
                        contentType : element.mimetype,
                    });

                    return ({
                        secure_url : await upload.Location,
                    });
                })
            );

            const imgArray = await imgArrayResponse;

            const product = await Product.create({
                _id : productId,
                photos : imgArray,
                ...fields,
            });

            if(!product){
                throw new CustomError("Product was not Created.", 400);

                // Remove Image From AWS Code .....
            };

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

    const products = await Product.find({});
    
    if(!products) {
         throw new CustomError("No Product was Found",404);
    };

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

export const getProductById = asyncHandler (async (_req, res) => {

    const {id : productId} = req.params;

    const products = await Product.findById(productId);

    if(!products) {
         throw new CustomError("No Product was Found",404);
    };

    res.status(201).json({
        success : true,
        products
    });
});








