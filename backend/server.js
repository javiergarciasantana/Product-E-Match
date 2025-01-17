import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import interactionRoutes from './routes/interactionRoutes.js';
import getRecommendations from './services/recommendationService.js';

const port = process.env.PORT || 5050;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/interactions', interactionRoutes);

app.post('/api/recommendations', async (req, res) => {
  const { apiUrl, targetName } = req.body;

  if (!apiUrl || !targetName) {
      res.status(400).json({ message: 'apiUrl and targetName are required' });
      return;
  }

  try {
      const recommendations = await getRecommendations(apiUrl, targetName);
      res.status(200).json({ success: true, recommendations });
  } catch (error) {
      console.error('Error generating recommendations:', error.message);
      res.status(500).json({ success: false, message: error.message });
  }
});

// Sirve el frontend en producción
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
