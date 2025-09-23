const API_BASE = 'http://localhost:3000';

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const daySelect = document.getElementById('day-select');
const alarmTime = document.getElementById('alarm-time');
const list = document.getElementById('task-list');
const currentDayTitle = document.getElementById('current-day-title');
const alarmAudio = document.getElementById('alarm-audio');

let tasks = [];
let currentFilter = ''; // Current day filter
let alarmTimeouts = []; // Store alarm timeouts

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', function() {
  loadTasks();
  setupDayItems();
  checkAlarms();
  
  // Check alarms every minute
  setInterval(checkAlarms, 60000);
});

// Setup day item click handlers
function setupDayItems() {
  const dayItems = document.querySelectorAll('.day-item');
  dayItems.forEach(item => {
    item.addEventListener('click', function() {
      const day = this.dataset.day;
      filterTasksByDay(day);
      
      // Update active state
      dayItems.forEach(d => d.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// Filter tasks by day
function filterTasksByDay(day) {
  currentFilter = day;
  const dayName = day.charAt(0).toUpperCase() + day.slice(1);
  currentDayTitle.textContent = `${dayName} Tasks`;
  displayTasks();
}

// Form submission
form.addEventListener('submit', function(e) {
  e.preventDefault();

  const taskText = input.value.trim();
  const selectedDay = daySelect.value;
  const selectedTime = alarmTime.value;
  
  if (taskText === '') return;

  const task = {
    id: Date.now(),
    text: taskText,
    day: selectedDay,
    alarmTime: selectedTime,
    completed: false,
    createdAt: new Date().toISOString()
  };

  addTask(task);
  
  // Clear form
  input.value = '';
  daySelect.value = '';
  alarmTime.value = '';
});

// Add task
async function addTask(task) {
  try {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    
    if (response.ok) {
      const savedTask = await response.json();
      tasks.push(savedTask);
    } else {
      throw new Error('Backend not available');
    }
  } catch (error) {
    console.error('Error adding task:', error);
    // Fallback to local storage
    tasks.push(task);
    saveTasksToLocalStorage();
  }
  
  displayTasks();
  updateDayCounters();
  setupAlarmForTask(task);
}

// Load tasks
async function loadTasks() {
  try {
    const response = await fetch(`${API_BASE}/tasks`);
    if (response.ok) {
      tasks = await response.json();
    } else {
      throw new Error('Backend not available');
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
    // Fallback to local storage
    loadTasksFromLocalStorage();
  }
  
  displayTasks();
  updateDayCounters();
  setupAllAlarms();
}

// Display tasks
function displayTasks() {
  list.innerHTML = '';
  
  let filteredTasks = tasks;
  if (currentFilter) {
    filteredTasks = tasks.filter(task => task.day === currentFilter);
  }
  
  filteredTasks.forEach(task => {
    displayTask(task);
  });
}

// Display individual task
function displayTask(task) {
  const li = document.createElement('li');
  if (task.alarmTime) {
    li.classList.add('has-alarm');
  }
  
  const taskDetails = [];
  if (task.day) {
    taskDetails.push(`<span class="task-day">${task.day.charAt(0).toUpperCase() + task.day.slice(1)}</span>`);
  }
  if (task.alarmTime) {
    taskDetails.push(`<span class="task-alarm">🔔 ${task.alarmTime}</span>`);
  }
  
  li.innerHTML = `
    <div class="task-content">
      <div class="task-text">${task.text}</div>
      <div class="task-details">
        ${taskDetails.join('')}
      </div>
    </div>
    <div class="task-actions">
      <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
    </div>
  `;
  
  list.appendChild(li);
}

// Delete task
async function deleteTask(id) {
  try {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Backend not available');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }
  
  // Remove from local array
  tasks = tasks.filter(task => task.id !== id);
  saveTasksToLocalStorage();
  displayTasks();
  updateDayCounters();
  
  // Clear any alarms for this task
  clearAlarmForTask(id);
}

// Update day counters
function updateDayCounters() {
  const dayItems = document.querySelectorAll('.day-item');
  
  dayItems.forEach(item => {
    const day = item.dataset.day;
    const count = tasks.filter(task => task.day === day).length;
    const counter = item.querySelector('.task-count');
    counter.textContent = count;
  });
}

// Setup alarm for a single task
function setupAlarmForTask(task) {
  if (!task.alarmTime || !task.day) return;
  
  const now = new Date();
  const taskDateTime = getTaskDateTime(task);
  
  if (taskDateTime > now) {
    const timeUntilAlarm = taskDateTime.getTime() - now.getTime();
    
    const timeoutId = setTimeout(() => {
      triggerAlarm(task);
    }, timeUntilAlarm);
    
    alarmTimeouts.push({ taskId: task.id, timeoutId });
  }
}

// Setup all alarms
function setupAllAlarms() {
  // Clear existing timeouts
  alarmTimeouts.forEach(({ timeoutId }) => clearTimeout(timeoutId));
  alarmTimeouts = [];
  
  tasks.forEach(task => {
    setupAlarmForTask(task);
  });
}

// Get task date and time
function getTaskDateTime(task) {
  const today = new Date();
  const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(task.day.toLowerCase());
  const currentDayIndex = today.getDay();
  
  let daysUntilTask = dayIndex - currentDayIndex;
  if (daysUntilTask < 0) {
    daysUntilTask += 7; // Next week
  }
  
  const taskDate = new Date(today);
  taskDate.setDate(today.getDate() + daysUntilTask);
  
  const [hours, minutes] = task.alarmTime.split(':');
  taskDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  return taskDate;
}

// Clear alarm for task
function clearAlarmForTask(taskId) {
  const alarmIndex = alarmTimeouts.findIndex(alarm => alarm.taskId === taskId);
  if (alarmIndex !== -1) {
    clearTimeout(alarmTimeouts[alarmIndex].timeoutId);
    alarmTimeouts.splice(alarmIndex, 1);
  }
}

// Trigger alarm
function triggerAlarm(task) {
  // Play alarm sound
  alarmAudio.currentTime = 0;
  alarmAudio.play().catch(e => console.log('Could not play alarm sound'));
  
  // Show notification
  showAlarmNotification(task);
  
  // Remove this alarm from timeouts
  clearAlarmForTask(task.id);
}

// Show alarm notification
function showAlarmNotification(task) {
  const notification = document.createElement('div');
  notification.className = 'alarm-notification';
  notification.innerHTML = `
    <strong>Task Reminder!</strong><br>
    ${task.text}
    <button onclick="this.parentElement.remove()" style="margin-left: 10px; background: none; border: 1px solid white; color: white; padding: 2px 6px; border-radius: 3px; cursor: pointer;">×</button>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 10000);
}

// Check for alarms (fallback)
function checkAlarms() {
  const now = new Date();
  const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
  
  tasks.forEach(task => {
    if (task.day === currentDay && task.alarmTime === currentTime && !task.alarmTriggered) {
      task.alarmTriggered = true;
      triggerAlarm(task);
    }
  });
}

// Local storage functions
function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem('taskTrackerTasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
}

function saveTasksToLocalStorage() {
  localStorage.setItem('taskTrackerTasks', JSON.stringify(tasks));
}
