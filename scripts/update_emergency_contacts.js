const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:3000/api';

const newContacts = [
    { team: 'National Cyber Crime Helpline', priority: 'Cyber Fraud', description: 'For fraud, hacking, scams.', availability: '24/7', phone: '1930', email: 'help@cybercrime.gov.in', location: 'National' },
    { team: 'Financial Fraud Helpline', priority: 'Cyber Fraud', description: 'Old cyber fraud helpline.', availability: '24/7', phone: '155260', email: 'fraud@cybercrime.gov.in', location: 'National' },
    { team: 'National Emergency Number', priority: 'Police & Safety', description: 'Police, Fire, Ambulance.', availability: '24/7', phone: '112', email: 'emergency@112.gov.in', location: 'National' },
    { team: 'Police Helpline', priority: 'Police & Safety', description: 'Direct police helpline.', availability: '24/7', phone: '100', email: 'police@gov.in', location: 'National' },
    { team: 'State Bank of India (SBI)', priority: 'Banking', description: 'Block account/card.', availability: '24/7', phone: '1800 1234', email: 'care@sbi.co.in', location: 'National' },
    { team: 'HDFC Bank Support', priority: 'Banking', description: 'Fraud support.', availability: '24/7', phone: '1800 1600', email: 'support@hdfc.com', location: 'National' },
    { team: 'ICICI Bank Support', priority: 'Banking', description: 'Emergency banking help.', availability: '24/7', phone: '1800 1080', email: 'care@icicibank.com', location: 'National' },
    { team: 'Women Helpline', priority: 'Citizen Help', description: 'Harassment, cyber abuse.', availability: '24/7', phone: '1091', email: 'womenhelp@gov.in', location: 'National' },
    { team: 'Child Helpline', priority: 'Citizen Help', description: 'Child helpline.', availability: '24/7', phone: '1098', email: 'childline@gov.in', location: 'National' }
];

async function updateContacts() {
    try {
        console.log('Fetching existing contacts...');
        const res = await axios.get(`${API_URL}/emergency-contacts`);
        const existing = res.data;
        
        console.log(`Found ${existing.length} existing contacts. Deleting...`);
        for (const item of existing) {
            await axios.delete(`${API_URL}/emergency-contacts/${item.id}`);
            console.log(`- Deleted: ${item.team}`);
        }

        console.log('\nInserting new contacts...');
        for (const item of newContacts) {
            await axios.post(`${API_URL}/emergency-contacts`, item);
            console.log(`+ Added: ${item.team}`);
        }
        
        console.log('\nEmergency contacts successfully updated!');
    } catch(err) {
        console.error('Error:', err.message);
    }
}

updateContacts();
