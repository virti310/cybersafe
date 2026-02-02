const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:3000/api';

const newEmergencyContacts = [
    { team: 'Fire Department', priority: 'Critical', description: 'For fire emergencies and rescues.', availability: '24/7', phone: '911', email: 'fire@city.gov', location: 'Citywide' },
    { team: 'Ambulance Service', priority: 'Critical', description: 'Medical emergencies.', availability: '24/7', phone: '911', email: 'ems@city.gov', location: 'Citywide' },
    { team: 'Cyber Crime Unit', priority: 'High', description: 'Reporting digital crimes and fraud.', availability: 'Mon-Fri 8am-6pm', phone: '555-0199', email: 'cybercrime@police.gov', location: 'Police HQ' },
    { team: 'Poison Control', priority: 'High', description: 'Assistance with poisoning emergencies.', availability: '24/7', phone: '1-800-222-1222', email: 'help@poison.org', location: 'National' },
    { team: 'Suicide Prevention', priority: 'Critical', description: 'Support for mental health crises.', availability: '24/7', phone: '988', email: 'support@988lifeline.org', location: 'National' }
];

const awarenessWithPngImages = [
    {
        title: 'Phishing 101: Spot the Bait',
        content: 'Learn how to identify suspicious emails and links that try to steal your credentials.',
        image: 'https://placehold.co/600x400.png?text=Phishing+Alert'
    },
    {
        title: 'Password Strength Matters',
        content: 'Why "password123" is not enough and how to create complex, memorable passphrases.',
        image: 'https://placehold.co/600x400.png?text=Secure+Passwords'
    },
    {
        title: 'Social Engineering Attacks',
        content: 'Understanding how attackers manipulate human psychology to gain unauthorized access.',
        image: 'https://placehold.co/600x400.png?text=Social+Engineering'
    },
    {
        title: 'To Click or Not to Click',
        content: 'Best practices for handling attachments and links from unknown sources.',
        image: 'https://placehold.co/600x400.png?text=Malicious+Links'
    },
    {
        title: 'Mobile Device Security',
        content: 'Securing your smartphones and tablets against theft and malware.',
        image: 'https://placehold.co/600x400.png?text=Mobile+Security'
    }
];

async function fixData() {
    console.log('Starting data fix...');

    // 1. Insert Emergency Contacts
    console.log('\nInserting 5 Emergency Contacts...');
    for (const item of newEmergencyContacts) {
        try {
            await axios.post(`${API_URL}/emergency-contacts`, item);
            console.log(`+ Added contact: ${item.team}`);
        } catch (error) {
            console.error(`- Failed to add contact ${item.team}:`, error.message);
        }
    }

    // 2. Fix Awareness Images (Delete old, insert new with .png)
    console.log('\nFixing Awareness Images...');

    // Fetch existing
    try {
        const response = await axios.get(`${API_URL}/awareness`);
        const existing = response.data;

        // Delete existing
        for (const item of existing) {
            await axios.delete(`${API_URL}/awareness/${item.id}`);
            console.log(`- Deleted old article: ${item.title}`);
        }

        // Insert new with PNG
        for (const item of awarenessWithPngImages) {
            await axios.post(`${API_URL}/awareness`, item);
            console.log(`+ Added article with PNG image: ${item.title}`);
        }

    } catch (error) {
        console.error('Error handling awareness data:', error.message);
    }

    console.log('\nData update complete!');
}

fixData();
