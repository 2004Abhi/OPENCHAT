import mongoose from "mongoose";
const chatSchema=new mongoose.Schema({
    text:{
        type:String,
        trim:true,
    },
    name:{
        type:String,
        trim:true,
    },
    id:{
        type:String,
        trim:true,
    },
    socketID:{
        type:String,
        trim:true,
    }
},{
    timestamps:true
})
export default mongoose.model("chats",chatSchema)