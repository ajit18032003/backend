const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const auth = require('../middleware/authMiddleware');

// GET all experience (Public)
router.get('/', async (req, res) => {
    try {
        const experiences = await Experience.find().sort({ createdAt: -1 });
        res.json(experiences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST an experience (Protected)
router.post('/', auth, async (req, res) => {
    const experience = new Experience(req.body);
    try {
        const newExperience = await experience.save();
        res.status(201).json(newExperience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT (Update) an experience (Protected)
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedExperience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedExperience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE an experience (Protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        await Experience.findByIdAndDelete(req.params.id);
        res.json({ message: 'Experience deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
