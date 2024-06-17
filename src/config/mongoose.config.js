// package imports
import mongoose from "mongoose";

// setting the mongodb url
const URL = process.env.DB_URL;

/**
 * To connect the mongodb
 */
export const connectToDb = async () => {
  try {
    await mongoose.connect(URL);
    console.log("Connected to mongodb database");
    /* deprecated */
    // await mongoose.connect(URL, {useNewUrlParser: true, useUnifiedTopology: true});
  } catch (error) {
    console.log(error);
  }
};
