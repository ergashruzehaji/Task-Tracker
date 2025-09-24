// Use relative URLs for API calls so it works both locally and in production
const API_BASE = window.location.origin;

// Initialize these inside DOMContentLoaded to ensure elements exist
let form, input, hourSelect, minuteSelect, prioritySelect, yearSelect, timeFormatToggle, alarmAudio;
// Initialize these inside DOMContentLoaded to ensure elements exist
let quickForm, cancelFormBtn, selectedDateTitle;
let notificationSidebar, closeNotificationsBtn, activeNotifications, mainContent;
let prevMonthBtn, nextMonthBtn, currentMonthDisplay, calendarDays;

let tasks = [];
let currentCalendarDate = new Date(); // Current calendar view
let selectedDate = null; // Selected calendar date
let alarmTimeouts = []; // Store alarm timeouts

let activeTaskNotifications = []; // Store active notifications
let notificationCheckInterval; // Store interval for checking notifications
let is24HourFormat = false; // Track current time format (false = 12h, true = 24h)

// Helper function to get combined time from dropdowns
function getSelectedTime() {
    const hour = hourSelect.value;
    const minute = minuteSelect.value;
    
    if (!hour || !minute) return '';
    
    return `${hour}:${minute}`;
}

// Initialize year selector with current year and future years
function initializeYearSelector() {
    console.log('Initializing year selector...');
    
    if (!yearSelect) {
        console.error('Year select element not found');
        return;
    }
    
    const currentYear = 2025; // Fixed to start from 2025
    const futureYears = 26; // Show 26 years (2025-2050 inclusive)
    
    yearSelect.innerHTML = ''; // Clear existing options
    
    for (let i = 0; i < futureYears; i++) {
        const year = currentYear + i;
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        
        // Set 2025 as selected by default
        if (year === currentYear) {
            option.selected = true;
        }
        
        yearSelect.appendChild(option);
        console.log(`Added year: ${year}`);
    }
    
    console.log(`Year selector initialized with ${yearSelect.options.length} options (2025-2050)`);
}

// Handle year change
function handleYearChange() {
    const selectedYear = parseInt(yearSelect.value);
    currentCalendarDate.setFullYear(selectedYear);
    updateCalendar();
}

// Initialize time selectors
function initializeTimeSelectors() {
    console.log('Initializing time selectors...');
    populateHourDropdown();
    populateMinuteDropdown();
    console.log('Time selectors initialization complete');
}

// Populate hour dropdown based on current format
function populateHourDropdown() {
    console.log('Populating hour dropdown in', is24HourFormat ? '24h' : '12h', 'format');
    
    if (!hourSelect) {
        console.error('Hour select element not found');
        return;
    }
    
    const selectedValue = hourSelect.value; // Preserve selection
    hourSelect.innerHTML = '<option value="">Hour</option>';
    
    if (is24HourFormat) {
        // 24-hour format (00-23)
        for (let i = 0; i < 24; i++) {
            const hour = i.toString().padStart(2, '0');
            const option = document.createElement('option');
            option.value = hour;
            option.textContent = hour + ':00';
            if (hour === selectedValue) option.selected = true;
            hourSelect.appendChild(option);
        }
        console.log('Added 24 hours in 24h format');
    } else {
        // 12-hour format with AM/PM
        const hours = [
            {value: '00', label: '12 AM'}, {value: '01', label: '1 AM'}, {value: '02', label: '2 AM'},
            {value: '03', label: '3 AM'}, {value: '04', label: '4 AM'}, {value: '05', label: '5 AM'},
            {value: '06', label: '6 AM'}, {value: '07', label: '7 AM'}, {value: '08', label: '8 AM'},
            {value: '09', label: '9 AM'}, {value: '10', label: '10 AM'}, {value: '11', label: '11 AM'},
            {value: '12', label: '12 PM'}, {value: '13', label: '1 PM'}, {value: '14', label: '2 PM'},
            {value: '15', label: '3 PM'}, {value: '16', label: '4 PM'}, {value: '17', label: '5 PM'},
            {value: '18', label: '6 PM'}, {value: '19', label: '7 PM'}, {value: '20', label: '8 PM'},
            {value: '21', label: '9 PM'}, {value: '22', label: '10 PM'}, {value: '23', label: '11 PM'}
        ];
        
        hours.forEach(hour => {
            const option = document.createElement('option');
            option.value = hour.value;
            option.textContent = hour.label;
            if (hour.value === selectedValue) option.selected = true;
            hourSelect.appendChild(option);
        });
        console.log('Added 24 hours in 12h format');
    }
    
    console.log(`Hour dropdown populated with ${hourSelect.options.length - 1} options`);
}

