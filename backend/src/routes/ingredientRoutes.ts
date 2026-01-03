import { Router, Request, Response } from 'express';
import multer from 'multer';

const router = Router();

import { IngredientRecognitionResponse } from '../types';

// Configure multer to store files in memory for processing
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/ingredients/detect
router.post('/detect', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // --- STEP: SEND TO AI ---
    // Here we would eventually send req.file.buffer to the AI API.
    // For now, let's simulate a professional AI response.

    console.log(`Received image: ${req.file.originalname}`);

    const mockResponse: IngredientRecognitionResponse = {
      requestId: Date.now().toString(),
      ingredients: [
        { name: 'Tomato', confidence: 0.98, category: 'Vegetable' },
        { name: 'Onion', confidence: 0.95, category: 'Vegetable' },
        { name: 'Chicken Breast', confidence: 0.92, category: 'Meat' },
        { name: 'Garlic', confidence: 0.88, category: 'Spice' },
      ],
    };

    // Simulate network delay for AI processing
    setTimeout(() => {
      res.json(mockResponse);
    }, 1500);
  } catch (error) {
    console.error('AI Recognition Error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

export default router;
