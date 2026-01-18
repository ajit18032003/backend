const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.error("Please ensure MongoDB is running locally on port 27017 or check your MONGO_URI.");
        // process.exit(1); // Do not exit, allow server to run for other routes
    }
};

module.exports = connectDB;
