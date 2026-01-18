const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }, // e.g., Frontend, Backend, Tools
    level: { type: Number, required: true, min: 0, max: 100 },
    icon: { type: String } // optional icon name or URL
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
