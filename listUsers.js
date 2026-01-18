const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio');
        const users = await User.find({});
        console.log('USERS IN DB:', JSON.stringify(users, null, 2));
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('List failed:', err.message);
        process.exit(1);
    }
};

listUsers();