// Populate minute dropdown (5-minute increments)
function populateMinuteDropdown() {
    console.log('Populating minute dropdown...');
    
    if (!minuteSelect) {
        console.error('Minute select element not found');
        return;
    }
    
    const selectedValue = minuteSelect.value; // Preserve selection
    minuteSelect.innerHTML = '<option value="">Min</option>';
    
    // 5-minute increments: 00, 05, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55
    for (let i = 0; i < 60; i += 5) {
        const minute = i.toString().padStart(2, '0');
        const option = document.createElement('option');
        option.value = minute;
        option.textContent = minute;
        if (minute === selectedValue) option.selected = true;
        minuteSelect.appendChild(option);
        console.log(`Added minute: ${minute}`);
    }
    
    console.log(`Minute dropdown populated with ${minuteSelect.options.length - 1} options`);
}

// Toggle time format
function toggleTimeFormat() {
    console.log('Toggling time format from', is24HourFormat ? '24h' : '12h');
    is24HourFormat = !is24HourFormat;
    
    if (timeFormatToggle) {
        timeFormatToggle.textContent = is24HourFormat ? '24h' : '12h';
        console.log('Updated toggle button to:', timeFormatToggle.textContent);
    }
    
    populateHourDropdown();
    console.log('Time format toggled to', is24HourFormat ? '24h' : '12h');
}

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing components...');
    
    // Initialize DOM elements
    form = document.getElementById('task-form');
    input = document.getElementById('task-input');
    hourSelect = document.getElementById('hour-select');
    minuteSelect = document.getElementById('minute-select');
    prioritySelect = document.getElementById('priority-select');
    yearSelect = document.getElementById('year-select');
    timeFormatToggle = document.getElementById('time-format-toggle');
    alarmAudio = document.getElementById('alarm-audio');
    
    // Initialize form elements
    quickForm = document.getElementById('quick-task-form');
    cancelFormBtn = document.getElementById('cancel-form');
    selectedDateTitle = document.getElementById('selected-date');
    
    // Initialize notification elements
    notificationSidebar = document.getElementById('notification-sidebar');
    closeNotificationsBtn = document.getElementById('close-notifications');
    activeNotifications = document.getElementById('active-notifications');
    mainContent = document.querySelector('.main-content');
    
    // Initialize calendar elements
    prevMonthBtn = document.getElementById('prev-month');
    nextMonthBtn = document.getElementById('next-month');
    currentMonthDisplay = document.getElementById('current-month');
    calendarDays = document.getElementById('calendar-days');
    
    console.log('Elements found:', {
        form: !!form,
        input: !!input,
        hourSelect: !!hourSelect,
        minuteSelect: !!minuteSelect,
        prioritySelect: !!prioritySelect,
        yearSelect: !!yearSelect,
        timeFormatToggle: !!timeFormatToggle,
        alarmAudio: !!alarmAudio
    });
    
    loadTasks();
    initializeCalendar();
    setupFormHandlers();
    setupNotificationSystem();
    startNotificationChecker();
    
    // Initialize dropdowns with debugging
    console.log('Initializing dropdowns...');
    initializeYearSelector();
    initializeTimeSelectors();
    
    // Add event listeners with null checks
    if (yearSelect) {
        yearSelect.addEventListener('change', handleYearChange);
        console.log('Year select event listener added');
    }
    
    if (timeFormatToggle) {
        timeFormatToggle.addEventListener('click', toggleTimeFormat);
        console.log('Time format toggle event listener added');
    }
    
    console.log('All components initialized');
});

