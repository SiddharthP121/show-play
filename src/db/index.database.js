import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
   const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
   console.log(`Database Connected !! DB Host name: ${connectionInstance.connection.host}`)
   
  } catch (error) {
    console.error('Error connecting Database', error)
  }  
  
}
export default connectDB;
