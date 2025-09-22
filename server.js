// Basic backend for Task Tracker (Node.js + Express + file storage)
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

const DATA_FILE = path.join(__dirname, 'tasks.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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

// POST new task
app.post('/api/tasks', (req, res) => {
  const { text, day } = req.body;
  if (!text || !day) return res.status(400).json({ error: 'Missing fields' });
  const tasks = readTasks();
  const newTask = {
    id: Date.now().toString(),
    text,
    day,
    completed: false
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

// PUT update task completion
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  let tasks = readTasks();
  let found = false;
  tasks = tasks.map(task => {
    if (task.id === id) {
      found = true;
      return { ...task, completed: !!completed };
    }
    return task;
  });
  if (!found) return res.status(404).json({ error: 'Not found' });
  writeTasks(tasks);
  res.json({ success: true });
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  let tasks = readTasks();
  const newTasks = tasks.filter(task => task.id !== id);
  if (tasks.length === newTasks.length)
    return res.status(404).json({ error: 'Not found' });
  writeTasks(newTasks);
  res.json({ success: true });
});

// Serve frontend
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () => {
  console.log(`Task Tracker backend running at http://localhost:${PORT}`);
});