import axios from 'axios';

const testReviewAPI = async () => {
    const API_URL = 'http://localhost:5001/api';

    try {
        console.log('Testing review creation...\n');

        // First, login to get token
        console.log('1. Logging in as test user...');
        const loginResponse = await axios.post(`${API_URL}/users/login`, {
            email: 'test@example.com', // Replace with actual user email
            password: 'test123' // Replace with actual password
        });

        const token = loginResponse.data.token;
        console.log('✅ Login successful, got token\n');

        // Try to create review
        console.log('2. Creating review...');
        const reviewData = {
            rating: 4,
            comment: 'This is a test review comment with more than 5 characters',
            title: 'Test Movie Title',
            poster_path: '/test-poster.jpg'
        };

        console.log('Sending:', reviewData);

        const reviewResponse = await axios.post(
            `${API_URL}/movies/1084242/reviews`,
            reviewData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Review created successfully!');
        console.log('Response:', reviewResponse.data);

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        console.error('Headers:', error.response?.headers);

        if (error.response?.data?.errors) {
            console.error('Validation errors:', error.response.data.errors);
        }
    }
};

testReviewAPI();
