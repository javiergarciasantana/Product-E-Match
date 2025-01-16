import express from 'express';
import {
  logInteraction,
  getUserInteractions,
  getRecommendations,
  deleteInteraction,
} from '../controllers/interactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/log', protect, logInteraction); // Registrar una nueva interacción
router.get('/user-interactions', protect, getUserInteractions); // Obtener interacciones del usuario
router.get('/recommendations', protect, getRecommendations); // Obtener recomendaciones
router.delete('/user-interactions/:id', protect, deleteInteraction); // Eliminar una interacción

export default router;
