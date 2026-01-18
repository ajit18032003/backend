const axios = require('axios');

const testLogin = async () => {
    try {
        console.log('Testing admin login with new credentials...');
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            username: 'Ajit1234',
            password: 'Ajit@1234'
        });

        console.log('✅ LOGIN SUCCESSFUL!');
        console.log('Token:', response.data.token);
        console.log('Username:', response.data.username);
    } catch (error) {
        console.log('❌ LOGIN FAILED!');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Message:', error.response.data.message);
        } else {
            console.log('Error:', error.message);
        }
    }
};

testLogin();
