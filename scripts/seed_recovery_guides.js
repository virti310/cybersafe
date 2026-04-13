const db = require('../db');

const sampleGuides = [
    {
        title: "Hacked Social Media Account",
        content: "1. Change your password immediately.\n2. Enable Two-Factor Authentication (2FA).\n3. Revoke access to suspicious third-party apps.\n4. Check for unauthorized posts and messages.\n5. Contact support if you cannot access your account."
    },
    {
        title: "Phishing Email Clicked",
        content: "1. Disconnect your device from the internet.\n2. Scan your device for malware.\n3. Change passwords for sensitive accounts.\n4. Do not provide any personal information if requested.\n5. Mark the email as spam/phishing."
    },
    {
        title: "Ransomware Attack",
        content: "1. Isolate the infected device immediately.\n2. Do NOT pay the ransom.\n3. Restore data from a secure backup.\n4. Consult with a cybersecurity professional.\n5. Report the incident to authorities."
    },
    {
        title: "Bank Fraud Detected",
        content: "1. Contact your bank immediately to freeze accounts.\n2. Review transaction history for unauthorized charges.\n3. File a police report.\n4. Update your banking PINs and passwords.\n5. Monitor your credit report."
    },
    {
        title: "Identity Theft",
        content: "1. Place a fraud alert on your credit reports.\n2. Free your credit.\n3. Report identity theft to the government (e.g., FTC in USA).\n4. Contact institutions where fraud occurred.\n5. Update all account passwords."
    },
    {
        title: "Lost or Stolen Device",
        content: "1. Use 'Find My Device' features to lock or wipe data remotely.\n2. Change passwords for accounts accessed on the device.\n3. Report the loss to your mobile carrier.\n4. Monitor accounts for suspicious activity.\n5. File a police report if stolen."
    },
    {
        title: "Online Shopping Scam",
        content: "1. Contact your payment provider to dispute the charge.\n2. Report the website to consumer protection agencies.\n3. Keep records of all communication.\n4. Monitor your financial statements.\n5. Be cautious of similar offers in the future."
    },
    {
        title: "Fake Tech Support Call",
        content: "1. Hang up immediately.\n2. Do NOT give remote access to your computer.\n3. If you gave access, disconnect and scan for malware.\n4. Contact your bank if you paid them.\n5. Report the number."
    },
    {
        title: "Data Breach Notification",
        content: "1. Verify the breach is real (check official sources).\n2. Change passwords for the affected account.\n3. Use a password manager to ensure unique passwords.\n4. Enable 2FA where possible.\n5. Monitor for secondary phishing attempts."
    },
    {
        title: "Sim Swapping",
        content: "1. Contact your mobile carrier immediately.\n2. Secure your email account associated with the number.\n3. Remove SMS 2FA from critical accounts (use app-based auth).\n4. Check bank accounts for unauthorized transfers.\n5. Set up a PIN with your carrier."
    }
];

async function seed() {
    try {
        console.log('Fetching categories...');
        const catRes = await db.query('SELECT id FROM categories');
        let categoryIds = catRes.rows.map(r => r.id);

        if (categoryIds.length === 0) {
            console.log('No categories found. Creating default category...');
            const newCat = await db.query("INSERT INTO categories (name, created_at) VALUES ('General', NOW()) RETURNING id");
            categoryIds = [newCat.rows[0].id];
        }

        console.log('Clearing recovery_guides table...');
        await db.query('DELETE FROM recovery_guides');

        console.log('Inserting 10 sample guides...');
        for (let i = 0; i < sampleGuides.length; i++) {
            const guide = sampleGuides[i];
            const categoryId = categoryIds[i % categoryIds.length]; // Cycle through categories

            // We populate 'guide' column with content for legacy compatibility/safety
            await db.query(
                `INSERT INTO recovery_guides (title, content, guide, category_id, created_at) 
                 VALUES ($1, $2, $3, $4, NOW())`,
                [guide.title, guide.content, guide.content, categoryId]
            );
        }

        console.log('Seeding complete.');
    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await db.end();
    }
}

seed();
