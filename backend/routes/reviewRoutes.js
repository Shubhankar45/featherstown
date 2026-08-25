import express from "express";
import { addReview, getReviews } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", addReview);
router.get("/", getReviews);

export default router;