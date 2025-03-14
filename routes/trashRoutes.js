import express from 'express';
import Trash from '../models/Trash.js';

const router = express.Router();

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