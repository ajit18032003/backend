const bcrypt = require('bcryptjs');

const testBcrypt = async () => {
    try {
        console.log('Testing bcrypt...');
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('test', salt);
        console.log('Hash:', hash);
        const match = await bcrypt.compare('test', hash);
        console.log('Match:', match);
        process.exit(0);
    } catch (err) {
        console.error('Bcrypt failed:', err.message);
        process.exit(1);
    }
};

testBcrypt();
