
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const { nanoid } = require('nanoid');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// --- Database Setup ---
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create the table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS menus (
            id TEXT PRIMARY KEY,
            data TEXT NOT NULL
        )`);
    }
});

// --- API Endpoints ---

// Create or Update a Menu
app.post('/api/menu', (req, res) => {
    const { id, data } = req.body;
    const menuId = id || nanoid(10); // Use existing ID or generate a new one

    if (!data) {
        return res.status(400).json({ error: 'Data is required' });
    }

    const jsonData = JSON.stringify(data);

    // Use INSERT OR REPLACE to handle both creation and updates
    const sql = `INSERT OR REPLACE INTO menus (id, data) VALUES (?, ?)`;
    
    db.run(sql, [menuId, jsonData], function(err) {
        if (err) {
            console.error('Error saving to database', err.message);
            return res.status(500).json({ error: 'Failed to save menu' });
        }
        res.status(200).json({ id: menuId });
    });
});

// Get a Menu by ID
app.get('/api/menu/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT data FROM menus WHERE id = ?";

    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error('Error fetching from database', err.message);
            return res.status(500).json({ error: 'Failed to fetch menu' });
        }
        if (row) {
            res.status(200).json({ id, data: JSON.parse(row.data) });
        } else {
            res.status(404).json({ error: 'Menu not found' });
        }
    });
});


// --- Start Server ---
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
