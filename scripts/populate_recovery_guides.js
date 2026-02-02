const db = require('../db');

async function populateRecoveryGuides() {
    try {
        console.log('🔄 Starting recovery guides population...');

        // 1. Reset Tables (Clean Slate)
        console.log('🗑️ Dropping existing tables...');
        await db.query('DROP TABLE IF EXISTS recovery_guides');
        await db.query('DROP TABLE IF EXISTS categories CASCADE'); // Cascade to remove foreign keys if any

        // 2. Create tables
        console.log('✨ Creating new tables...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS recovery_guides (
                id SERIAL PRIMARY KEY,
                category_id INT,
                guide VARCHAR(255) NOT NULL,
                steps TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
            )
        `);

        console.log('✅ Tables created.');

        // 3. Define Data
        const categories = [
            "Financial Fraud",
            "Social Media Hack",
            "Device Compromise",
            "Identity Theft",
            "Online Harassment"
        ];

        const guides = {
            "Financial Fraud": [
                {
                    title: "UPI Fraud Recovery",
                    steps: `1. **Contact Your Bank Immediately**: Call your bank's fraud helpline or use their app to block your UPI ID and linked bank account.\n2. **Report Transaction**: Note the transaction ID, date, and time. Report it within 24 hours to maximize chances of refund.\n3. **Complaint to NPCI**: Raise a dispute on the BHIM/UPI app or NPCI website.\n4. **Cyber Crime Portal**: File a complaint at [cybercrime.gov.in](https://cybercrime.gov.in) with all proofs (screenshots, messages).\n5. **Change PIN**: Once access is restored, change your UPI PIN immediately.`
                },
                {
                    title: "Credit Card Fraud",
                    steps: `1. **Block the Card**: Open your banking app or call customer care to block the card permanently.\n2. **Dispute Transaction**: File a dispute form with your bank for the unauthorized charge.\n3. **Check Statements**: Review previous statements for other small unauthorized transactions.\n4. **Fraud Alert**: Ask your bank to place a fraud alert on your account.`
                }
            ],
            "Social Media Hack": [
                {
                    title: "Instagram Hacked Account",
                    steps: `1. **Check Email**: Look for an email from Instagram security. If you see "Email changed", click "Revert this change".\n2. **Request Login Link**: On login screen, tap "Get help logging in" (Android) or "Forgot password?" (iPhone). Enter username/email > Next.\n3. **Security Code**: If you have access to email/phone, enter the security code sent.\n4. **Video Selfie Verification**: If hacker turned on 2FA, request "Try another way" > "Get support" > "My account was hacked" > Verify with video selfie.`
                },
                {
                    title: "Facebook Hacked Account",
                    steps: `1. **Visit Help Page**: Go to [facebook.com/hacked](https://www.facebook.com/hacked).\n2. **Identify Account**: Search for your account using email or phone number.\n3. **Secure Account**: Select "My account is compromised" and follow on-screen instructions to change password.\n4. **Review Activity**: Check specific logins and posts made recently and delete unauthorized content.`
                }
            ],
            "Device Compromise": [
                {
                    title: "Malware/Virus Removal",
                    steps: `1. **Disconnect Internet**: Turn off Wi-Fi and Mobile Data to stop data theft.\n2. **Safe Mode**: Restart device in Safe Mode (prevents third-party apps from running).\n3. **Uninstall Suspicious Apps**: Go to Settings > Apps. Remove any app you didn't install or looks suspicious.\n4. **Run Antivirus**: Use a reputable mobile antivirus scan.\n5. **Factory Reset**: As a last resort, backup essential data (photos/contacts only) and factory reset the device.`
                }
            ],
            "Identity Theft": [
                {
                    title: "Aadhaar Misuse",
                    steps: `1. **Check History**: Login to UIDAI website/app and check "Authentication History".\n2. **Lock Biometrics**: Use mAadhaar app or UIDAI website to lock your biometrics.\n3. **Report**: File a complaint with UIDAI (1947) and Cyber Crime Portal.`
                }
            ],
            "Online Harassment": [
                {
                    title: "Cyberbullying/Stalking",
                    steps: `1. **Do Not Respond**: Engaging often escalates the situation.\n2. **Block & Report**: Block the user and report their profile/messages to the platform.\n3. **Save Evidence**: Take screenshots of messages, profiles, and comments.\n4. **File Complaint**: Report to [cybercrime.gov.in](https://cybercrime.gov.in) under "Women/Child related crime" if applicable.`
                }
            ]
        };

        // 4. Insert Data
        for (const catName of categories) {
            // Insert Category
            const newCat = await db.query('INSERT INTO categories (name) VALUES ($1) RETURNING id', [catName]);
            const categoryId = newCat.rows[0].id;

            console.log(`Processing Category: ${catName} (ID: ${categoryId})`);

            if (guides[catName]) {
                for (const guide of guides[catName]) {
                    await db.query('INSERT INTO recovery_guides (category_id, guide, steps) VALUES ($1, $2, $3)',
                        [categoryId, guide.title, guide.steps]);
                    console.log(`  - Added Guide: ${guide.title}`);
                }
            }
        }

        console.log('✅ Recovery guides population completed!');
        await db.end(); // Close connection
        process.exit(0);

    } catch (error) {
        console.error('❌ Error populating recovery guides:', error);
        try { await db.end(); } catch (e) { } // Try to close connection on error
        process.exit(1);
    }
}

populateRecoveryGuides();
