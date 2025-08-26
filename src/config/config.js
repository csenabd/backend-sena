require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "dev",
  port: process.env.APP_PORT,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbName: process.env.DB_NAME,
  secretjwt: process.env.SECRET_JWT,
  dbNameCloud: process.env.DB_NAMECLOUD,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  addressEmail: process.env.ADDRESS_EMAIL,
  passwordEmail: process.env.PASSWORD_EMAIL,
  hostback: process.env.HOSTBACK,
};

module.exports = config;
