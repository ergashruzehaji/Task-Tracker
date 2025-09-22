const API_URL = '/api/tasks';

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const daySelect = document.getElementById('day-select');

const DAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

// Fetch and render all tasks on startup
async function fetchTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  // Clear all lists
  DAYS.forEach(day => {
    const ul = document.getElementById(`${day}-list`);
    if (ul) ul.innerHTML = '';
  });
  // Add tasks to correct day
  tasks.forEach(task => addTaskToDOM(task));
}

function addTaskToDOM(task) {
  const li = document.createElement('li');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-complete-toggle';
  checkbox.checked = !!task.completed;
  checkbox.addEventListener('change', async function() {
    await updateTaskCompletion(task.id, checkbox.checked);
    li.classList.toggle('completed', checkbox.checked);
  });

  const span = document.createElement('span');
  span.textContent = task.text;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'delete-task';
  deleteBtn.addEventListener('click', async function() {
    await deleteTask(task.id);
    li.parentNode.removeChild(li);
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);
  if (task.completed) li.classList.add('completed');

  const ul = document.getElementById(`${task.day}-list`);
  if (ul) ul.appendChild(li);
}

// Form submit event
form.addEventListener('submit', async function(e) {
  e.preventDefault();
  const taskText = input.value.trim();
  const day = daySelect.value;
  if (!taskText || !day) return;
  await createTask(taskText, day);
  input.value = '';
  daySelect.value = '';
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