// Use relative URLs for API calls so it works both locally and in production
const API_BASE = window.location.origin;

// Initialize these inside DOMContentLoaded to ensure elements exist
let form, input, prioritySelect, yearSelect, timeFormatToggle, alarmAudio;
// Initialize these inside DOMContentLoaded to ensure elements exist
let quickForm, cancelFormBtn, selectedDateTitle;
let notificationSidebar, closeNotificationsBtn, activeNotifications, mainContent;
let list; // Optional task list element (may not exist after sidebar removal)
let prevMonthBtn, nextMonthBtn, currentMonthDisplay, calendarDays;

let tasks = [];
let currentCalendarDate = new Date(); // Current calendar view
let selectedDate = null; // Selected calendar date
let alarmTimeouts = []; // Store alarm timeouts
let currentFilter = 'all'; // Current sidebar filter
let currentView = 'week'; // Current calendar view (day, week, month, year)
let timeSlots = []; // Time slots for the calendar

let activeTaskNotifications = []; // Store active notifications
let notificationCheckInterval; // Store interval for checking notifications
let is24HourFormat = false; // Track current time format (false = AM/PM, true = 24h)

// Helper function to format time inputs based on current format
function formatTimeDisplay(timeString) {
    if (!timeString) return timeString;
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    
    if (is24HourFormat) {
        return `${hours}:${minutes}`;
    } else {
        const suffix = hour < 12 ? 'AM' : 'PM';
        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${displayHour}:${minutes} ${suffix}`;
    }
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
  renderCurrentView();
}

// Initialize time format toggle
function initializeTimeFormatToggle() {
    console.log('Initializing time format toggle...');
    updateTimeFormatToggle();
    console.log('Time format toggle initialization complete');
}

// Update time format toggle button text
function updateTimeFormatToggle() {
    if (timeFormatToggle) {
        timeFormatToggle.textContent = is24HourFormat ? '24h' : 'AM/PM';
    }
}

// Sidebar removed

// Update stats panel
function updateStatsPanel() {
    const totalTasksEl = document.querySelector('#total-tasks');
    const todayTasksEl = document.querySelector('#today-tasks');
    const completedTasksEl = document.querySelector('#completed-tasks');
    const monthTasksEl = document.querySelector('#month-tasks');
    
    if (!totalTasksEl || !todayTasksEl || !completedTasksEl || !monthTasksEl) return;
    
    const today = new Date().toISOString().split('T')[0];
    const totalTasks = tasks.length;
    const todayTasks = tasks.filter(task => task.date === today).length;
    const completedTasks = tasks.filter(task => task.completed).length;
    
    // Calculate this month's tasks
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear;
    }).length;
    
    totalTasksEl.textContent = totalTasks;
    todayTasksEl.textContent = todayTasks;
  completedTasksEl.textContent = completedTasks;
  monthTasksEl.textContent = thisMonthTasks;
}

// Toggle between AM/PM and 24h formats
function toggleTimeFormat() {
  is24HourFormat = !is24HourFormat;
  updateTimeFormatToggle();
  // Re-render the calendar to update time display
  renderCurrentView();
}

// Remove old minute dropdown functions - no longer needed

// Initialize the time-slot calendar hours and controls
function initializeTimeslotCalendar() {
  // Build hour slots for 6 AM to 11 PM
  timeSlots = [];
  for (let h = 6; h <= 23; h++) {
    timeSlots.push({ hour: h, display: formatHour(h) });
  }
  setupViewControls();
  renderCurrentView();
}

function formatHour(h) {
  if (is24HourFormat) return `${h.toString().padStart(2, '0')}:00`;
  const suffix = h < 12 ? 'AM' : 'PM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12} ${suffix}`;
}

// Hook up view switching and period navigation
function setupViewControls() {
  const viewButtons = document.querySelectorAll('.view-btn');
  viewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      viewButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentView = btn.getAttribute('data-view') || 'week';
      renderCurrentView();
    });
  });

  const prevBtn = document.getElementById('prev-period');
  const nextBtn = document.getElementById('next-period');
  if (prevBtn) prevBtn.addEventListener('click', () => navigatePeriod(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigatePeriod(1));
}

