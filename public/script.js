// Task Tracker Frontend Logic - Revamped UI

class TaskTracker {
    constructor() {
        this.taskForm = document.getElementById('task-form');
        this.taskInput = document.getElementById('task-input');
        this.hourSelect = document.getElementById('hour-select');
        this.timeFormatToggle = document.getElementById('time-format-toggle');
        this.currentDayElement = document.getElementById('current-day');
        this.timeSlotsContainer = document.getElementById('time-slots');
        
        this.currentDay = 'Monday';
        this.is24HourFormat = true;
        this.tasks = {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateTimeSlots();
        this.populateHourSelect();
        this.loadTasks();
    }

    setupEventListeners() {
        // Task form submission
        this.taskForm.addEventListener('submit', this.handleAddTask.bind(this));
        
        // Day navigation buttons
        document.querySelectorAll('.day-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectDay(e.target.dataset.day);
            });
        });
        
        // Time format toggle
        this.timeFormatToggle.addEventListener('click', this.toggleTimeFormat.bind(this));
    }

    selectDay(day) {
        // Update active day button
        document.querySelectorAll('.day-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-day="${day}"]`).classList.add('active');
        
        // Update current day
        this.currentDay = day;
        this.currentDayElement.textContent = `${day} Schedule`;
        
        // Refresh the schedule
        this.renderSchedule();
    }

    toggleTimeFormat() {
        this.is24HourFormat = !this.is24HourFormat;
        this.timeFormatToggle.textContent = this.is24HourFormat ? '24H' : '12H';
        this.generateTimeSlots();
        this.populateHourSelect();
        this.renderSchedule();
    }

    generateTimeSlots() {
        this.timeSlotsContainer.innerHTML = '';
        
        for (let hour = 0; hour < 24; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.dataset.hour = hour;
            
            const timeLabel = document.createElement('div');
            timeLabel.className = 'time-label';
            timeLabel.textContent = this.formatHour(hour);
            
            const slotContent = document.createElement('div');
            slotContent.className = 'slot-content';
            
            const slotTasks = document.createElement('ul');
            slotTasks.className = 'slot-tasks';
            slotTasks.id = `tasks-${this.currentDay}-${hour}`;
            
            slotContent.appendChild(slotTasks);
            timeSlot.appendChild(timeLabel);
            timeSlot.appendChild(slotContent);
            
            this.timeSlotsContainer.appendChild(timeSlot);
        }
    }

    populateHourSelect() {
        this.hourSelect.innerHTML = '<option value="">Select Hour</option>';
        
        for (let hour = 0; hour < 24; hour++) {
            const option = document.createElement('option');
            option.value = hour;
            option.textContent = this.formatHour(hour);
            this.hourSelect.appendChild(option);
        }
    }

    formatHour(hour) {
        if (this.is24HourFormat) {
            return `${hour.toString().padStart(2, '0')}:00`;
        } else {
            if (hour === 0) return '12:00 AM';
            if (hour === 12) return '12:00 PM';
            if (hour < 12) return `${hour}:00 AM`;
            return `${hour - 12}:00 PM`;
        }
    }

    async loadTasks() {
        try {
            const response = await fetch('/api/tasks');
            const tasks = await response.json();
            
            // Organize tasks by day and hour
            this.tasks = {};
            tasks.forEach(task => {
                const key = `${task.day}-${task.hour || 0}`;
                if (!this.tasks[key]) {
                    this.tasks[key] = [];
                }
                this.tasks[key].push(task);
            });
            
            this.renderSchedule();
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    async handleAddTask(e) {
        e.preventDefault();
        
        const text = this.taskInput.value.trim();
        const hour = parseInt(this.hourSelect.value);
        
        if (!text || isNaN(hour)) return;

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    text, 
                    day: this.currentDay,
                    hour: hour
                }),
            });

            if (response.ok) {
                const newTask = await response.json();
                
                // Add to local tasks object
                const key = `${newTask.day}-${newTask.hour}`;
                if (!this.tasks[key]) {
                    this.tasks[key] = [];
                }
                this.tasks[key].push(newTask);
                
                // Clear form
                this.taskInput.value = '';
                this.hourSelect.value = '';
                
                // Re-render schedule
                this.renderSchedule();
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    renderSchedule() {
        // Generate time slots for current day
        this.generateTimeSlots();
        
        // Populate tasks for current day
        for (let hour = 0; hour < 24; hour++) {
            const slotTasks = document.getElementById(`tasks-${this.currentDay}-${hour}`);
            if (slotTasks) {
                slotTasks.innerHTML = '';
                
                const key = `${this.currentDay}-${hour}`;
                const hourTasks = this.tasks[key] || [];
                
                if (hourTasks.length === 0) {
                    const emptySlot = document.createElement('div');
                    emptySlot.className = 'empty-slot';
                    emptySlot.textContent = 'No tasks scheduled';
                    slotTasks.appendChild(emptySlot);
                } else {
                    hourTasks.forEach(task => {
                        this.addTaskToSlot(task, slotTasks);
                    });
                }
            }
        }
    }

    addTaskToSlot(task, container) {
        const taskElement = document.createElement('li');
        taskElement.className = `slot-task ${task.completed ? 'completed' : ''}`;
        taskElement.setAttribute('data-task-id', task.id);

        taskElement.innerHTML = `
            <div class="task-info" onclick="taskTracker.toggleTaskCompletion('${task.id}', ${!task.completed})">
                <span class="task-text">${task.text}</span>
            </div>
            <div class="task-actions">
                <button onclick="taskTracker.deleteTask('${task.id}')" class="delete-btn">Delete</button>
            </div>
        `;

        // Remove empty slot message if it exists
        const emptySlot = container.querySelector('.empty-slot');
        if (emptySlot) {
            emptySlot.remove();
        }

        container.appendChild(taskElement);
    }

    async toggleTaskCompletion(taskId, completed) {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed }),
            });

            if (response.ok) {
                const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
                if (taskElement) {
                    taskElement.classList.toggle('completed', completed);
                }
                
                // Update local tasks object
                Object.keys(this.tasks).forEach(key => {
                    const taskIndex = this.tasks[key].findIndex(t => t.id === taskId);
                    if (taskIndex !== -1) {
                        this.tasks[key][taskIndex].completed = completed;
                    }
                });
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }

    async deleteTask(taskId) {
        try {
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Remove from local tasks object
                Object.keys(this.tasks).forEach(key => {
                    this.tasks[key] = this.tasks[key].filter(t => t.id !== taskId);
                });
                
                // Re-render schedule
                this.renderSchedule();
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }
}

// Initialize the task tracker when the page loads
const taskTracker = new TaskTracker();