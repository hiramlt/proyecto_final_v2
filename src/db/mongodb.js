import mongoose from 'mongoose';
import config from '../config/config.js';

export const initDB = async () => {
  try {
    await mongoose.connect(config.mongo_uri);
    console.log("Database connected ✅");
  } catch (error) {
    console.error("Ocurrio un error al conectar base de datos");
  }
};
