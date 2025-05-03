import dotenv from "dotenv";
import connectDB from "./db/index.database.js";
import { app } from "./app.js";


connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running at Port : ${process.env.PORT}`);
    });
    app.on("err", (err) => {
      console.log("Error connecting to MONGO DB !!", err)
      throw err
    }
    )
  })
  
  .catch((err) => {
    console.log("Connection to the database failed", err);
  });

dotenv.config({
  path: "./.env",
});

/*
import express from 'express';
const app = express();
(async ()  => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on('error', (err) => {
            console.error('Error connecting to MongoDB', err);
            throw err;
        }
        )
        app.listen(process.env.PORT, () => {
          console.log(`App is listening on port ${process.env.PORT}`)
        }
        )
    } catch (error) {
        console.error('Error connnection to mongoDB', error);
        throw error;
    }
})();


*/
