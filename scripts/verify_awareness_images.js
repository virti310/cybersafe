const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:3000/api';

async function verifyAwareness() {
    try {
        const response = await axios.get(`${API_URL}/awareness`);
        const articles = response.data;

        console.log(`Found ${articles.length} articles.`);

        articles.forEach(article => {
            console.log(`- Title: ${article.title}`);
            console.log(`  Image: ${article.image ? 'Present (' + article.image.substring(0, 30) + '...)' : 'MISSING'}`);
        });

    } catch (error) {
        console.error('Error fetching awareness:', error.message);
    }
}

verifyAwareness();
