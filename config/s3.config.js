import aws from "aws-sdk";
import config from "../config/env.config.js";

//AWS S3 Bucket Config File
const s3 = new aws.S3({
    accessKeyId : config.S3_ACCESS_KEY,
    secretAccessKey: config.S3_SECRET_ACCESS_KEY,
    region: config.S3_REGION,
});

export default s3;
