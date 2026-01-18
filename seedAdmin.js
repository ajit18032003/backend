const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        console.log('Attempting to seed admin...');
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';
        await mongoose.connect(uri);
        console.log('DB Connected for seeding');

        const count = await User.countDocuments();
        console.log(`Current users in DB: ${count}`);

        const existingAdmin = await User.findOne({ username: 'Ajit1234' });
        if (existingAdmin) {
            console.log('Admin user "Ajit1234" already exists.');
        } else {
            const admin = new User({
                username: 'Ajit1234',
                email: 'ajit@portfolio.com',
                mobile: '1234567890',
                password: 'Ajit@1234',
                isVerified: true  // Skip OTP verification for seeded admin
            });
            await admin.save();
            console.log('Initial Admin user created:');
            console.log('  Username: Ajit1234');
            console.log('  Password: Ajit@1234');
            console.log('  Email: ajit@portfolio.com');
        }

        const finalCount = await User.countDocuments();
        console.log(`Final users in DB: ${finalCount}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('SEED ERROR:', err.message);
        console.error(err.stack);
        process.exit(1);
    }
};

seedAdmin();
