const fs = require('fs');
const { join } = require('path');
const express = require('express');
const WebSocket = require('ws');

const app = express();
const logFilePath = join(__dirname, 'app.log');

// client side code serving
app.get('/log', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

const server = app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/');
});

const wss = new WebSocket.Server({ server });

function printLastTenLines(ws) {
    // async file reading using fs
    fs.openSync(logFilePath,)
    fs.readFile(logFilePath, 'utf-8', (err, data) => {
        if (err) {
            console.log('Error reading log file:', err);
            return;
        }
        const lines = data.trim().split('\n');
        const lastTenLines = lines.slice(-10).join('\n');
        ws.send(lastTenLines);
    });
}

fs.watchFile(logFilePath, { interval: 100 }, (curr, prev) => {
    if (curr.size > prev.size) {
        fs.createReadStream(logFilePath, {
            start: prev.size,
            end: curr.size,
        }).on('data', (chunk) => {
            wss.clients.forEach((client) => {
                if (client.readyState == WebSocket.OPEN) {
                    client.send(chunk.toString());
                }
            });
        });
    }
});

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send the last 10 lines of the log file when a client connects
    printLastTenLines(ws);

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
