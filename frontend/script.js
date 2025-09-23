// Enhanced Task Tracker Frontend with Hour Support
const API_URL = '/api/tasks';

const form = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const daySelect = document.getElementById('day-select');
const hourSelect = document.getElementById('hour-select');

const DAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

const HOURS = Array.from({length: 24}, (_, i) => i);

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeTimeSlots();
  fetchTasks();
});

// Create time slots for each day
function initializeTimeSlots() {
  DAYS.forEach(day => {
    const slotsContainer = document.getElementById(`${day}-slots`);
    if (slotsContainer) {
      // Create hourly time slots (showing only common hours to avoid clutter)
      const commonHours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
      
      commonHours.forEach(hour => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.dataset.hour = hour;
        
        const timeLabel = document.createElement('div');
        timeLabel.className = 'time-label';
        timeLabel.textContent = formatHour(hour);
        
        const taskContainer = document.createElement('div');
        taskContainer.className = 'task-container';
        taskContainer.id = `${day}-hour-${hour}`;
        
        timeSlot.appendChild(timeLabel);
        timeSlot.appendChild(taskContainer);
        slotsContainer.appendChild(timeSlot);
      });
    }
  });
}

// Format hour to 12-hour format
function formatHour(hour) {
  if (hour === 0) return '12:00 AM';
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return '12:00 PM';
  return `${hour - 12}:00 PM`;
}

// Fetch and render all tasks
async function fetchTasks() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    showMessage('Error loading tasks', 'error');
  }
}

// Render all tasks in their appropriate locations
function renderTasks(tasks) {
  // Clear all existing tasks
  DAYS.forEach(day => {
    // Clear all-day tasks
    const allDayContainer = document.getElementById(`${day}-allday`);
    if (allDayContainer) allDayContainer.innerHTML = '';
    
    // Clear hourly tasks
    const slotsContainer = document.getElementById(`${day}-slots`);
    if (slotsContainer) {
      const taskContainers = slotsContainer.querySelectorAll('.task-container');
      taskContainers.forEach(container => container.innerHTML = '');
    }
  });
  
  // Add tasks to their appropriate containers
  tasks.forEach(task => addTaskToDOM(task));
}

// Add a single task to the DOM
function addTaskToDOM(task) {
  const taskElement = createTaskElement(task);
  
  if (task.hour === null || task.hour === undefined || task.hour === '') {
    // All-day task
    const container = document.getElementById(`${task.day}-allday`);
    if (container) container.appendChild(taskElement);
  } else {
    // Hourly task
    const container = document.getElementById(`${task.day}-hour-${task.hour}`);
    if (container) container.appendChild(taskElement);
  }
}

// Create a task element
function createTaskElement(task) {
  const taskDiv = document.createElement('div');
  taskDiv.className = 'task-item';
  taskDiv.dataset.taskId = task.id;
  
  if (task.completed) {
    taskDiv.classList.add('completed');
  }
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-checkbox';
  checkbox.checked = !!task.completed;
  checkbox.addEventListener('change', async () => {
    await updateTaskCompletion(task.id, checkbox.checked);
    taskDiv.classList.toggle('completed', checkbox.checked);
  });
  
  const taskText = document.createElement('span');
  taskText.className = 'task-text';
  taskText.textContent = task.text;
  
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '×';
  deleteBtn.title = 'Delete task';
  deleteBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id);
      taskDiv.remove();
    }
  });
  
  taskDiv.appendChild(checkbox);
  taskDiv.appendChild(taskText);
  taskDiv.appendChild(deleteBtn);
  
  return taskDiv;
}

// Form submit handler
form.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const text = taskInput.value.trim();
  const day = daySelect.value;
  const hour = hourSelect.value || null;
  
  if (!text || !day) {
    showMessage('Please fill in all required fields', 'error');
    return;
  }
  
  try {
    await createTask(text, day, hour);
    
    // Reset form
    taskInput.value = '';
    daySelect.value = '';
    hourSelect.value = '';
    
    // Refresh tasks
    await fetchTasks();
    
    showMessage('Task added successfully!', 'success');
  } catch (error) {
    console.error('Error creating task:', error);
    showMessage('Error adding task', 'error');
  }
});

// API Functions
async function createTask(text, day, hour) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, day, hour })
  });
  
  if (!response.ok) {
    throw new Error('Failed to create task');
  }
  
  return await response.json();
}

async function updateTaskCompletion(id, completed) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  
  if (!response.ok) {
    throw new Error('Failed to update task');
  }
}

async function deleteTask(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
}

// Utility function to show messages
function showMessage(message, type = 'info') {
  // Create or get existing message container
  let messageContainer = document.getElementById('message-container');
  if (!messageContainer) {
    messageContainer = document.createElement('div');
    messageContainer.id = 'message-container';
    messageContainer.className = 'message-container';
    document.body.appendChild(messageContainer);
  }
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message message-${type}`;
  messageDiv.textContent = message;
  
  messageContainer.appendChild(messageDiv);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}