// Setup form handlers
function setupFormHandlers() {
    // Quick form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const taskText = input.value.trim();
        const selectedTime = getSelectedTime();
        const selectedPriority = prioritySelect.value;
        
        if (taskText === '' || !selectedDate) return;
        
        const task = {
            id: Date.now(),
            text: taskText,
            date: selectedDate,
            alarmTime: selectedTime,
            priority: selectedPriority,
            completed: false,
            acknowledged: false,
            createdAt: new Date().toISOString()
        };
        
        addTask(task);
        
        // Clear form and hide it
        input.value = '';
        hourSelect.value = '';
        minuteSelect.value = '';
        prioritySelect.value = 'medium';
        hideQuickForm();
    });
    
    // Cancel form handler
    cancelFormBtn.addEventListener('click', hideQuickForm);
}

// Show quick form for selected date
function showQuickForm(dateString) {
    selectedDate = dateString;
    const date = new Date(dateString);
    selectedDateTitle.textContent = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    quickForm.style.display = 'block';
    input.focus();
}

// Hide quick form
function hideQuickForm() {
    quickForm.style.display = 'none';
    selectedDate = null;
}

// Notification System Functions
function setupNotificationSystem() {
    // Close sidebar handler
    closeNotificationsBtn.addEventListener('click', hideSidebar);
    
    // Click outside to close
    document.addEventListener('click', (e) => {
        if (notificationSidebar.classList.contains('show') && 
            !notificationSidebar.contains(e.target) && 
            !e.target.closest('.calendar-day')) {
            hideSidebar();
        }
    });
}

function startNotificationChecker() {
    // Check for active tasks every minute
    notificationCheckInterval = setInterval(checkForActiveNotifications, 60000);
    // Initial check
    checkForActiveNotifications();
}

function checkForActiveNotifications() {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const today = now.toISOString().split('T')[0];
    
    // Find tasks that are due now or within the next 15 minutes
    const activeTasksToday = tasks.filter(task => {
        if (task.completed || !task.alarmTime || task.acknowledged) return false;
        
        const taskDate = new Date(task.date);
        const isToday = taskDate.toDateString() === now.toDateString();
        
        if (!isToday) return false;
        
        const [taskHour, taskMinute] = task.alarmTime.split(':').map(Number);
        const taskTime = new Date(now);
        taskTime.setHours(taskHour, taskMinute, 0, 0);
        
        const timeDiff = taskTime.getTime() - now.getTime();
        const minutesDiff = timeDiff / (1000 * 60);
        
        // Show if due now or within next 15 minutes
        return minutesDiff >= -5 && minutesDiff <= 15;
    });
    
    if (activeTasksToday.length > 0) {
        updateNotificationSidebar(activeTasksToday);
        showSidebar();
    } else {
        hideSidebar();
    }
}

function updateNotificationSidebar(activeTasks) {
    activeNotifications.innerHTML = '';
    
    activeTasks.forEach(task => {
        const notificationItem = createNotificationItem(task);
        activeNotifications.appendChild(notificationItem);
    });
}

