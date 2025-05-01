'use strict';

const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const PORT = 8000;

// Securely load static HTML
const docHtmlPath = path.join(__dirname, 'src', 'index.html');
const docHtml = fs.readFileSync(docHtmlPath, 'utf-8');

// Load flag securely but do not expose it
const flag = fs.readFileSync(path.join(__dirname, 'flag'), 'utf-8').trim();

// Ensure Express trusts the real IP when behind a proxy (like NGINX or cloud)
app.set('trust proxy', true);

app.use(bodyParser.json());

// Serve homepage
app.get('/', (req, res) => {
    res.send(docHtml);
});

// Echo endpoint (sanitized)
app.post('/echo', (req, res) => {
    const out = {
        userID: req.ip,
        time: Date.now()
    };

    // ✅ Whitelist fields from request body
    const allowedFields = ['message', 'name', 'email'];
    for (const key of allowedFields) {
        if (typeof req.body[key] === 'string') {
            out[key] = req.body[key];
        }
    }

    // ✅ Do NOT expose secret data like the flag
    out.flag = 'disabled';

    res.json(out);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
