import Coupon from "../models/coupon.Schema.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";



/**********************************************************
 * @CREATE_COUPON
 * @REQUEST_TYPE POST
 * @Route https://localhost:5000/api/coupon
 * @Description 1. Controller used for creating a new coupon
 *              2. Only admin and Moderator can create the coupon
 * @Parameters code, discount
 * @Returns Coupon Object with success message "Coupon Created SuccessFully"
 *********************************************************/

export const createCoupon = asyncHandler (async (req, res) => {

    // Grab Code and Discount from the Frontend
    const { code, discount } = req.body;

    // Validate if code and discount exits
    if(!code || !discount){
        throw new CustomError("Please Fill All Fields",400);
    };

    // Check If Coupon Code already Exists
    const existingCoupon = await Coupon.findOne({code});

    if(existingCoupon){
        throw new CustomError("Coupon Already Exists.",400);
    };

    // Creating New Coupon Entry in the Database
    const coupon = await Coupon.create({
        code,
        discount,
        active,
    });

    // Sending Response if Coupon Entry gets Sucessfully Created in the Database
    res.status(200).json({
        success : true,
        message : "Coupon Created Successfully",
        coupon,
    });

    // Unsetting coupon, existingCoupon to Free Up Space from the Memory
    existingCoupon.remove();
    coupon.remove();

});






/**********************************************************
 * @DEACTIVATE_COUPON
 * @REQUEST_TYPE GET
 * @Route https://localhost:5000/api/coupon/deactive/:couponId
 * @Description 1. Controller used for deactivating the coupon
 *              2. Only admin and Moderator can update the coupon
 * @Parameters ID
 * @Returns Coupon Object with success message "Coupon Deactivated SuccessFully"
 *********************************************************/

export const deactivateCoupon = asyncHandler (async (req, res) => {

    // Grab Coupon ID from URL
    const { couponId } = req.params;

    // Check whether Coupon Exist in the Database or Not (Check For Valid Coupon)
    const coupon = await Coupon.findOne({_id : couponId});

    if(!coupon){
        throw new CustomError("Coupon does not Exists",404);
    };

    // Check whether Coupon already Deactivated or Not (Check For Valid Coupon)
    if (coupon.active === false){
        throw new CustomError("Coupon already Deactivated",404);
    };

    // Setting Coupon to Deactive State & Save it in the Database
    const active = false;

    const deactivatedCoupon = await Collection.findByIdAndUpdate(
        couponId,
        {
            active,
        },

        {
            new : true,
            runValidators : true,
        }
    );

    // Sending Response if Coupon Deactivated Sucessfully Created in the Database
    res.status(200).json({
        success : true,
        message : "Coupon Deactivated Successfully",
        deactivatedCoupon,
    });

    // Unsetting coupon, deactivatedCoupon to Free Up Space from the Memory
    coupon.remove();
    deactivatedCoupon.remove();

}); 






/**********************************************************
 * @DELETE_COUPON
 * @REQUEST_TYPE DELETE
 * @Route https://localhost:5000/api/coupon/:couponId
 * @Description 1. Controller used for deleting the coupon
 *              2. Only admin and Moderator can delete the coupon
 * @Parameters ID
 * @Returns Success Message "Coupon Deleted SuccessFully"
 *********************************************************/

export const deleteCoupon = asyncHandler (async (req, res) => {

    // Grab Coupon ID from URL
    const { couponId } = req.params;

    // Delete an Existing Collection in the Database.
    const deletedCoupon = await Coupon.findByIdAndDelete({_id : couponId});

    if(!deletedCoupon){
        throw new CustomError("Coupon does not Exists",404);
    };

    // Sending Response if Coupon Deactivated Sucessfully Created in the Database
    res.status(200).json({
        success : true,
        message : "Coupon Deleted Successfully",
        deletedCoupon,
    });

    // Unsetting deletedCoupon to Free Up Space from the Memory
    deletedCoupon.remove();

}); 







/**********************************************************
 * @GET_ALL_COUPONS
 * @REQUEST_TYPE GET
 * @Route https://localhost:5000/api/coupon
 * @Description 1. Controller used for getting all coupons details
 *              2. Only admin and Moderator can get all the coupons
 * @Parameters ID
 * @Returns allCoupons Object
 *********************************************************/


export const getAllCoupons = asyncHandler (async (req, res) => {
    
    // Gets A List Of Coupons and Store in "allCoupons".
    const allCoupons = await Collection.find();

    // Validate Whether "allCoupons" is Empty or Not.
    if(!allCoupons){
        throw new CustomError("No Coupons Found",404);
    };

    // Sending Response if Coupon List gets Sucessfully Fetched from the Database
    res.status.json({
        success : true,
        message : "Fetched All Coupons Successfully",
        allCoupons, 
    });

    // Unsetting allCoupons to Free Up Space from the Memory
    allCoupons.remove();
});

