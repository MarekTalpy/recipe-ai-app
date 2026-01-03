import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import ingredientRoutes from './routes/ingredientRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT ?? 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/', (req: Request, res: Response) => {
  res.send('Recipe AI Backend is running!');
});

// Placeholder for future routes
app.use('/api/ingredients', ingredientRoutes);
// app.use('/api/recipes', recipesRoutes);

app.listen(PORT, () => {
  console.log(`Server is sprinting on http://localhost:${PORT}`);
});
