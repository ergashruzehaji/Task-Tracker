const path = require('path');
const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the root directory (where index.html is)
app.use(express.static(path.join(__dirname, '..')));

// Tasks file path - look in backend directory for tasks.json
const TASKS_FILE = path.join(__dirname, '..', 'backend', 'tasks.json');

console.log('🚀 Starting Task Tracker Server');
console.log('📁 Server directory:', __dirname);
console.log('📄 Tasks file path:', TASKS_FILE);
console.log('🌐 Port:', PORT);

// Helper function to read tasks
function readTasks() {
    try {
        if (fs.existsSync(TASKS_FILE)) {
            const data = fs.readFileSync(TASKS_FILE, 'utf8');
            return JSON.parse(data);
        }
        return {};
    } catch (error) {
        console.error('Error reading tasks:', error);
        return {};
    }
}

// Helper function to write tasks
function writeTasks(tasks) {
    try {
        // Ensure backend directory exists
        const backendDir = path.join(__dirname, '..', 'backend');
        if (!fs.existsSync(backendDir)) {
            fs.mkdirSync(backendDir, { recursive: true });
        }
        fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing tasks:', error);
        return false;
    }
}

// API Routes
app.get('/api/tasks', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
    const tasks = readTasks();
    const { date, task } = req.body;
    
    if (!date || !task) {
        return res.status(400).json({ error: 'Date and task are required' });
    }
    
    if (!tasks[date]) {
        tasks[date] = [];
    }
    
    const newTask = {
        id: Date.now().toString(),
        text: task.text || task,
        priority: task.priority || 'medium',
        completed: task.completed || false,
        time: task.time || null,
        category: task.category || 'general',
        createdAt: new Date().toISOString()
    };
    
    tasks[date].push(newTask);
    
    if (writeTasks(tasks)) {
        res.json({ success: true, task: newTask });
    } else {
        res.status(500).json({ error: 'Failed to save task' });
    }
});

app.put('/api/tasks/:date/:id', (req, res) => {
    const tasks = readTasks();
    const { date, id } = req.params;
    const updatedTask = req.body;
    
    if (!tasks[date]) {
        return res.status(404).json({ error: 'Date not found' });
    }
    
    const taskIndex = tasks[date].findIndex(task => task.id === id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    tasks[date][taskIndex] = { ...tasks[date][taskIndex], ...updatedTask };
    
    if (writeTasks(tasks)) {
        res.json({ success: true, task: tasks[date][taskIndex] });
    } else {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

app.delete('/api/tasks/:date/:id', (req, res) => {
    const tasks = readTasks();
    const { date, id } = req.params;
    
    if (!tasks[date]) {
        return res.status(404).json({ error: 'Date not found' });
    }
    
    const taskIndex = tasks[date].findIndex(task => task.id === id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    tasks[date].splice(taskIndex, 1);
    
    // Remove empty date arrays
    if (tasks[date].length === 0) {
        delete tasks[date];
    }
    
    if (writeTasks(tasks)) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Task Tracker server running on port ${PORT}`);
    console.log(`🌐 Access your app at: http://localhost:${PORT}`);
});

module.exports = app;