function navigatePeriod(direction) {
  const d = new Date(currentCalendarDate);
  switch (currentView) {
    case 'day':
      d.setDate(d.getDate() + (direction > 0 ? 1 : -1));
      break;
    case 'week':
      d.setDate(d.getDate() + (direction > 0 ? 7 : -7));
      break;
    case 'month':
      d.setMonth(d.getMonth() + (direction > 0 ? 1 : -1));
      break;
    case 'year':
      d.setFullYear(d.getFullYear() + (direction > 0 ? 1 : -1));
      break;
  }
  currentCalendarDate = d;
  renderCurrentView();
}

function renderCurrentView() {
  const timeslotEl = document.getElementById('timeslot-calendar');
  const monthViewEl = document.getElementById('month-view');
  if (!timeslotEl || !monthViewEl) return;

  if (currentView === 'day' || currentView === 'week') {
    timeslotEl.classList.remove('hidden');
    monthViewEl.classList.add('hidden');
    renderTimeslotView();
  } else {
    timeslotEl.classList.add('hidden');
    monthViewEl.classList.remove('hidden');
    renderCalendar();
  }
  updatePeriodDisplay();
}

function updatePeriodDisplay() {
  const el = document.getElementById('current-period');
  if (!el) return;
  const date = new Date(currentCalendarDate);
  let text = '';
  switch (currentView) {
    case 'day':
      text = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      break;
    case 'week':
      const s = new Date(date);
      s.setDate(date.getDate() - date.getDay());
      const e = new Date(s);
      e.setDate(s.getDate() + 6);
      text = `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      break;
    case 'month':
      text = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      break;
    case 'year':
      text = date.getFullYear().toString();
      break;
  }
  el.textContent = text;
}

// Render timeslot view (day/week)
function renderTimeslotView() {
    const container = document.querySelector('.calendar-grid-container');
    if (!container) return;
    
    // Create time column
    const timeColumn = container.querySelector('.time-column');
    if (timeColumn) {
        let timeHtml = '<div class="time-header"></div>';
        timeSlots.forEach(slot => {
            timeHtml += `<div class="time-slot">${slot.display}</div>`;
        });
        timeColumn.innerHTML = timeHtml;
    }
    
    // Create days grid
    const daysGrid = container.querySelector('.days-grid');
    if (daysGrid) {
        const days = getDaysForView();
        daysGrid.style.gridTemplateColumns = `repeat(${days.length}, 1fr)`;
        
        let daysHtml = '';
        days.forEach(day => {
            daysHtml += createDayColumn(day);
        });
        
        daysGrid.innerHTML = daysHtml;
        
        // Add click handlers for time blocks
        addTimeBlockHandlers();
    }
}

// Get days for current view
function getDaysForView() {
    const days = [];
    const baseDate = new Date(currentCalendarDate);
    
    if (currentView === 'day') {
        days.push(new Date(baseDate));
    } else if (currentView === 'week') {
        // Start from Sunday of the current week
        const startOfWeek = new Date(baseDate);
        startOfWeek.setDate(baseDate.getDate() - baseDate.getDay());
        
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            days.push(day);
        }
    }
    
    return days;
}

// Create day column HTML
function createDayColumn(date) {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = date.getDate();
    const dateStr = date.toISOString().split('T')[0];
    
    let html = `
        <div class="day-column" data-date="${dateStr}">
            <div class="day-header">
                <div class="day-name">${dayName}</div>
                <div class="day-number">${dayNumber}</div>
            </div>
    `;
    
    // Add time blocks for each hour
    timeSlots.forEach(slot => {
        const tasksForSlot = getTasksForTimeSlot(dateStr, slot.hour);
        const hasTask = tasksForSlot.length > 0;
        
        html += `
            <div class="time-block ${hasTask ? 'has-task' : ''}" 
                 data-date="${dateStr}" 
                 data-hour="${slot.hour}">
        `;
        
        // Add task blocks
        tasksForSlot.forEach(task => {
            const timeRange = task.endTime ? 
                `${formatTimeDisplay(task.startTime)} - ${formatTimeDisplay(task.endTime)}` : 
                formatTimeDisplay(task.startTime);
            html += `
                <div class="task-block ${task.priority}-priority" title="${task.text} (${timeRange})">
                    <div class="task-title">${task.text}</div>
                    <div class="task-time">${timeRange}</div>
                </div>
            `;
        });
        
        html += '</div>';
    });
    
    html += '</div>';
    return html;
}

// Get tasks for specific time slot
function getTasksForTimeSlot(dateStr, hour) {
    return tasks.filter(task => {
        if (task.date !== dateStr) return false;
        
        // Check if task falls in this hour slot
        if (task.startTime) {
            const taskHour = parseInt(task.startTime.split(':')[0]);
            if (task.endTime) {
                const endHour = parseInt(task.endTime.split(':')[0]);
                const endMinute = parseInt(task.endTime.split(':')[1]);
                // Task spans from start hour through end hour (inclusive if there are minutes)
                return hour >= taskHour && (hour < endHour || (hour === endHour && endMinute > 0));
            } else {
                // No end time, show in start hour only
                return hour === taskHour;
            }
        }
        
        return false;
    });
}

// Add click handlers for time blocks
function addTimeBlockHandlers() {
    document.querySelectorAll('.time-block').forEach(block => {
        block.addEventListener('click', function() {
            const date = this.dataset.date;
            const hour = parseInt(this.dataset.hour);
            
            // Set selected date and show form
            selectedDate = date;
            
            // Pre-fill start time
            const startTimeInput = document.getElementById('start-time');
            if (startTimeInput) {
                startTimeInput.value = `${hour.toString().padStart(2, '0')}:00`;
            }
            
            showTaskForm();
        });
    });
}

// Render traditional calendar (month view)
function renderTraditionalCalendar() {
    // Use existing renderCalendar function for month view
    renderCalendar();
}

// Highlight task in calendar when clicked from sidebar
function highlightTaskInCalendar(taskId) {
    const task = tasks.find(t => t.id.toString() === taskId);
    if (!task) return;
    
    // Navigate to the task's date
    const taskDate = new Date(task.date);
    currentCalendarDate.setFullYear(taskDate.getFullYear());
    currentCalendarDate.setMonth(taskDate.getMonth());
    
    // Re-render calendar
    renderCalendar();
    
    // Highlight the specific day
    setTimeout(() => {
        const dayElements = document.querySelectorAll('.calendar-day');
        dayElements.forEach(day => {
            if (day.dataset.date === task.date) {
                day.classList.add('highlighted');
                day.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Remove highlight after 3 seconds
                setTimeout(() => {
                    day.classList.remove('highlighted');
                }, 3000);
            }
        });
    }, 100);
}

// Update priority select color based on selected value
function updatePrioritySelectColor() {
    if (!prioritySelect) return;
    
    const selectedPriority = prioritySelect.value;
    
    // Remove existing data-priority attributes
    prioritySelect.removeAttribute('data-priority');
    
    // Set new data-priority attribute based on selection
    if (selectedPriority) {
        prioritySelect.setAttribute('data-priority', selectedPriority);
    }
    
    console.log('Priority select color updated to:', selectedPriority);
}

// Initialize when both DOM and window are fully loaded
function initializeApp() {
    console.log('🚀 Initializing Task Tracker App...');
    console.log('🔧 Script version: 2025-09-24-v11 - FIXED SIDEBAR VISIBILITY');
    
    try {
    console.log('🚀 DOM loaded, initializing Task Tracker components...');
    console.log('🔧 Script version: 2025-09-24-v6 - DEBUGGING STUCK NAVIGATION');
    
    // Debug: Check if all elements exist
    const debugElements = {
        'prev-period': document.getElementById('prev-period'),
        'next-period': document.getElementById('next-period'), 
        'current-period': document.getElementById('current-period'),
        'year-select': document.getElementById('year-select'),
        'time-format-toggle': document.getElementById('time-format-toggle'),
        'start-time': document.getElementById('start-time'),
        'end-time': document.getElementById('end-time')
    };
    
    console.log('🔍 Element Debug Check:', debugElements);
    
    // Report missing elements (using new IDs)
    Object.entries(debugElements).forEach(([name, element]) => {
        if (!element) {
            console.warn(`ℹ️ Optional element not found: ${name}`);
        } else {
            console.log(`✅ Found element: ${name}`);
        }
    });
    
    // Initialize DOM elements with error checking
    form = document.getElementById('task-form');
    input = document.getElementById('task-input');
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
  // Optional list element if present in DOM
  list = document.getElementById('task-list') || document.getElementById('tasks-list') || document.querySelector('.task-list') || null;
    
    // Initialize calendar elements
    // Support both legacy (prev/next/current-month) and new (prev/next/current-period) IDs
    prevMonthBtn = document.getElementById('prev-month') || document.getElementById('prev-period');
    nextMonthBtn = document.getElementById('next-month') || document.getElementById('next-period');
    currentMonthDisplay = document.getElementById('current-month') || document.getElementById('current-period');
    calendarDays = document.getElementById('calendar-days');
    if (!calendarDays) {
        console.warn('⚠️ calendar-days container not found; month view may be hidden initially.');
    }
    
    console.log('Elements found:', {
        form: !!form,
        input: !!input,
        prioritySelect: !!prioritySelect,
        yearSelect: !!yearSelect,
        timeFormatToggle: !!timeFormatToggle,
        alarmAudio: !!alarmAudio
    });
    
    loadTasks();
    initializeCalendar();
    setupFormHandlers();
    setupNotificationSystem();
  // Sidebar removed
    initializeAlarmAudio(); // Initialize alarm sound system  
    setupAlarmHandlers(); // Setup alarm UI handlers
    startNotificationChecker();
    
    // Initialize dropdowns with debugging
    console.log('🔧 Initializing dropdowns...');
    
    // Force year selector population with retry mechanism
    setTimeout(() => {
        console.log('🔄 Running year selector initialization...');
        initializeYearSelector();
        initializeTimeFormatToggle();
        
        // Verify they worked
        setTimeout(() => {
            console.log('📊 Component initialization status:');
            console.log('Year options:', yearSelect ? yearSelect.options.length : 'null');
            console.log('Time format toggle:', !!timeFormatToggle);
        }, 100);
    }, 100);
    
    // Add event listeners with null checks
    if (yearSelect) {
        yearSelect.addEventListener('change', handleYearChange);
        console.log('Year select event listener added');
    }
    
    if (timeFormatToggle) {
        timeFormatToggle.addEventListener('click', toggleTimeFormat);
        console.log('Time format toggle event listener added');
    }
    
    // Add priority select color functionality
    if (prioritySelect) {
        // Set initial color based on default selection
        setTimeout(() => {
            updatePrioritySelectColor();
            console.log('🎨 Priority select initial color set');
        }, 150);
        
        prioritySelect.addEventListener('change', updatePrioritySelectColor);
        console.log('🎨 Priority select color functionality added');
    }
    
        console.log('All components initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing app:', error);
    }
}

// Load when DOM is ready and when window is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);
window.addEventListener('load', function() {
    console.log('🔄 Window fully loaded, ensuring app is initialized');
    // Reinitialize if something failed
    setTimeout(initializeApp, 100);
});

// Setup form handlers
function setupFormHandlers() {
    // Quick form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const taskText = input.value.trim();
        const selectedPriority = prioritySelect.value;
        const startTime = document.getElementById('start-time')?.value || '';
        const endTime = document.getElementById('end-time')?.value || '';
        
        if (taskText === '' || !selectedDate) return;
        
        const task = {
            id: Date.now(),
            text: taskText,
            date: selectedDate,
            startTime: startTime,
            endTime: endTime,
            alarmTime: startTime, // Use start time for alarm
            priority: selectedPriority,
            completed: false,
            acknowledged: false,
            createdAt: new Date().toISOString()
        };
        
        addTask(task);
        
        // Clear form and hide it
        input.value = '';
        document.getElementById('start-time').value = '';
        document.getElementById('end-time').value = '';
        prioritySelect.value = 'medium';
        hideQuickForm();
    });
    
    // Cancel form handler
    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', hideQuickForm);
    }
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

// Alternative function name for consistency
function showTaskForm() {
    if (selectedDate) {
        showQuickForm(selectedDate);
    }
}

// Hide quick form
function hideQuickForm() {
    quickForm.style.display = 'none';
    selectedDate = null;
}

// Notification System Functions
function setupNotificationSystem() {
    // Close sidebar handler
    if (closeNotificationsBtn) {
        closeNotificationsBtn.addEventListener('click', hideSidebar);
    }
    
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
    const today = now.toISOString().split('T')[0];
    
    // Find tasks that are due now or within the next 15 minutes based on start time
    const activeTasksToday = tasks.filter(task => {
        if (task.completed || !task.startTime || task.acknowledged) return false;
        
        const taskDate = new Date(task.date);
        const isToday = taskDate.toDateString() === now.toDateString();
        
        if (!isToday) return false;
        
        const [taskHour, taskMinute] = task.startTime.split(':').map(Number);
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
    const [taskHour, taskMinute] = task.startTime.split(':').map(Number);
    const taskTime = new Date(now);
    taskTime.setHours(taskHour, taskMinute, 0, 0);
    
    const timeDiff = taskTime.getTime() - now.getTime();
    const minutesDiff = Math.round(timeDiff / (1000 * 60));
    
    let urgencyClass = '';
    let timeText = '';
    
    if (minutesDiff <= 0) {
        urgencyClass = 'urgent';
        timeText = 'Starting now!';
    } else if (minutesDiff <= 5) {
        urgencyClass = 'due-soon';
        timeText = `Starts in ${minutesDiff} minute${minutesDiff !== 1 ? 's' : ''}`;
    } else {
        timeText = `Starts in ${minutesDiff} minutes`;
    }
    
    const timeRange = task.endTime ? 
        `${formatTimeDisplay(task.startTime)} - ${formatTimeDisplay(task.endTime)}` : 
        formatTimeDisplay(task.startTime);
    
    const notificationDiv = document.createElement('div');
    notificationDiv.className = `notification-item ${urgencyClass}`;
    notificationDiv.innerHTML = `
        <div class="notification-task-name">${task.text}</div>
        <div class="notification-time">
            <span>🕐 ${timeRange}</span>
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
        // Snooze for 5 minutes by updating start time
        const [hours, minutes] = task.startTime.split(':').map(Number);
        const newTime = new Date();
        newTime.setHours(hours, minutes + 5);
        
        task.startTime = newTime.getHours().toString().padStart(2, '0') + ':' + 
                         newTime.getMinutes().toString().padStart(2, '0');
        
        // Also update end time if it exists
        if (task.endTime) {
            const [endHours, endMinutes] = task.endTime.split(':').map(Number);
            const newEndTime = new Date();
            newEndTime.setHours(endHours, endMinutes + 5);
            
            task.endTime = newEndTime.getHours().toString().padStart(2, '0') + ':' + 
                          newEndTime.getMinutes().toString().padStart(2, '0');
        }
        
        // Update alarm time to match new start time
        task.alarmTime = task.startTime;
        
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

// Old form submission handler removed - using new handler above

// Add task
async function addTask(task) {
  try {
    const response = await fetch(`${API_BASE}/api/tasks`, {
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
  renderCurrentView(); // Also refresh timeslot view
  setupAlarmForTask(task);
  checkForActiveNotifications();
  
  // Sidebar removed
}

// Load tasks
async function loadTasks() {
  try {
    const response = await fetch(`${API_BASE}/api/tasks`);
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
  
  // Sidebar removed
}

// Display tasks
function displayTasks() {
  if (!list) return;
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
  
  if (!list) return;
  list.appendChild(li);
}

// Toggle task completion
async function toggleTaskCompletion(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  
  task.completed = !task.completed;
  
  try {
    const response = await fetch(`${API_BASE}/api/tasks/${task.date}/${id}`, {
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
async function deleteTask(date, id) {
  try {
    const response = await fetch(`${API_BASE}/api/tasks/${date}/${id}`, {
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

// Setup alarm for a single task based on start time
function setupAlarmForTask(task) {
  if (!task.startTime || !task.date) return;
  
  const now = new Date();
  const taskDateTime = getTaskDateTimeFromStartTime(task);
  
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

// Get task date and time from start time
function getTaskDateTimeFromStartTime(task) {
  if (!task.startTime || !task.date) return null;
  
  const taskDate = new Date(task.date);
  const [hours, minutes] = task.startTime.split(':');
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

// Enhanced Alarm System with Audio Generation
let alarmContext = null;
let alarmOscillator = null;
let alarmGainNode = null;
let alarmInterval = null;
let alarmCountdown = 60;

// Create audio context for alarm sound
function initializeAlarmAudio() {
    try {
        alarmContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.warn('Web Audio API not supported');
    }
}

// Generate alarm sound programmatically
function playAlarmSound() {
    if (!alarmContext) return;
    
    // Stop any existing alarm
    stopAlarmSound();
    
    // Create oscillator for alarm tone
    alarmOscillator = alarmContext.createOscillator();
    alarmGainNode = alarmContext.createGain();
    
    // Connect audio nodes
    alarmOscillator.connect(alarmGainNode);
    alarmGainNode.connect(alarmContext.destination);
    
    // Configure alarm sound (urgent beeping)
    alarmOscillator.frequency.setValueAtTime(800, alarmContext.currentTime); // High frequency
    alarmGainNode.gain.setValueAtTime(0.3, alarmContext.currentTime); // Loud volume
    
    // Create beeping pattern
    let time = alarmContext.currentTime;
    for (let i = 0; i < 60; i++) { // 60 seconds of beeping
        alarmGainNode.gain.setValueAtTime(0.3, time);
        alarmGainNode.gain.setValueAtTime(0, time + 0.3); // Beep for 0.3s
        alarmGainNode.gain.setValueAtTime(0.3, time + 0.5); // Silent for 0.2s
        time += 1; // Repeat every second
    }
    
    alarmOscillator.start(alarmContext.currentTime);
    alarmOscillator.stop(alarmContext.currentTime + 60); // Stop after 60 seconds
}

function stopAlarmSound() {
    if (alarmOscillator) {
        try {
            alarmOscillator.stop();
        } catch (e) {
            // Oscillator already stopped
        }
        alarmOscillator = null;
    }
}

// Trigger alarm with full UI
function triggerAlarm(task) {
    console.log('🚨 Triggering alarm for task:', task.text);
    
    // Initialize countdown
    alarmCountdown = 60;
    
    // Play alarm sound
    playAlarmSound();
    
    // Show alarm modal
    showAlarmModal(task);
    
    // Start countdown
    startAlarmCountdown();
    
    // Remove this alarm from timeouts
    clearAlarmForTask(task.id);
}

// Show alarm modal with task details
function showAlarmModal(task) {
    const overlay = document.getElementById('alarm-overlay');
    const taskInfo = document.getElementById('alarm-task-info');
    const countdown = document.getElementById('alarm-countdown');
    
    if (!overlay || !taskInfo) return;
    
    const timeRange = task.endTime ? 
        `${formatTimeDisplay(task.startTime)} - ${formatTimeDisplay(task.endTime)}` : 
        formatTimeDisplay(task.startTime);
    
    // Populate task information
    taskInfo.innerHTML = `
        <div class="task-priority ${task.priority}">
            <strong>${task.text}</strong>
        </div>
        <div class="task-details">
            📅 ${new Date(task.date).toLocaleDateString()}
            ⏰ ${timeRange}
        </div>
    `;
    
    // Show overlay
    overlay.style.display = 'flex';
    
    // Auto-dismiss after 60 seconds if not manually dismissed
    setTimeout(() => {
        if (overlay.style.display === 'flex') {
            dismissAlarm();
        }
    }, 60000);
}

// Start countdown timer
function startAlarmCountdown() {
    const countdown = document.getElementById('alarm-countdown');
    
    alarmInterval = setInterval(() => {
        alarmCountdown--;
        if (countdown) {
            countdown.textContent = alarmCountdown;
        }
        
        if (alarmCountdown <= 0) {
            dismissAlarm();
        }
    }, 1000);
}

// Dismiss alarm
function dismissAlarm() {
    // Stop sound
    stopAlarmSound();
    
    // Clear countdown
    if (alarmInterval) {
        clearInterval(alarmInterval);
        alarmInterval = null;
    }
    
    // Hide modal
    const overlay = document.getElementById('alarm-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
    
    console.log('✅ Alarm dismissed');
}

// Snooze alarm for 5 minutes
function snoozeAlarm() {
    // Get current task from alarm modal
    const taskInfo = document.getElementById('alarm-task-info');
    if (!taskInfo) return;
    
    // Dismiss current alarm
    dismissAlarm();
    
    // Find the task and reschedule for 5 minutes later
    // This would require storing the current task reference
    console.log('😴 Alarm snoozed for 5 minutes');
}

// Setup alarm UI event handlers
function setupAlarmHandlers() {
    const dismissBtn = document.getElementById('dismiss-alarm');
    const snoozeBtn = document.getElementById('snooze-alarm');
    
    if (dismissBtn) {
        dismissBtn.addEventListener('click', dismissAlarm);
    }
    
    if (snoozeBtn) {
        snoozeBtn.addEventListener('click', snoozeAlarm);
    }
    
    // Also allow ESC key to dismiss alarm
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const overlay = document.getElementById('alarm-overlay');
            if (overlay && overlay.style.display === 'flex') {
                dismissAlarm();
            }
        }
    });
    
    console.log('🚨 Alarm handlers initialized');
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
  const prevMonthOnly = document.getElementById('prev-month');
  const nextMonthOnly = document.getElementById('next-month');
  if (prevMonthOnly) {
    prevMonthOnly.addEventListener('click', () => {
      console.log('📅 Previous month clicked');
      currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
      renderCalendar();
      updatePeriodDisplay();
    });
  }
  if (nextMonthOnly) {
    nextMonthOnly.addEventListener('click', () => {
      console.log('📅 Next month clicked');
      currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
      renderCalendar();
      updatePeriodDisplay();
    });
  }
}

function renderCalendar() {
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  
  // Update month display
    if (currentMonthDisplay) {
        currentMonthDisplay.textContent = new Intl.DateTimeFormat('en-US', { 
            month: 'long', 
            year: 'numeric' 
        }).format(currentCalendarDate);
    }
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Clear calendar
    if (!calendarDays) return;
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
    // Attach data-date for later lookups/highlighting
    dayElement.dataset.date = date.toISOString().split('T')[0];
  
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
    
    // Add priority indicator and background color for highest priority task
    const highestPriority = getHighestPriority(dayTasks);
    const indicator = document.createElement('div');
    indicator.className = `task-indicator ${highestPriority}`;
    dayElement.appendChild(indicator);
    
    // Add priority background color to the day
    dayElement.classList.add(`priority-${highestPriority}`);
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
  // Get filter buttons if they exist
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  if (filterBtns.length === 0) {
    console.log('ℹ️ No filter buttons found, skipping filter setup');
    return;
  }
  
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

// Setup day items function - placeholder for future day selection functionality
function setupDayItems() {
    // This function can be extended in the future to handle day-specific UI elements
    console.log('📅 Day items setup complete');
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
  const currentDayTitle = document.getElementById('current-day-title');
  if (currentDayTitle) currentDayTitle.textContent = `Tasks for ${date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`;
  displayTasks();
}

function filterTasksByWeek() {
  currentFilter = 'week';
  const currentDayTitle = document.getElementById('current-day-title');
  if (currentDayTitle) currentDayTitle.textContent = 'This Week\'s Tasks';
  displayTasks();
}

function filterTasksByMonth() {
  currentFilter = 'month';
  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const currentDayTitle = document.getElementById('current-day-title');
  if (currentDayTitle) currentDayTitle.textContent = `${monthName} Tasks`;
  displayTasks();
}

// Enhanced display tasks function
function displayTasks() {
  if (!list) return;
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
    tasks = JSON.parse(storedTasks).map(task => ({
      ...task,
      date: task.date || new Date().toISOString().split('T')[0],
      priority: task.priority || 'medium',
      fullDate: task.fullDate ? new Date(task.fullDate) : new Date()
    }));
  }
}

function saveTasksToLocalStorage() {
  localStorage.setItem('taskTrackerTasks', JSON.stringify(tasks));
}

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
  const taskDateInput = document.getElementById('task-date');
  if (taskDateInput) taskDateInput.value = dateString;
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
                await fetch(`${API_BASE}/api/tasks/${task.date}/${task.id}`, {
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
    initializeTimeslotCalendar();
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
