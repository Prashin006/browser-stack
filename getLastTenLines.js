const fs = require('fs');
const WebSocket = require('ws');
const { join } = require('path');

const filePath = join(__dirname, 'app.log');
let lastReadPosition = 0;
let lastModified = 0;

function getLastModifiedTime() {
    lastModified = fs.statSync(filePath).mtimeMs;
}

function getToEnd() {
    const fileSize = fs.statSync(filePath).size;
    lastReadPosition = fileSize;
}

let position = lastReadPosition;
let lineCount = 0;
let lines = [];

// backward reading is left
// while(lineCount < 10){

// }
