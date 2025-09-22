const API_URL = 'http://localhost:3001/api/tasks';

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const daySelect = document.getElementById('day-select');
const day1List = document.getElementById('day1-list');
const day2List = document.getElementById('day2-list');

// Fetch and render all tasks on startup
async function fetchTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  day1List.innerHTML = '';
  day2List.innerHTML = '';
  tasks.forEach(task => addTaskToDOM(task));
  checkDay1Completion();
}

// Add a task to the correct list
function addTaskToDOM(task) {
  const li = document.createElement('li');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-complete-toggle';
  checkbox.checked = !!task.completed;
  checkbox.addEventListener('change', async function() {
    await updateTaskCompletion(task.id, checkbox.checked);
    li.classList.toggle('completed', checkbox.checked);
    if (task.day === 1) checkDay1Completion();
  });

  const span = document.createElement('span');
  span.textContent = task.text;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'delete-task';
  deleteBtn.addEventListener('click', async function() {
    await deleteTask(task.id);
    li.parentNode.removeChild(li);
    if (task.day === 1) checkDay1Completion();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);
  if (task.completed) li.classList.add('completed');

  (task.day === 1 ? day1List : day2List).appendChild(li);
}

// Check if all Day 1 tasks are completed, then unlock Day 2
function checkDay1Completion() {
  const tasks = day1List.querySelectorAll('li');
  const allCompleted = Array.from(tasks).length > 0 &&
    Array.from(tasks).every(li => li.classList.contains('completed'));
  daySelect.options[1].disabled = !allCompleted;
}

// Form submit event
form.addEventListener('submit', async function(e) {
  e.preventDefault();
  const taskText = input.value.trim();
  const day = parseInt(daySelect.value);
  if (!taskText || !day) return;
  await createTask(taskText, day);
  input.value = '';
  fetchTasks();
});

// API calls
async function createTask(text, day) {
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, day })
  });
}

async function updateTaskCompletion(id, completed) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
}

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
}

// Initial load
fetchTasks();