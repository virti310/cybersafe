const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:3000/api';

const emergencyContacts = [
    { team: 'Cyber Response Team', priority: 'High', description: 'Immediate response unit for confirmed breaches.', availability: '24/7', phone: '1-800-555-0101', email: 'crt@example.com', location: 'New York, NY' },
    { team: 'IT Support', priority: 'Medium', description: 'General IT support for employee devices.', availability: '9am - 5pm', phone: '1-800-555-0102', email: 'support@example.com', location: 'San Francisco, CA' },
    { team: 'Legal Council', priority: 'High', description: 'Legal advice for data privacy and compliance.', availability: 'On Call', phone: '1-800-555-0103', email: 'legal@example.com', location: 'Washington, DC' },
    { team: 'Network Ops', priority: 'Critical', description: 'Monitoring network traffic and anomalies.', availability: '24/7', phone: '1-800-555-0104', email: 'noc@example.com', location: 'Austin, TX' },
    { team: 'Physical Security', priority: 'Medium', description: 'Building access and physical asset protection.', availability: '24/7', phone: '1-800-555-0105', email: 'security@example.com', location: 'Chicago, IL' }
];

const awarenessContent = [
    { title: 'Phishing 101: Spot the Bait', content: 'Learn how to identify suspicious emails and links that try to steal your credentials.', image: 'https://placehold.co/600x400' },
    { title: 'Password Strength Matters', content: 'Why "password123" is not enough and how to create complex, memorable passphrases.', image: 'https://placehold.co/600x400' },
    { title: 'Social Engineering Attacks', content: 'Understanding how attackers manipulate human psychology to gain unauthorized access.', image: 'https://placehold.co/600x400' },
    { title: 'To Click or Not to Click', content: 'Best practices for handling attachments and links from unknown sources.', image: 'https://placehold.co/600x400' },
    { title: 'Mobile Device Security', content: 'Securing your smartphones and tablets against theft and malware.', image: 'https://placehold.co/600x400' }
];

const policies = [
    { title: 'Privacy Policy: Data Collection', content: 'Section 1.1: We collect basic user information for account management purposes only.' },
    { title: 'Privacy Policy: Data Usage', content: 'Section 1.2: Your data is never sold to third parties and is used solely for improving service delivery.' },
    { title: 'Privacy Policy: Cookie Policy', content: 'Section 1.3: We use cookies to enhance user experience and analyze site traffic.' },
    { title: 'Privacy Policy: User Rights', content: 'Section 1.4: You have the right to request access to, correction of, or deletion of your personal data.' },
    { title: 'Privacy Policy: Third Party Sharing', content: 'Section 1.5: Data may be shared with trusted partners only when necessary for providing our services.' }
];

const faqs = [
    { question: 'How do I reset my password?', answer: 'Go to the profile page and select "Change Password". Follow the prompts to update your credentials.' },
    { question: 'Is my data encrypted?', answer: 'Yes, all sensitive user data is encrypted both in transit and at rest using industry-standard protocols.' },
    { question: 'How do I report a security incident?', answer: 'Use the "Report Incident" feature in the main menu to submit details about any suspicious activity.' },
    { question: 'Can I use this app offline?', answer: 'Some features like viewing downloaded recovery guides work offline, but reporting requires an internet connection.' },
    { question: 'Who do I contact for urgent help?', answer: 'Navigate to the "Emergency Contacts" page to find the appropriate team for your situation.' }
];

async function seedData() {
    console.log('Starting data seed...');

    // Seed Emergency Contacts
    console.log('\nSeeding Emergency Contacts...');
    for (const item of emergencyContacts) {
        try {
            await axios.post(`${API_URL}/emergency-contacts`, item);
            console.log(`+ Added contact: ${item.team}`);
        } catch (error) {
            console.error(`- Failed to add contact ${item.team}:`, error.message);
        }
    }

    // Seed Awareness
    console.log('\nSeeding Awareness Content...');
    for (const item of awarenessContent) {
        try {
            await axios.post(`${API_URL}/awareness`, item);
            console.log(`+ Added article: ${item.title}`);
        } catch (error) {
            console.error(`- Failed to add article ${item.title}:`, error.message);
        }
    }

    // Seed Policies
    console.log('\nSeeding Policies...');
    for (const item of policies) {
        try {
            await axios.post(`${API_URL}/policies`, item);
            console.log(`+ Added policy: ${item.title}`);
        } catch (error) {
            console.error(`- Failed to add policy ${item.title}:`, error.message);
        }
    }

    // Seed FAQs
    console.log('\nSeeding FAQs...');
    for (const item of faqs) {
        try {
            await axios.post(`${API_URL}/faqs`, item);
            console.log(`+ Added FAQ: ${item.question}`);
        } catch (error) {
            console.error(`- Failed to add FAQ ${item.question}:`, error.message);
        }
    }

    console.log('\nSeeding complete!');
}

seedData();
