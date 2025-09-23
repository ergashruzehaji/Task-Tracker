// Express server for Task Tracker website
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

const DATA_FILE = path.join(__dirname, 'tasks.json');

function readTasks() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

app.get('/api/tasks', (req, res) => {
  res.json(readTasks());
});

app.post('/api/tasks', (req, res) => {
  const { text, day } = req.body;
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

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const tasks = readTasks();
  const task = tasks.find(t => t.id === id);
  if (task) task.completed = completed;
  writeTasks(tasks);
  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  let tasks = readTasks();
  tasks = tasks.filter(t => t.id !== id);
  writeTasks(tasks);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
