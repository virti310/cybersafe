const express = require('express');
const router = express.Router();
const dbPool = require('../db');

// GET /api/dashboard/stats
router.get('/stats', async (req, res) => {
    try {
        console.log('[DASHBOARD] Fetching stats...');

        // Parallelize queries for efficiency
        const [usersRes, reportsRes, fraudRes, pendingRes, recentRes, trendRes] = await Promise.all([
            dbPool.query('SELECT COUNT(*) FROM users'),
            dbPool.query('SELECT COUNT(*) FROM reports'),
            dbPool.query('SELECT COUNT(*) FROM reports WHERE is_financial_fraud = TRUE'),
            dbPool.query('SELECT COUNT(*) FROM reports WHERE status = \'Pending\''),
            dbPool.query('SELECT id, incident_type, status, created_at FROM reports ORDER BY created_at DESC LIMIT 5'),
            dbPool.query(`
                SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, COUNT(*) as count 
                FROM reports 
                WHERE created_at > NOW() - INTERVAL '7 days' 
                GROUP BY date 
                ORDER BY date ASC
            `)
        ]);

        const stats = {
            totalUsers: parseInt(usersRes.rows[0].count),
            totalReports: parseInt(reportsRes.rows[0].count),
            fraudReports: parseInt(fraudRes.rows[0].count),
            pendingReports: parseInt(pendingRes.rows[0].count),
            recentReports: recentRes.rows,
            trendData: trendRes.rows,
            systemStatus: {
                database: 'Connected',
                server: 'Online',
                backup: 'Idle' // Mocked for now
            }
        };

        // Get count of awareness articles
        // Check if table exists first? Assume yes.
        const articlesRes = await dbPool.query('SELECT COUNT(*) FROM awareness');
        stats.totalArticles = parseInt(articlesRes.rows[0].count);

        res.json(stats);

    } catch (err) {
        console.error('[DASHBOARD] Error fetching stats:', err.message);
        res.status(500).json({ error: 'Failed to fetch dashboard stats', details: err.message });
    }
});

module.exports = router;
