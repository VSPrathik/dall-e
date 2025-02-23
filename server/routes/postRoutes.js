import express from 'express';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { body, validationResult } from 'express-validator';

import Post from '../mongodb/models/post.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.route('/').get(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalPosts = await Post.countDocuments();
    
    res.status(200).json({ 
      success: true,
      data: posts,
      page,
      totalPages: Math.ceil(totalPosts / limit)
    });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch posts. Please try again later.' 
    });
  }
});

router.route('/').post(
  [
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 50 })
      .withMessage('Name must be less than 50 characters'),
    body('prompt')
      .notEmpty()
      .withMessage('Prompt is required')
      .isLength({ max: 1000 })
      .withMessage('Prompt must be less than 1000 characters'),
    body('photo')
      .notEmpty()
      .withMessage('Photo is required')
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
      const { name, prompt, photo } = req.body;
      console.log('Creating post for:', name);

      const photoUrl = await cloudinary.uploader.upload(photo, {
        folder: 'dalle_posts',
        resource_type: 'image'
      });

      const newPost = await Post.create({
        name,
        prompt,
        photo: photoUrl.secure_url,
      });

      console.log('Post created successfully:', newPost._id);
      res.status(201).json({ 
        success: true, 
        data: newPost 
      });
    } catch (err) {
      console.error('Error creating post:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to create post. Please try again later.' 
      });
    }
  }
);

export default router;
