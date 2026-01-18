const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');
const auth = require('../middleware/authMiddleware');

// GET all certificates (Public)
router.get('/', async (req, res) => {
    try {
        const certificates = await Certificate.find().sort({ createdAt: -1 });
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a certificate (Protected)
router.post('/', auth, async (req, res) => {
    const certificate = new Certificate(req.body);
    try {
        const newCertificate = await certificate.save();
        res.status(201).json(newCertificate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT (Update) a certificate (Protected)
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedCertificate = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCertificate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a certificate (Protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        await Certificate.findByIdAndDelete(req.params.id);
        res.json({ message: 'Certificate deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
