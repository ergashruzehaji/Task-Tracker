#!/usr/bin/env node

// Simple startup script for Render deployment - FORCE REBUILD
console.log('🚀 Starting Task Tracker server...');
console.log('📁 Current directory:', process.cwd());
console.log('📂 Files:', require('fs').readdirSync('.'));
console.log('⚡ Deployment timestamp:', new Date().toISOString());

// Start the actual server
require('./backend/server.js');