const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Certificate = require('./models/Certificate');

dotenv.config();

const seedCertificate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding');

        const testCert = new Certificate({
            title: 'link test - certificate name',
            issuer: 'Test Issuer',
            date: '2024',
            link: '#'
        });

        await testCert.save();
        console.log('Test certificate added successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding certificate:', error);
        process.exit(1);
    }
};

seedCertificate();
