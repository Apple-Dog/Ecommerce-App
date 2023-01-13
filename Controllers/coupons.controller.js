/**********************************************************
 * @CREATE_COUPON
 * @REQUEST_TYPE POST
 * @Route https://localhost:5000/api/coupon
 * @Description 1. Controller used for creating a new coupon
 *              2. Only admin and Moderator can create the coupon
 * @Parameters code, discount
 * @Returns Coupon Object with success message "Coupon Created SuccessFully"
 *********************************************************/


/**********************************************************
 * @DEACTIVATE_COUPON
 * @REQUEST_TYPE GET
 * @Route https://localhost:5000/api/coupon/deactive/:couponId
 * @Description 1. Controller used for deactivating the coupon
 *              2. Only admin and Moderator can update the coupon
 * @Parameters ID
 * @Returns Coupon Object with success message "Coupon Deactivated SuccessFully"
 *********************************************************/


/**********************************************************
 * @DELETE_COUPON
 * @REQUEST_TYPE GET
 * @Route https://localhost:5000/api/coupon/:couponId
 * @Description 1. Controller used for deleting the coupon
 *              2. Only admin and Moderator can delete the coupon
 * @Parameters ID
 * @Returns Success Message "Coupon Deleted SuccessFully"
 *********************************************************/



/**********************************************************
 * @GET_ALL_COUPONS
 * @REQUEST_TYPE GET
 * @Route https://localhost:5000/api/coupon
 * @Description 1. Controller used for getting all coupons details
 *              2. Only admin and Moderator can get all the coupons
 * @Parameters ID
 * @Returns allCoupons Object
 *********************************************************/
