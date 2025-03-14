import express from 'express';
import multer from 'multer';
import path from 'path';
import Trash from '../models/Trash.js';

const router = express.Router();

// Configure multer with file size limits and proper error handling
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images, audio files, and PDFs
    if (file.mimetype.startsWith('image/') || 
        file.mimetype.startsWith('audio/') || 
        file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// File upload route with error handling
router.post('/upload', (req, res) => {
    upload.single('file')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Multer error (e.g., file too large)
            return res.status(400).json({ message: `Upload error: ${err.message}` });
        } else if (err) {
            // Other errors
            return res.status(400).json({ message: err.message });
        }
        
        // No file uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Success - return file URL
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.json({ url: fileUrl });
    });
});

// Get all trash items for a user
router.get('/:userId', async (req, res) => {
  try {
    const items = await Trash.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new trash item
router.post('/', async (req, res) => {
  const trash = new Trash({
    userId: req.body.userId,
    name: req.body.name,
    blogText: req.body.blogText,
    image: req.body.image,
    voiceMail: req.body.voiceMail,
    pdf: req.body.pdf,
  });

  try {
    const newTrash = await trash.save();
    res.status(201).json(newTrash);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a trash item
router.delete('/:id', async (req, res) => {
  try {
    await Trash.findByIdAndDelete(req.params.id);
    res.json({ message: 'Trash deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;