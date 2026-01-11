import { Router, Request, Response } from 'express';
import OpenAI from 'openai';

import { RECIPE_CONFIG } from '../constants';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/match', async (req: Request, res: Response) => {
  try {
    const { ingredients } = req.body;

    const precision = (req.query.precision as string) || RECIPE_CONFIG.PRECISION_MODES.MEDIUM;
    const maxTime = (req.query.maxPrepTime as string) || RECIPE_CONFIG.PREP_TIME_OPTIONS.ANY;
    // Map human terms to OpenAI temperature
    const tempMap: Record<string, number> = {
      high: 0.2, // Very strict, sticks to your list
      medium: 0.7, // Balanced
      low: 1.0, // Very creative, suggests exotic matches
    };
    const temperature = tempMap[precision] || 0.7;

    // Clamp the limit between 1 and 5
    let recipesLimit = parseInt(req.query.limit as string) || RECIPE_CONFIG.DEFAULT_LIMIT;
    recipesLimit = Math.max(RECIPE_CONFIG.LIMIT_RANGE.MIN, Math.min(recipesLimit, RECIPE_CONFIG.LIMIT_RANGE.MAX));

    const cuisine = req.query.cuisine || 'any';

    // Check if it exists, is an array, AND has at least one item
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        error: 'Missing ingredients',
        message: 'Please provide at least one ingredient to generate recipes.',
      });
    }

    // Limit the maximum number of ingredients to prevent API abuse
    if (ingredients.length > RECIPE_CONFIG.MAX_INGREDIENTS) {
      return res.status(400).json({
        error: 'Too many ingredients',
        message: `Please limit your list to ${RECIPE_CONFIG.MAX_INGREDIENTS} ingredients for the best results.`,
      });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: temperature, // <--- Apply the precision here
      messages: [
        {
          role: 'system',
          content: `You are a Master Chef. Generate exactly ${recipesLimit} recipes based on the provided ingredients.
          The prepTime for all recipes MUST be ideally under or around ${maxTime}
          Rules:
          - matchPercentage: Calculate based on how many provided ingredients are used vs total needed for the dish.
          - origin: Specify the country or region of the dish.
          - youtubeUrl: Provide a direct search link: https://www.youtube.com/results?search_query=[dish+name+recipe].
          - id: Generate a unique short string ID (e.g., 'rec_01').
          - Strictness: If precision is high, stick strictly to the ingredients provided.`,
        },
        {
          role: 'user',
          content: `Ingredients: ${ingredients.join(', ')}`,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'recipe_suggestions',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              recipes: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    matchPercentage: { type: 'number' },
                    prepTime: { type: 'string' },
                    origin: { type: 'string' },
                    description: { type: 'string' },
                    ingredientsRequired: { type: 'array', items: { type: 'string' } },
                    instructions: { type: 'array', items: { type: 'string' } },
                    youtubeUrl: { type: 'string' },
                  },
                  required: [
                    'id',
                    'title',
                    'matchPercentage',
                    'prepTime',
                    'origin',
                    'description',
                    'ingredientsRequired',
                    'instructions',
                    'youtubeUrl',
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ['recipes'],
            additionalProperties: false,
          },
        },
      },
    });

    const aiContent = response.choices[0].message.content;
    res.json(aiContent ? JSON.parse(aiContent) : { recipes: [] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

export default router;
