// Simple script to generate a favicon from emoji
import fs from 'fs';
import { createCanvas } from 'canvas';
import emoji from 'node-emoji';

// Configuration
const size = 64;
const emojiChar = '🌲'; // Evergreen tree emoji
const outputPath = './public/treeText-favicon.ico';

// Create canvas
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Clear background
ctx.fillStyle = 'transparent';
ctx.fillRect(0, 0, size, size);

// Draw emoji
ctx.font = `${size * 0.9}px Arial`;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(emojiChar, size / 2, size / 2);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outputPath, buffer);

console.log(`Favicon generated at ${outputPath}`);
