require('dotenv').config();
const mongoose = require("mongoose");
const {
  dbHost,
  dbPort,
  dbName,
  dbNameCloud,
  dbUsername,
  dbPassword,
} = require("../config/config");

// Construir URIs en orden de preferencia: MONGODB_URI (env) -> cloud uri from config -> local
const DB_URICLOUD = dbUsername && dbPassword && dbNameCloud
  ? `mongodb+srv://${dbUsername}:${dbPassword}@${dbNameCloud}.pkkyfqz.mongodb.net/${dbNameCloud}?retryWrites=true&w=majority`
  : null;

const DB_URI_LOCAL = dbHost && dbPort && dbName
  ? `mongodb://${dbHost}:${dbPort}/${dbName}`
  : `mongodb://localhost:27017/${dbName || 'cloud'}`;

const DB_URIPRUEBA = `mongodb+srv://senabd:12345sena@cluster0.u5gwxx4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const uri = process.env.MONGODB_URI || DB_URICLOUD || DB_URIPRUEBA || DB_URI_LOCAL;

const connect = async () => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log("DB CONNECT!!!!!");
  } catch (error) {
    console.error(`Error en la conexion: ${error.message}`);
    throw error;
  }
};

module.exports = connect;
