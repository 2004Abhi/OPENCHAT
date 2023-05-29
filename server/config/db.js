import mongoose from "mongoose";

const connectMongo=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDb connected');
    } catch (error) {
        console.log(error);
    }
}
export default connectMongo ; 