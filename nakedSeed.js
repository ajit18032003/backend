const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const nakedSeed = async () => {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();
        const users = db.collection('users');

        const existing = await users.findOne({ username: 'admin' });
        if (existing) {
            console.log('Admin exists');
        } else {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await users.insertOne({
                username: 'admin',
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log('Admin created: admin / admin123');
        }
    } catch (err) {
        console.error('Naked seed failed:', err.message);
    } finally {
        await client.close();
        process.exit();
    }
};

nakedSeed();
