const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from root directory

const DATA_FILE = './tasks.json';

// Load tasks
function loadTasks() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

// Save tasks
function saveTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// Routes

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// GET all tasks
app.get('/tasks', (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
});

// POST new task
app.post('/tasks', (req, res) => {
  const tasks = loadTasks();
  const newTask = { 
    id: Date.now(), 
    text: req.body.text,
    day: req.body.day,
    alarmTime: req.body.alarmTime,
    completed: false,
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

// DELETE task
app.delete('/tasks/:id', (req, res) => {
  const tasks = loadTasks();
  const filteredTasks = tasks.filter(task => task.id != req.params.id);
  saveTasks(filteredTasks);
  res.status(204).send();
});

// PUT (update) task
app.put('/tasks/:id', (req, res) => {
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(task => task.id == req.params.id);
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    saveTasks(tasks);
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
