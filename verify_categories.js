const API_URL = 'http://localhost:3000/api';

async function test() {
    try {
        // 1. Add new category
        console.log('Adding Test Category...');
        const addRes = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test Category 123' })
        });

        if (!addRes.ok) {
            console.error('Failed to add category:', await addRes.text());
            return;
        }

        const added = await addRes.json();
        console.log('Added:', added);

        // 2. Fetch categories
        console.log('Fetching Categories...');
        const fetchRes = await fetch(`${API_URL}/categories`);
        const list = await fetchRes.json();

        const exists = list.some(c => c.name === 'Test Category 123');
        console.log('Test Category Visible:', exists);

        // Output full list for debug
        // console.log('Current List:', list.map(c => c.name));

    } catch (e) {
        console.error('Error:', e);
    }
}

test();
