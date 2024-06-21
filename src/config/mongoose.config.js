// package imports
import mongoose from "mongoose";

// setting the mongodb url
const URL = process.env.DB_URL;

/**
 * To connect the mongodb
 */
export const connectToDb = async () => {
  try {
    // connecting to db
    await mongoose.connect(URL);
    /* deprecated */ // await mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true});

    console.log("Connected to mongodb database");
  } catch (error) {
    console.log(error);
  }
};
