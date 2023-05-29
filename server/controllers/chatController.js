import mongoose from "mongoose";
import chatModel from "../models/chatModel.js";

export const chatPostController = async (req, res) => {
  try {
    const { text, name, id, socketID } = req.body;
    const message = await new chatModel({
      text,
      name,
      id,
      socketID,
    }).save();
    return res.send({
      success: true,
      message: message,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "error in adding message to db",
    });
  }
};
export const chatGetController=async(req,res)=>{
    try {
        let messages=await chatModel.find({});
        res.json({
            success:true,
            message:messages
        })
    } catch (error) {
        console.log(error);
        res.send({
            success:false,
            message:'failed to get result'
        })
    }
}