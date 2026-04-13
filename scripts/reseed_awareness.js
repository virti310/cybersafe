const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:3000/api';

const newAwarenessContent = [
    {
        title: 'Phishing 101: Spot the Bait',
        content: 'Learn how to identify suspicious emails and links that try to steal your credentials.',
        image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?fm=jpg&w=1200&q=100'
    },
    {
        title: 'Password Strength Matters',
        content: 'Why "password123" is not enough and how to create complex, memorable passphrases.',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?fm=jpg&w=1200&q=100'
    },
    {
        title: 'Social Engineering Attacks',
        content: 'Understanding how attackers manipulate human psychology to gain unauthorized access.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?fm=jpg&w=1200&q=100'
    },
    {
        title: 'To Click or Not to Click',
        content: 'Best practices for handling attachments and links from unknown sources.',
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?fm=jpg&w=1200&q=100'
    },
    {
        title: 'Mobile Device Security',
        content: 'Securing your smartphones and tablets against theft and malware.',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?fm=jpg&w=1200&q=100'
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
