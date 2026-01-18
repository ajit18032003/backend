const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const test = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio');
        console.log('Connected successfully');
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err.message);
        process.exit(1);
    }
};

test();
