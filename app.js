import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

//Initializing Express
const app = express();


//Middleware's
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());
app.use(cookieParser());

//Morgan Logger
app.use(morgan("tiny"));


export default app;