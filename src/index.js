'use strict';

const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const docHtml = fs.readFileSync('./src/index.html', 'utf-8');

// Security: load the flag but never expose it publicly
const flag = fs.readFileSync('./flag', 'utf-8').trim();

// Trust proxy if behind one (e.g., when deployed behind NGINX or on cloud platforms)
app.set('trust proxy', true);

app.use(bodyParser.json());

// Serve static HTML
app.get('/', (req, res) => {
    res.send(docHtml);
});

// Echo endpoint with improved security
app.post('/echo', (req, res) => {
    const out = {
        userID: req.ip,          // Trust Express IP if trust proxy is set
        time: Date.now()
    };

    // Whitelist input fields to avoid prototype pollution
    const allowedFields = ['name', 'message'];
    for (const field of allowedFields) {
        if (typeof req.body[field] === 'string') {
            out[field] = req.body[field];
        }
    }

    // Do not expose secret flags
    out.flag = 'disabled';

    res.json(out);
});

app.listen(8000, () => {
    console.log('Server listening on port 8000');
});
