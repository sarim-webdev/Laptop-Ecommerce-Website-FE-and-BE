import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "PORT",
  "MONGODB_URI",
  "JWT_SECRET_KEY",
  "CLIENT_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "EMAIL_USER",
  "EMAIL_PASS",
];

const missingVariables = requiredEnvVariables.filter(
  (variable) => !process.env[variable]
);

if (missingVariables.length > 0) {
  console.error(
    `Missing environment variables: ${missingVariables.join(", ")}`
  );

  process.exit(1);
}

const env = {
  port: Number(process.env.PORT),

   nodeEnv: process.env.NODE_ENV,

  mongodbUri: process.env.MONGODB_URI,

  jwtSecretKey: process.env.JWT_SECRET_KEY,

  clientUrl: process.env.CLIENT_URL,

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  email: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
  },
};

export default env;