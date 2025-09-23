// Task Tracker Frontend Logic

class TaskTracker {
    constructor() {
        this.taskForm = document.getElementById('task-form');
        this.taskInput = document.getElementById('task-input');
        this.daySelect = document.getElementById('day-select');
        this.alarmTimeInput = document.getElementById('alarm-time-input');
        this.alarmModal = document.getElementById('alarm-modal');
        this.turnOffAlarmBtn = document.getElementById('turn-off-alarm-btn');
        this.alarmAudio = new Audio('task-alarm.mp3');
        this.alarmIntervals = new Map(); // Store active alarm intervals
        this.currentAlarm = null; // Track current alarm state
        
        this.init();
    }

    init() {
        this.taskForm.addEventListener('submit', this.handleAddTask.bind(this));
        this.turnOffAlarmBtn.addEventListener('click', this.dismissAlarm.bind(this));
        this.loadTasks();
        this.startAlarmChecker();
    }

    async loadTasks() {
        try {
            const response = await fetch('/api/tasks');
            const tasks = await response.json();
            this.renderTasks(tasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }

    async handleAddTask(e) {
        e.preventDefault();
        
        const text = this.taskInput.value.trim();
        const day = this.daySelect.value;
        const alarmTime = this.alarmTimeInput.value;
        
        if (!text || !day) return;

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, day, alarmTime }),
            });

            if (response.ok) {
                const newTask = await response.json();
                this.addTaskToDOM(newTask);
                this.taskInput.value = '';
                this.daySelect.value = '';
                this.alarmTimeInput.value = '';
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
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
                const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
                if (taskElement) {
                    taskElement.remove();
                }
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    renderTasks(tasks) {
        // Clear all task lists
        const taskLists = document.querySelectorAll('.tasks-list');
        taskLists.forEach(list => list.innerHTML = '');

        // Group tasks by day and render
        tasks.forEach(task => this.addTaskToDOM(task));
    }

    addTaskToDOM(task) {
        const taskList = document.getElementById(`${task.day}-tasks`);
        if (!taskList) return;

        const taskElement = document.createElement('li');
        taskElement.className = `task ${task.completed ? 'completed' : ''}`;
        taskElement.setAttribute('data-task-id', task.id);

        const alarmTimeDisplay = task.alarmTime ? `<span class="alarm-time">🔔 ${task.alarmTime}</span>` : '';

        taskElement.innerHTML = `
            <div class="task-info" onclick="taskTracker.toggleTaskCompletion('${task.id}', ${!task.completed})">
                <span class="task-text">${task.text}</span>
                ${alarmTimeDisplay}
            </div>
            <div class="task-actions">
                <button onclick="taskTracker.deleteTask('${task.id}')" class="delete-btn">Delete</button>
            </div>
        `;

        taskList.appendChild(taskElement);
    }

    startAlarmChecker() {
        // Check for alarms every minute
        setInterval(() => {
            this.checkAlarms();
        }, 60000);
        
        // Also check immediately
        this.checkAlarms();
    }

    async checkAlarms() {
        try {
            const response = await fetch('/api/tasks');
            const tasks = await response.json();
            const now = new Date();
            const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
            const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });

            tasks.forEach(task => {
                if (task.alarmTime && task.day === currentDay && !task.completed) {
                    if (task.alarmTime === currentTime && !this.currentAlarm) {
                        this.triggerAlarm(task);
                    }
                }
            });
        } catch (error) {
            console.error('Error checking alarms:', error);
        }
    }

    triggerAlarm(task) {
        this.currentAlarm = {
            task: task,
            startTime: Date.now(),
            countdown: 8,
            countdownInterval: null,
            audioInterval: null
        };

        // Show modal
        this.alarmModal.classList.remove('hidden');
        document.getElementById('alarm-task-name').textContent = `Alarm for: ${task.text}`;
        
        // Start countdown
        this.updateCountdown();
        this.currentAlarm.countdownInterval = setInterval(() => {
            this.updateCountdown();
        }, 1000);

        // Play alarm sound repeatedly
        this.playAlarmSound();
        this.currentAlarm.audioInterval = setInterval(() => {
            this.playAlarmSound();
        }, 2000);

        // Auto-dismiss after 8 seconds
        setTimeout(() => {
            if (this.currentAlarm) {
                this.dismissAlarm();
            }
        }, 8000);
    }

    updateCountdown() {
        if (!this.currentAlarm) return;

        const elapsed = Math.floor((Date.now() - this.currentAlarm.startTime) / 1000);
        const remaining = Math.max(0, this.currentAlarm.countdown - elapsed);
        
        document.getElementById('alarm-countdown-text').textContent = 
            `Alarm will auto-stop in ${remaining} seconds...`;

        if (remaining <= 0) {
            this.dismissAlarm();
        }
    }

    playAlarmSound() {
        try {
            this.alarmAudio.currentTime = 0;
            this.alarmAudio.play().catch(e => {
                console.warn('Could not play alarm sound:', e);
            });
        } catch (error) {
            console.warn('Error playing alarm sound:', error);
        }
    }

    dismissAlarm() {
        if (!this.currentAlarm) return;

        // Clear intervals
        if (this.currentAlarm.countdownInterval) {
            clearInterval(this.currentAlarm.countdownInterval);
        }
        if (this.currentAlarm.audioInterval) {
            clearInterval(this.currentAlarm.audioInterval);
        }

        // Stop audio
        this.alarmAudio.pause();
        this.alarmAudio.currentTime = 0;

        // Hide modal
        this.alarmModal.classList.add('hidden');

        // Clear current alarm
        this.currentAlarm = null;
    }
}

// Initialize the task tracker when the page loads
const taskTracker = new TaskTracker();