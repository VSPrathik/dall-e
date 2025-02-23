import express from 'express';
import * as dotenv from 'dotenv'; 
dotenv.config();
import fetch from 'node-fetch';
import { body, validationResult } from 'express-validator';

dotenv.config();

const router = express.Router();


router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from DALL-E!' });
});

router.route('/').post(
  [
    body('prompt')
      .notEmpty()
      .withMessage('Prompt is required')
      .isLength({ max: 1000 })
      .withMessage('Prompt must be less than 1000 characters')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    try {
      const { prompt } = req.body;
      console.log('Generating image for prompt:', prompt);

    const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=42&model=flux&api_key=${process.env.OPENAI_API_KEY}`;

    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    const image = buffer.toString('base64');
    console.log('Image generated successfully');
    res.status(200).json({ 
      success: true,
      photo: image 
    });
  } catch (error) {
    console.error('Error generating image:', error);
    console.log('Request body:', req.body); // Log the request body for debugging
    const errorMessage = error?.response?.data?.error?.message || 'Something went wrong';
    res.status(500).json({ 
      success: false,
      message: errorMessage 
    });
  }
});

export default router;
