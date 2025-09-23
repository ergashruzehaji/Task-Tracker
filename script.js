HEAD
// Content of script.js should be added here

const API_BASE = 'http://localhost:3000';

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', loadTasks);

form.addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent page reload

  const taskText = input.value.trim();
  if (taskText === '') return;

  addTask(taskText);
  input.value = ''; // Clear input
});

// Load tasks from backend
async function loadTasks() {
  try {
    const response = await fetch(`${API_BASE}/tasks`);
    const tasks = await response.json();
    
    list.innerHTML = ''; // Clear existing tasks
    tasks.forEach(task => {
      displayTask(task);
    });
  } catch (error) {
    console.error('Error loading tasks:', error);
    // Fallback to local storage if backend is not available
    loadTasksFromLocalStorage();
  }
}

// Add task to backend
async function addTask(text) {
  try {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    
    const task = await response.json();
    displayTask(task);
  } catch (error) {
    console.error('Error adding task:', error);
    // Fallback to local storage if backend is not available
    const task = { id: Date.now(), text };
    displayTask(task);
    saveTaskToLocalStorage(task);
  }
}

// Display task in the UI
function displayTask(task) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span class="task-text">${task.text}</span>
    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
  `;
  list.appendChild(li);
}

// Delete task (placeholder for future implementation)
function deleteTask(id) {
  // This could be implemented to call DELETE /tasks/:id
  const taskElement = event.target.parentElement;
  taskElement.remove();
}

// Fallback local storage functions
function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks.forEach(task => displayTask(task));
}

function saveTaskToLocalStorage(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
4577c22 (Update Task Tracker files, ready for deployment)
