import dotenv from "dotenv";

dotenv.config();

const config = {

    // JSON WEB TOKEN UTILITIES
    JWT_SECRET  : process.env.JWT_SECRET,
    JWT_EXPIRY : process.env.JWT_EXPIRY || "30d",

    // MONGO DB UTILITIES
    MONGODB_URL : process.env.MONGODB_URL,
    PORT : process.env.PORT, 

    // SMPT MAIL UTILITIES
    SMTP_MAIL_HOST : process.env.SMTP_MAIL_HOST,
    SMTP_MAIL_PORT : process.env.SMTP_MAIL_PORT,
    SMTP_MAIL_USERNAME : process.env.SMTP_MAIL_USERNAME,
    SMTP_MAIL_PASSWORD : process.env.SMTP_MAIL_PASSWORD,
    SMTP_MAIL_EMAIL : process.env.SMTP_MAIL_EMAIL,
    SMTP_MAIL_RESET_PASSWORD_SUBJECT : process.env.SMTP_MAIL_RESET_PASSWORD_SUBJECT,

    // AWS S3 UTILITIES
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_REGION: process.env.S3_REGION,

    // RAZORPAY UTILITIES
    RAZORPAY_KEY_ID : process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET : process.env.RAZORPAY_KEY_SECRET,
};

export default config;