const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:3000/api';

const newAwarenessContent = [
    {
        title: 'Phishing 101: Spot the Bait',
        content: 'Learn how to identify suspicious emails and links that try to steal your credentials.',
        image: 'https://placehold.co/600x400/e74c3c/ffffff?text=Phishing+Alert'
    },
    {
        title: 'Password Strength Matters',
        content: 'Why "password123" is not enough and how to create complex, memorable passphrases.',
        image: 'https://placehold.co/600x400/3498db/ffffff?text=Secure+Passwords'
    },
    {
        title: 'Social Engineering Attacks',
        content: 'Understanding how attackers manipulate human psychology to gain unauthorized access.',
        image: 'https://placehold.co/600x400/9b59b6/ffffff?text=Social+Engineering'
    },
    {
        title: 'To Click or Not to Click',
        content: 'Best practices for handling attachments and links from unknown sources.',
        image: 'https://placehold.co/600x400/f1c40f/333333?text=Malicious+Links'
    },
    {
        title: 'Mobile Device Security',
        content: 'Securing your smartphones and tablets against theft and malware.',
        image: 'https://placehold.co/600x400/2ecc71/ffffff?text=Mobile+Security'
    }
];

async function updateAwareness() {
    console.log('Starting Awareness update...');

    try {
        // 1. Get existing articles
        console.log('Fetching existing articles...');
        const response = await axios.get(`${API_URL}/awareness`);
        const existingArticles = response.data;

        // 2. Delete existing articles
        if (existingArticles.length > 0) {
            console.log(`Found ${existingArticles.length} articles. Deleting...`);
            for (const article of existingArticles) {
                await axios.delete(`${API_URL}/awareness/${article.id}`);
                console.log(`- Deleted article ID: ${article.id}`);
            }
        } else {
            console.log('No existing articles found.');
        }

        // 3. Insert new articles with photos
        console.log('\nInserting new articles with photos...');
        for (const item of newAwarenessContent) {
            await axios.post(`${API_URL}/awareness`, item);
            console.log(`+ Added article: ${item.title}`);
        }

        console.log('\nUpdate complete! Images added.');

    } catch (error) {
        console.error('Error updating awareness:', error.message);
    }
}

updateAwareness();
