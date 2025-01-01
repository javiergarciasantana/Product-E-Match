import express from 'express';
import { logInteraction, getUserInteractions, getRecommendations } from '../controllers/interactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/log', protect, logInteraction); // Log a new interaction
router.get('/user-interactions', protect, getUserInteractions); // Fetch user interactions
router.get('/recommendations', protect, getRecommendations);

export default router;
