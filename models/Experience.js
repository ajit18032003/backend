const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    duration: { type: String, required: true }, // e.g., "Jan 2020 - Present"
    description: [{ type: String }],
    technologies: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
