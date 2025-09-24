#!/usr/bin/env node

// Simple startup script for Render deployment
console.log('🚀 Starting Task Tracker server...');
console.log('📁 Current directory:', process.cwd());
console.log('📂 Files:', require('fs').readdirSync('.'));

// Start the actual server
require('./backend/server.js');