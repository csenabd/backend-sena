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

const DB_URICLOUD = `mongodb+srv://${dbUsername}:${dbPassword}@${dbNameCloud}.pkkyfqz.mongodb.net/`;
const DB_URI = `mongodb://localhost:27017/${dbName}`;
//const DB_URI = `mongodb://${dbHost}:${dbPort}/${dbName}`;
const DB_URIPRUEBA=`mongodb+srv://senabd:12345sena@cluster0.u5gwxx4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
//const DB_URIPRUEBA=`mongodb+srv://mfvargas493:1234mafe@cluster0.ldo3olk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
//const DB_URIPRUEBA=`mongodb+srv://jeankyt06:CloudSena@cloud.2qnbc5r.mongodb.net/?retryWrites=true&w=majority&appName=Cloud`
//Cambiar la URI de la base de datos a la que se va a conectar

const connect = async () => {
  try {
    mongoose.connect(DB_URIPRUEBA,{
      connectTimeoutMS: 20000,
      socketTimeoutMS: 45000,
    })
    console.log("DB CONNECT!!!!!");
  } catch (error) {
    console.error(`Error en la conexion: ${error.message}`);
    process.exit(1);
    //console.log(`Error en la conexion: ${error}`);
  }
};

module.exports = connect;