function createNotificationItem(task) {
    const now = new Date();
    const [taskHour, taskMinute] = task.alarmTime.split(':').map(Number);
    const taskTime = new Date(now);
    taskTime.setHours(taskHour, taskMinute, 0, 0);
    
    const timeDiff = taskTime.getTime() - now.getTime();
    const minutesDiff = Math.round(timeDiff / (1000 * 60));
    
    let urgencyClass = '';
    let timeText = '';
    
    if (minutesDiff <= 0) {
        urgencyClass = 'urgent';
        timeText = 'Due now!';
    } else if (minutesDiff <= 5) {
        urgencyClass = 'due-soon';
        timeText = `Due in ${minutesDiff} minute${minutesDiff !== 1 ? 's' : ''}`;
    } else {
        timeText = `Due in ${minutesDiff} minutes`;
    }
    
    const notificationDiv = document.createElement('div');
    notificationDiv.className = `notification-item ${urgencyClass}`;
    notificationDiv.innerHTML = `
        <div class="notification-task-name">${task.text}</div>
        <div class="notification-time">
            <span>🕐 ${task.alarmTime}</span>
            <span style="margin-left: 10px; font-weight: bold;">${timeText}</span>
        </div>
        <div class="notification-actions">
            <button class="acknowledge-btn" onclick="acknowledgeTask(${task.id})">Acknowledge</button>
            <button class="snooze-btn" onclick="snoozeTask(${task.id})">Snooze 5m</button>
            <button class="complete-btn" onclick="completeTaskFromNotification(${task.id})">Complete</button>
        </div>
    `;
    
    return notificationDiv;
}

function showSidebar() {
    notificationSidebar.classList.add('show');
    mainContent.classList.add('sidebar-open');
}

function hideSidebar() {
    notificationSidebar.classList.remove('show');
    mainContent.classList.remove('sidebar-open');
}

// Task Action Functions
function acknowledgeTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        // Mark as acknowledged (prevent future notifications for today)
        task.acknowledged = true;
        saveTasksToLocalStorage();
        checkForActiveNotifications(); // Refresh sidebar
    }
}

function snoozeTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        // Snooze for 5 minutes by updating alarm time
        const [hours, minutes] = task.alarmTime.split(':').map(Number);
        const newTime = new Date();
        newTime.setHours(hours, minutes + 5);
        
        task.alarmTime = newTime.getHours().toString().padStart(2, '0') + ':' + 
                        newTime.getMinutes().toString().padStart(2, '0');
        
        saveTasksToLocalStorage();
        checkForActiveNotifications(); // Refresh sidebar
        
        // Update alarm timeout
        clearAlarmForTask(taskId);
        setupAlarmForTask(task);
    }
}

function completeTaskFromNotification(taskId) {
    toggleTaskCompletion(taskId);
    checkForActiveNotifications(); // Refresh sidebar
}

