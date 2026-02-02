const axios = require('axios');

async function seedOne() {
    try {
        await axios.post('http://localhost:3000/api/notifications', {
            title: 'Manual Verification Item',
            body: 'This notification exists to help you verify the Admin UI. Try Editing or Deleting me!',
            type: 'ALL',
            user_id: null
        });
        console.log('Seed notification created.');
    } catch (e) {
        console.error(e.message);
    }
}
seedOne();
