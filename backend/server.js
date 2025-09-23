// Enhanced Task Tracker Backend (Node.js + Express + JSON storage)
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

const DATA_FILE = path.join(__dirname, 'tasks.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Helper to read/write tasks
function readTasks() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// GET all tasks
app.get('/api/tasks', (req, res) => {
  res.json(readTasks());
});

// GET tasks for a specific day
app.get('/api/tasks/:day', (req, res) => {
  const { day } = req.params;
  const tasks = readTasks().filter(task => task.day === day);
  res.json(tasks);
});

// POST new task with hour support
app.post('/api/tasks', (req, res) => {
  const { text, day, hour } = req.body;
  if (!text || !day) return res.status(400).json({ error: 'Missing required fields: text and day' });
  
  const tasks = readTasks();
  const newTask = {
    id: Date.now().toString(),
    text,
    day,
    hour: hour || null, // hour is optional, can be null for all-day tasks
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

// PUT update task (completion, hour, text)
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed, hour, text } = req.body;
  
  let tasks = readTasks();
  let found = false;
  
  tasks = tasks.map(task => {
    if (task.id === id) {
      found = true;
      const updatedTask = { ...task };
      if (completed !== undefined) updatedTask.completed = !!completed;
      if (hour !== undefined) updatedTask.hour = hour;
      if (text !== undefined) updatedTask.text = text;
      updatedTask.updatedAt = new Date().toISOString();
      return updatedTask;
    }
    return task;
  });
  
  if (!found) return res.status(404).json({ error: 'Task not found' });
  
  writeTasks(tasks);
  res.json({ success: true });
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  let tasks = readTasks();
  const newTasks = tasks.filter(task => task.id !== id);
  
  if (tasks.length === newTasks.length) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  writeTasks(newTasks);
  res.json({ success: true });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Task Tracker backend running at http://localhost:${PORT}`);
  console.log(`Frontend served from: ${path.join(__dirname, '../frontend')}`);
});