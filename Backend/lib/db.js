import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDB = async () =>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Database connected`);
        
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error.message}`);
        
    }
}

export { connectDB };