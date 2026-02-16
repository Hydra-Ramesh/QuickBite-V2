import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const schema = Joi.object({
    PORT: Joi.number().default(5000),
    NODE_ENV: Joi.string().valid("development", "production").default("development"),
    MONGODB_URI: Joi.string().required(),
    JWT_SECRET: Joi.string().min(32).required(),
    JWT_SECRET_EXPIRES_IN: Joi.string().default("7d"),
    GOOGLE_CLIENT_ID: Joi.string().required(),
    GOOGLE_CLIENT_SECRET: Joi.string().required(),
    CLIENT_URL: Joi.string().required(),
}).unknown();

const {value, error} = schema.validate(process.env);
if (error){
    throw new Error(`Config validation error: ${error.message}`);
}

export default value;