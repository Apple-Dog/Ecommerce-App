import Collection from "../models/collection.Schema"
import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";




/******************************************************
 * @CREATE_COLLECTION
 * @REQUEST_TYPE POST
 * @Route http://localhost:4000/api/collection/create
 * @Description Create a New Collection in the Database
 * @Parameters name
 * @Returns Collection Object
 ******************************************************/

export const createCollection = asyncHandler(async (req,res)=>{

     // Grab Name from Frontend
    const {name} = req.body;

    // Validate Whether "name" is Empty or Not.
    if(!name){
        throw new CustomError("Collection Name is Requied",400);
    };

    // Creating New Collection Name Entry in the Database
    const collection = await Collection.create({name});

    // Sending Response if Collection Name Entry gets Sucessfully Created in the Database
    res.status.json({
        success : true,
        message : "Collection Created Successfully",
        collection, 
    });

    // Unsetting collection to Free Up Space from the Memory
    collection.remove();

});




/******************************************************
 * @UPDATE_COLLECTION
 * @REQUEST_TYPE POST
 * @Route http://localhost:4000/api/collection/update/:collectionId
 * @Description Update an Existing Collection in the Database based on ID of Collection  passed in URL
 * @Parameters id from URL, name
 * @Returns Collection Object
 ******************************************************/

export const updateCollection = asyncHandler(async (req,res)=>{

    // Grab ID From URL
    const {id : collectionId} = req.params;

    // Grab Name from Frontend
    const {name} = req.body;

    // Validate wether Name is Empty or Not.
    if(!name){
        throw new CustomError("Collection Name is Requied",400);
    };

    // Updating an Existing Collection in the Database
    const updatedCollection = await Collection.findByIdAndUpdate(
        {
            name,
        },

        {
            new : true,
            runValidators : true,
        }
    );
    
    // In Case Updating an Existing Collection Fails then Throw Error
    if(!updatedCollection){
        throw new CustomError("Collection Not Found",404);
    };

    // Sending Response if Collection Name gets Updated Sucessfully in the Database
    res.status.json({
        success : true,
        message : "Collection Updated Successfully",
        updateCollection, 
    });

    // Unsetting updateCollection to Free Up Space from the Memory
    updateCollection.remove();

});




/******************************************************
 * @DELETE_COLLECTION
 * @REQUEST_TYPE POST
 * @Route http://localhost:4000/api/collection/delete/:collectionId
 * @Description Delete an Existing Collection in the Database based on ID of Collection  passed in URL
 * @Parameters id from URL
 * @Returns Collection Object
 ******************************************************/

export const deleteCollection = asyncHandler(async (req,res)=>{

    // Grab ID From URL
    const {id : collectionId} = req.params;

    // Delete an Existing Collection in the Database.
    const deletedCollection = await Collection.findByIdAndDelete(collectionId);

    // In Case Deleting an Existing Collection Fails then Throw Error
    if(!deletedCollection){
        throw new CustomError("Collection Not Found",404);
    };

    // Sending Response if Collection Name gets Deleted Sucessfully in the Database
    res.status.json({
        success : true,
        message : "Collection Updated Successfully",
        deletedCollection, 
    });

    // Unsetting deleteCollection to Free Up Space from the Memory
    deleteCollection.remove();

});




/******************************************************
 * @GET_ALL_COLLECTIONS
 * @REQUEST_TYPE GET
 * @Route http://localhost:4000/api/collection/all
 * @Description Gets the List of Collections
 * @Parameters None
 * @Returns Collection Object
 ******************************************************/

export const getAllCollections = asyncHandler(async (_req,res)=>{

    // Gets A List Of Collections and Store in "collection".
    const collections = await Collection.find();

    // Validate Whether "Collection" is Empty or Not.
    if(!collections){
        throw new CustomError("No Collection Found",404);
    };

    // Sending Response if Collections List gets Sucessfully Fetched from the Database
    res.status.json({
        success : true,
        message : "Collection Updated Successfully",
        collections, 
    });

    // Unsetting collection to Free Up Space from the Memory
    collections.remove();
});