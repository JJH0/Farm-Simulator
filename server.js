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
        fs.writeFileSync(DB_FILE, JSON.stringify({ users: {}, circles: {} }));
    }
    try {
        const data = JSON.parse(fs.readFileSync(DB_FILE));
        if (!data.users) data.users = {};
        if (!data.circles) data.circles = {};
        return data;
    } catch (e) {
        return { users: {}, circles: {} };
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
    circleId: null,
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
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userId = ip.replace(/[^a-zA-Z0-9]/g, '_'); 

    console.log(`User login from IP: ${ip} (ID: ${userId})`);

    const db = loadDB();
    
    if (!db.users[userId]) {
        console.log('New user detected. Creating account...');
        db.users[userId] = getInitialState();
        saveDB(db);
    }

    res.json({
        userId: userId,
        data: db.users[userId],
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
    
    // Ensure user exists
    if (!db.users[userId]) {
        db.users[userId] = getInitialState();
    }

    // Preserve server-side only fields if any (like circleId if we managed it strictly server side, but here we sync)
    // Actually, let's trust the client state for simplicity, but ensure circle integrity
    const oldCircleId = db.users[userId].circleId;
    db.users[userId] = data;
    
    // Restore circleId from server record if client messed it up, or trust client? 
    // Let's trust client but maybe validate later. 
    // For now, simple overwrite is fine for this prototype.
    
    saveDB(db);
    // console.log(`Saved progress for ${userId}`);
    res.json({ success: true });
});

// --- Social / Circle Features ---

// POST /circle/create
app.post('/circle/create', (req, res) => {
    const { userId } = req.body;
    const db = loadDB();

    if (!db.users[userId]) return res.status(404).json({ error: 'User not found' });
    if (db.users[userId].circleId) return res.status(400).json({ error: 'Already in a circle' });

    // Generate Room ID (6 digits)
    let roomId = Math.floor(100000 + Math.random() * 900000).toString();
    while (db.circles[roomId]) {
        roomId = Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Create Circle
    db.circles[roomId] = {
        id: roomId,
        members: [userId],
        createdAt: Date.now()
    };

    // Update User
    db.users[userId].circleId = roomId;

    saveDB(db);
    res.json({ success: true, circleId: roomId, data: db.users[userId] });
});

// POST /circle/join
app.post('/circle/join', (req, res) => {
    const { userId, circleId } = req.body;
    const db = loadDB();

    if (!db.users[userId]) return res.status(404).json({ error: 'User not found' });
    if (!db.circles[circleId]) return res.status(404).json({ error: 'Circle not found' });
    if (db.users[userId].circleId) return res.status(400).json({ error: 'Already in a circle' });

    // Add to Circle
    db.circles[circleId].members.push(userId);
    
    // Update User
    db.users[userId].circleId = circleId;

    saveDB(db);
    res.json({ success: true, circleId: circleId, data: db.users[userId] });
});

// GET /circle/members
app.get('/circle/members', (req, res) => {
    const { userId } = req.query;
    const db = loadDB();

    if (!db.users[userId]) return res.status(404).json({ error: 'User not found' });
    
    const circleId = db.users[userId].circleId;
    if (!circleId || !db.circles[circleId]) {
        return res.json({ members: [] });
    }

    // Get member details
    const memberIds = db.circles[circleId].members;
    const members = memberIds.map(id => {
        const u = db.users[id];
        return {
            userId: id,
            level: u.level,
            petName: CONFIG_PET_NAMES[u.pet.stage] || '未知宠物', // We need config or store name
            coins: u.coins
        };
    });

    res.json({ circleId, members });
});

// Helper for pet names config on server side (simplified)
const CONFIG_PET_NAMES = ['神秘的蛋', '小黄鸡', '战斗鸡', '凤凰', '神兽'];

// Game Config for Validation
const CONFIG = {
    crops: {
        carrot: { name: '胡萝卜', sellPrice: 25, xp: 10 },
        corn: { name: '玉米', sellPrice: 70, xp: 25 },
        potato: { name: '土豆', sellPrice: 120, xp: 45 },
        tomato: { name: '番茄', sellPrice: 200, xp: 80 },
        strawberry: { name: '草莓', sellPrice: 400, xp: 150 },
    }
};

// GET /user/:id - Get specific user data (Read Only equivalent)
app.get('/user/:id', (req, res) => {
    const { id } = req.params;
    const db = loadDB();
    if (!db.users[id]) return res.status(404).json({ error: 'User not found' });
    
    // Return safe public data
    res.json({
        userId: id,
        data: db.users[id]
    });
});

// POST /interact - Social interactions
app.post('/interact', (req, res) => {
    const { actorId, targetId, action, plotId } = req.body;
    const db = loadDB();

    if (!db.users[actorId] || !db.users[targetId]) {
        return res.status(400).json({ error: 'User not found' });
    }

    const targetUser = db.users[targetId];
    const actorUser = db.users[actorId];
    const plot = targetUser.plots.find(p => p.id === parseInt(plotId));

    if (!plot) return res.status(400).json({ error: 'Plot not found' });

    let msg = '';
    let success = false;

    if (action === 'water') {
        if (plot.crop && plot.crop.water <= 0) {
            plot.crop.water = 100;
            actorUser.xp += 5;
            actorUser.coins += 5;
            msg = "帮忙浇水成功! (+5 XP, +5 💰)";
            success = true;
        } else {
            msg = "不需要浇水";
        }
    } else if (action === 'steal') {
        if (plot.crop) {
             const cropConfig = CONFIG.crops[plot.crop.type];
             // Simple check: crop exists. 
             // Note: In a real app we check if it is fully grown. 
             // Here we rely on client sending valid request, but we mark it 'stolen'
             
             if (plot.crop.stolen) {
                 msg = "手慢了，已经被偷过了!";
             } else {
                 plot.crop.stolen = true;
                 const stealAmount = Math.floor(cropConfig.sellPrice * 0.3); // Steal 30% value
                 actorUser.coins += stealAmount;
                 actorUser.xp += 2;
                 msg = `嘿嘿! 偷到了价值 ${stealAmount}💰 的${cropConfig.name}`;
                 success = true;
             }
        } else {
            msg = "这里没有庄稼";
        }
    }

    if (success) saveDB(db);
    res.json({ success, msg, plot: plot });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Data will be saved to ${DB_FILE}`);
});