// Form submission
form.addEventListener('submit', function(e) {
  e.preventDefault();

  const taskText = input.value.trim();
  const selectedDay = daySelect.value;
  const selectedTaskDate = taskDate.value;
  const selectedTime = getSelectedTime();
  const selectedPriority = prioritySelect.value;
  
  if (taskText === '') return;

  // Create date object for the task
  const taskDateObj = selectedTaskDate ? new Date(selectedTaskDate) : new Date();
  
  const task = {
    id: Date.now(),
    text: taskText,
    day: selectedDay,
    date: taskDateObj.toISOString().split('T')[0], // YYYY-MM-DD format
    fullDate: taskDateObj,
    alarmTime: selectedTime,
    priority: selectedPriority,
    completed: false,
    createdAt: new Date().toISOString()
  };

  addTask(task);
  
  // Clear form (but keep date for convenience)
  input.value = '';
  daySelect.value = '';
  hourSelect.value = '';
  minuteSelect.value = '';
  // Keep date and priority selected for user convenience
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
  
  // Refresh calendar and check for notifications
  renderCalendar();
  setupAlarmForTask(task);
  checkForActiveNotifications();
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
  
  // Initialize calendar with loaded tasks
  renderCalendar();
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
  if (task.completed) {
    li.classList.add('completed');
  }
  
  const taskDetails = [];
  
  // Add date
  if (task.date) {
    const taskDate = new Date(task.date);
    const formattedDate = taskDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      ...(taskDate.getFullYear() !== new Date().getFullYear() && { year: 'numeric' })
    });
    taskDetails.push(`<span class="task-day">📅 ${formattedDate}</span>`);
  }
  
  // Add day of week if specified
  if (task.day) {
    taskDetails.push(`<span class="task-day">${task.day.charAt(0).toUpperCase() + task.day.slice(1)}</span>`);
  }
  
  // Add alarm time
  if (task.alarmTime) {
    taskDetails.push(`<span class="task-alarm">🔔 ${task.alarmTime}</span>`);
  }
  
  li.innerHTML = `
    <div class="task-content">
      <div style="display: flex; align-items: center;">
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
               onchange="toggleTaskCompletion(${task.id})" style="margin-right: 10px;">
        <div class="task-priority ${task.priority || 'medium'}"></div>
        <div class="task-text ${task.completed ? 'completed' : ''}">${task.text}</div>
      </div>
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

// Toggle task completion
async function toggleTaskCompletion(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  
  task.completed = !task.completed;
  
  try {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    
    if (!response.ok) {
      throw new Error('Backend not available');
    }
  } catch (error) {
    console.error('Error updating task:', error);
  }
  
  saveTasksToLocalStorage();
  renderCalendar();
  checkForActiveNotifications();
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
  
  // Refresh calendar and notifications
  renderCalendar();
  checkForActiveNotifications();
  
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
  
  // Check for active notifications and show sidebar if needed
  checkForActiveNotifications();
  
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

// Calendar functionality
function setupCalendar() {
  renderCalendar();
  
  prevMonthBtn.addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    renderCalendar();
  });
  
  nextMonthBtn.addEventListener('click', () => {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    renderCalendar();
  });
}

function renderCalendar() {
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  
  // Update month display
  currentMonthDisplay.textContent = new Intl.DateTimeFormat('en-US', { 
    month: 'long', 
    year: 'numeric' 
  }).format(currentCalendarDate);
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Clear calendar
  calendarDays.innerHTML = '';
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    const prevMonthDay = new Date(year, month, -startingDayOfWeek + i + 1);
    const dayElement = createCalendarDay(prevMonthDay, true);
    calendarDays.appendChild(dayElement);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayElement = createCalendarDay(date, false);
    calendarDays.appendChild(dayElement);
  }
  
  // Add days from next month to fill the grid
  const totalCells = calendarDays.children.length;
  const remainingCells = 42 - totalCells; // 6 rows × 7 days
  for (let day = 1; day <= remainingCells && remainingCells < 14; day++) {
    const nextMonthDay = new Date(year, month + 1, day);
    const dayElement = createCalendarDay(nextMonthDay, true);
    calendarDays.appendChild(dayElement);
  }
}

function createCalendarDay(date, otherMonth) {
  const dayElement = document.createElement('div');
  dayElement.className = 'calendar-day';
  dayElement.textContent = date.getDate();
  
  if (otherMonth) {
    dayElement.classList.add('other-month');
  }
  
  // Check if it's today
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    dayElement.classList.add('today');
  }
  
  // Check if this date has tasks
  const dateString = date.toISOString().split('T')[0];
  const dayTasks = tasks.filter(task => task.date === dateString);
  
  if (dayTasks.length > 0) {
    dayElement.classList.add('has-tasks');
    
    // Add priority indicator for highest priority task
    const highestPriority = getHighestPriority(dayTasks);
    const indicator = document.createElement('div');
    indicator.className = `task-indicator ${highestPriority}`;
    dayElement.appendChild(indicator);
  }
  
  // Add click handler
  dayElement.addEventListener('click', () => {
    // Remove previous selection
    document.querySelectorAll('.calendar-day.selected').forEach(el => {
      el.classList.remove('selected');
    });
    
    // Add selection to clicked day
    dayElement.classList.add('selected');
    
    // Show quick form for adding tasks to this date
    showQuickForm(dateString);
  });
  
  return dayElement;
}

function getHighestPriority(tasks) {
  const priorities = ['high', 'medium', 'low'];
  for (const priority of priorities) {
    if (tasks.some(task => task.priority === priority)) {
      return priority;
    }
  }
  return 'low';
}

// Filter functionality
function setupFilters() {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active filter button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Apply filter
      const filter = btn.dataset.filter;
      applyFilter(filter);
    });
  });
}

function applyFilter(filter) {
  currentFilter = filter;
  
  switch (filter) {
    case 'today':
      filterTasksByDate(new Date().toISOString().split('T')[0]);
      break;
    case 'week':
      filterTasksByWeek();
      break;
    case 'month':
      filterTasksByMonth();
      break;
    default:
      filterTasksByDay('');
      break;
  }
}

function filterTasksByDate(dateString) {
  currentFilter = 'date';
  selectedDate = dateString;
  const date = new Date(dateString);
  currentDayTitle.textContent = `Tasks for ${date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`;
  displayTasks();
}

function filterTasksByWeek() {
  currentFilter = 'week';
  currentDayTitle.textContent = 'This Week\'s Tasks';
  displayTasks();
}

function filterTasksByMonth() {
  currentFilter = 'month';
  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  currentDayTitle.textContent = `${monthName} Tasks`;
  displayTasks();
}

// Enhanced display tasks function
function displayTasks() {
  list.innerHTML = '';
  
  let filteredTasks = [...tasks];
  
  // Apply current filter
  if (currentFilter === 'date' && selectedDate) {
    filteredTasks = tasks.filter(task => task.date === selectedDate);
  } else if (currentFilter === 'today') {
    const today = new Date().toISOString().split('T')[0];
    filteredTasks = tasks.filter(task => task.date === today);
  } else if (currentFilter === 'week') {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    filteredTasks = tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate >= weekStart && taskDate <= weekEnd;
    });
  } else if (currentFilter === 'month') {
    const now = new Date();
    filteredTasks = tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.getMonth() === now.getMonth() && 
             taskDate.getFullYear() === now.getFullYear();
    });
  } else if (currentFilter && currentFilter !== 'all') {
    // Legacy day filter
    filteredTasks = tasks.filter(task => task.day === currentFilter);
  }
  
  // Sort by date, then by priority, then by time
  filteredTasks.sort((a, b) => {
    // First by date
    if (a.date !== b.date) {
      return new Date(a.date) - new Date(b.date);
    }
    
    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    // Finally by alarm time
    if (a.alarmTime && b.alarmTime) {
      return a.alarmTime.localeCompare(b.alarmTime);
    }
    
    return 0;
  });
  
  filteredTasks.forEach(task => {
    displayTask(task);
  });
  
  // Update calendar after task changes
  renderCalendar();
  updateDayCounters();
}

// Local storage functions
function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem('taskTrackerTasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks).map(task => {
      // Ensure all tasks have the new properties
      return {
        ...task,
        date: task.date || new Date().toISOString().split('T')[0],
        priority: task.priority || 'medium',
        fullDate: task.fullDate ? new Date(task.fullDate) : new Date()
      };
    });
  }
}

function saveTasksToLocalStorage() {
  localStorage.setItem('taskTrackerTasks', JSON.stringify(tasks));
}

// Dashboard Functions
function updateDashboard() {
    updateDashboardStats();
    renderUpcomingTasks();
    updateProgressRing();
}

function updateDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(task => task.date === today);
    const completedToday = todayTasks.filter(task => task.completed).length;
    
    const thisWeek = getWeekTasks();
    const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed);
    
    const todayCountEl = document.getElementById('today-count');
    const weekCountEl = document.getElementById('week-count');
    const highPriorityCountEl = document.getElementById('high-priority-count');
    const totalCountEl = document.getElementById('total-count');
    
    if (todayCountEl) todayCountEl.textContent = completedToday + '/' + todayTasks.length;
    if (weekCountEl) weekCountEl.textContent = thisWeek.length;
    if (highPriorityCountEl) highPriorityCountEl.textContent = highPriorityTasks.length;
    if (totalCountEl) totalCountEl.textContent = tasks.length;
}

function getWeekTasks() {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate >= weekStart && taskDate <= weekEnd;
    });
}

function renderUpcomingTasks() {
    const upcomingContainer = document.querySelector('.upcoming-tasks');
    if (!upcomingContainer) return;
    
    const today = new Date();
    const upcoming = tasks
        .filter(task => !task.completed && new Date(task.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);
    
    if (upcoming.length === 0) {
        upcomingContainer.innerHTML = '<p style="opacity: 0.6; font-size: 14px;">No upcoming tasks</p>';
        return;
    }
    
    upcomingContainer.innerHTML = upcoming.map(task => `
        <div class="upcoming-task" onclick="selectTaskDate('${task.date}')">
            <div class="task-name">${task.text}</div>
            <div class="task-due">${formatDateForDisplay(new Date(task.date))}</div>
        </div>
    `).join('');
}

function selectTaskDate(dateString) {
    // Select the date in calendar and filter tasks
    selectedDate = dateString;
    taskDate.value = dateString;
    filterTasksByDate(dateString);
    
    // Update calendar display if needed
    const targetDate = new Date(dateString);
    if (targetDate.getMonth() !== currentCalendarDate.getMonth() || 
        targetDate.getFullYear() !== currentCalendarDate.getFullYear()) {
        currentCalendarDate = new Date(targetDate);
        renderCalendar();
    }
}

function updateProgressRing() {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(task => task.date === today);
    const completedToday = todayTasks.filter(task => task.completed).length;
    const percentage = todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0;
    
    const progressRing = document.querySelector('.progress-ring-circle');
    const progressText = document.querySelector('.progress-text');
    
    if (progressRing) {
        const radius = progressRing.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (percentage / 100) * circumference;
        
        progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
        progressRing.style.strokeDashoffset = offset;
    }
    
    if (progressText) {
        progressText.textContent = Math.round(percentage) + '%';
    }
}

// Quick Action Functions
function addQuickTask(daysFromToday = 0) {
    const taskText = prompt('Enter task:');
    if (taskText) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + daysFromToday);
        
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            priority: 'medium',
            date: targetDate.toISOString().split('T')[0],
            day: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][targetDate.getDay()],
            createdAt: new Date().toISOString()
        };
        
        addTask(task);
    }
}

function showOverdue() {
    const today = new Date().toISOString().split('T')[0];
    
    const overdueFilter = tasks.filter(task => 
        !task.completed && task.date < today
    );
    
    if (overdueFilter.length === 0) {
        alert('No overdue tasks!');
        return;
    }
    
    // Create a custom filter for overdue tasks
    currentFilter = 'overdue';
    currentDayTitle.textContent = 'Overdue Tasks';
    
    // Display only overdue tasks
    list.innerHTML = '';
    overdueFilter.forEach(task => {
        displayTask(task);
    });
}

function clearCompleted() {
    const completedTasks = tasks.filter(task => task.completed);
    
    if (completedTasks.length === 0) {
        alert('No completed tasks to clear!');
        return;
    }
    
    if (confirm(`Remove ${completedTasks.length} completed task(s)?`)) {
        // Delete completed tasks from backend
        completedTasks.forEach(async (task) => {
            try {
                await fetch(`${API_BASE}/tasks/${task.id}`, {
                    method: 'DELETE'
                });
            } catch (error) {
                console.error('Error deleting completed task:', error);
            }
        });
        
        // Remove from local array
        tasks = tasks.filter(task => !task.completed);
        saveTasksToLocalStorage();
        displayTasks();
        updateDashboard();
        renderCalendar();
    }
}

function formatDateForDisplay(date) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
    } else {
        return date.toLocaleDateString();
    }
}

// Initialize calendar and setup other components
function initializeCalendar() {
    setupCalendar();
    setupFilters();
    setupDayItems();
}

// Override the existing displayTasks function to include dashboard updates
const originalDisplayTasks = displayTasks;
displayTasks = function() {
    originalDisplayTasks.call(this);
    updateDashboard();
};

// Override the existing addTask function to include dashboard updates
const originalAddTask = addTask;
addTask = async function(task) {
    await originalAddTask.call(this, task);
    updateDashboard();
};
