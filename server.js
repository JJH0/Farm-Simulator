const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(bodyParser.json());

// Helper to load DB
const loadDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({}));
    }
    try {
        return JSON.parse(fs.readFileSync(DB_FILE));
    } catch (e) {
        return {};
    }
};

// Helper to save DB
const saveDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Initial State Template
const getInitialState = () => ({
    level: 1,
    xp: 0,
    coins: 100,
    lastCheckIn: null,
    inventory: { seeds: { carrot: 2 } },
    plots: Array(9).fill(null).map((_, i) => ({
        id: i,
        locked: i >= 3,
        crop: null,
    })),
    pet: {
        stage: 0,
        love: 0,
        hunger: 80,
        lastInteraction: Date.now()
    }
});

// GET /login - Auto login by IP
app.get('/login', (req, res) => {
    // Get IP (Handle proxies if needed)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    // Simple hash or cleanup of IP string to use as key
    const userId = ip.replace(/[^a-zA-Z0-9]/g, '_'); 

    console.log(`User login from IP: ${ip} (ID: ${userId})`);

    const db = loadDB();
    
    if (!db[userId]) {
        console.log('New user detected. Creating account...');
        db[userId] = getInitialState();
        saveDB(db);
    }

    res.json({
        userId: userId,
        data: db[userId],
        message: 'Login successful'
    });
});

// POST /save - Save game data
app.post('/save', (req, res) => {
    const { userId, data } = req.body;
    
    if (!userId || !data) {
        return res.status(400).json({ error: 'Missing userId or data' });
    }

    const db = loadDB();
    
    // Validate user exists (optional, could just upsert)
    if (!db[userId]) {
        // If somehow saving without logging in first, create it
        db[userId] = getInitialState();
    }

    // Merge/Overwrite state
    db[userId] = data;
    saveDB(db);

    console.log(`Saved progress for ${userId}`);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Data will be saved to ${DB_FILE}`);
});
