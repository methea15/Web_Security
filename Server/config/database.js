//codesistency--bootcamp
import mongoose from "mongoose"

export const database = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB is connected: ${con.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); //1 failed, 0 success
    }
}