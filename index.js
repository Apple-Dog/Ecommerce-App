import mongoose from "mongoose";
import app from "./app.js";
import  config  from "./config/env.config.js";

// Self Invoking Function For Database Connection
(async () => {
    // Runs As soon as the app starts
    try {

       await mongoose.connect(config.MONGODB_URL);
        console.log("Connected to Database Successfully");

        app.on("error", (error)=>{
            console.log(error);
            throw error;
        });

        const onListening = () => {
            console.log(`Listening on PORT : ${config.PORT}`);
        };

        app.listen(config.PORT, onListening);
        
    } catch (error) {
        console.log ("ERROR", error);
        throw error;
    }
})();