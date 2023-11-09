import mongoose from "mongoose";
import config from "../configuration/envConfig.js"

export const URI = config.MONGO.URI
const dbConect = () => {
    try {
        mongoose.connect( URI);
        console.log('La coneccion a la base de datos fue exitosa');
    } catch (error) {
        console.log(error);
    }
    console.log(URI);
};

export default dbConect;