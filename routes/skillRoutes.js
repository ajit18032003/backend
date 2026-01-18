const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const auth = require('../middleware/authMiddleware');

// GET all skills (Public)
router.get('/', async (req, res) => {
    try {
        const skills = await Skill.find().sort({ category: 1, name: 1 });
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a skill (Protected)
router.post('/', auth, async (req, res) => {
    const skill = new Skill(req.body);
    try {
        const newSkill = await skill.save();
        res.status(201).json(newSkill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT (Update) a skill (Protected)
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedSkill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a skill (Protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        await Skill.findByIdAndDelete(req.params.id);
        res.json({ message: 'Skill deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
