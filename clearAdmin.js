const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const clearAdmin = async () => {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db();
        const users = db.collection('users');

        const result = await users.deleteMany({});
        console.log(`Deleted ${result.deletedCount} users. The database is now ready for First Time Setup.`);

    } catch (err) {
        console.error('Clear failed:', err.message);
    } finally {
        await client.close();
        process.exit();
    }
};

clearAdmin();
