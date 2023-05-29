import express from 'express';
import { chatGetController, chatPostController } from '../controllers/chatController.js';

//router object
const router=express.Router();

//routing
//message get
router.post("/chat",chatPostController);
router.get("/chat",chatGetController)

export default router;