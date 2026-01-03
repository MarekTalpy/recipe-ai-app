import { Router, Request, Response } from 'express';
import multer from 'multer';

import OpenAI from 'openai';
import { Ingredient } from '../types';

const router = Router();

// Configure multer to store files in memory for processing
const upload = multer({ storage: multer.memoryStorage() });

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/ingredients/detect
router.post('/detect', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Mock logic: If the file name contains "blur", simulate an error
    if (req.file.originalname.includes('blur')) {
      return res.status(422).json({
        error: 'Image too blurry',
        suggestion: 'Please try taking the photo again in better lighting.',
      });
    }

    // Convert image buffer to base64
    const base64Image = req.file.buffer.toString('base64');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a kitchen assistant. Identify ingredients from images and return them as structured JSON.',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'What ingredients are in this photo?' },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: 'low', // 'low' saves tokens/money and is usually enough for food!
              },
            },
          ],
        },
      ],

      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'ingredient_detection',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              ingredients: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    confidence: { type: 'number' },
                  },
                  required: ['name', 'confidence'],
                  additionalProperties: false,
                },
              },
            },
            required: ['ingredients'],
            additionalProperties: false,
          },
        },
      },
    });

    // Parse the AI response
    const aiContent = response.choices[0].message.content;
    const result = aiContent ? JSON.parse(aiContent) : { ingredients: [] };

    // SORTING LOGIC: High Confidence -> Low Confidence
    if (result.ingredients && Array.isArray(result.ingredients)) {
      result.ingredients.sort((a: Ingredient, b: Ingredient) => b.confidence - a.confidence);
    }

    res.json(result);
  } catch (error: any) {
    console.error('OpenAI Error:', error.message);
    res.status(500).json({ error: 'AI failed to process image' });
  }
});

export default router;
