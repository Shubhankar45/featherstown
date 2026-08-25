import express from "express";
import { addSubscriber } from "../controllers/subscriberController.js";

const router = express.Router();

router.post("/", addSubscriber);

export default router;