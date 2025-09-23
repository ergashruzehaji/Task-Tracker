// Task Tracker Frontend Logic

class TaskTracker {
    constructor() {
        this.taskForm = document.getElementById('task-form');
        this.taskInput = document.getElementById('task-input');
        this.daySelect = document.getElementById('day-select');
        this.timeInput = document.getElementById('time-input');
        this.alarmAudio = document.getElementById('task-alarm');
        
        this.init();
    }

    init() {
        this.taskForm.addEventListener('submit', this.handleAddTask.bind(this));
        this.loadTasks();
        
        // Start checking for alarms every minute
        this.startAlarmChecker();
    }

    startAlarmChecker() {
        // Check every 30 seconds for more responsive alarm triggering
        setInterval(() => {
            this.checkAlarms();
        }, 30000);
        
        // Also check immediately
        this.checkAlarms();
    }

    async checkAlarms() {
        try {
            const response = await fetch('/api/tasks');
            const tasks = await response.json();
            const now = new Date();
            const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
            const currentTime = now.toTimeString().slice(0, 5); // Format: HH:MM
            
            // Find tasks for today that match current time and aren't completed
            const alarmTasks = tasks.filter(task => 
                task.day === currentDay && 
                task.time === currentTime && 
                !task.completed
            );
            
            if (alarmTasks.length > 0) {
                this.playAlarm();
                console.log('Alarm triggered for tasks:', alarmTasks);
            }
        } catch (error) {
            console.error('Error checking alarms:', error);
        }
    }

    playAlarm() {
        if (this.alarmAudio) {
            this.alarmAudio.currentTime = 0; // Reset to beginning
            this.alarmAudio.play().catch(error => {
                console.error('Error playing alarm:', error);
            });
        }
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
        const time = this.timeInput.value;
        
        if (!text || !day || !time) return;

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, day, time }),
            });

            if (response.ok) {
                const newTask = await response.json();
                this.addTaskToDOM(newTask);
                this.taskInput.value = '';
                this.daySelect.value = '';
                this.timeInput.value = '';
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

        taskElement.innerHTML = `
            <div class="task-info" onclick="taskTracker.toggleTaskCompletion('${task.id}', ${!task.completed})">
                <span class="task-text">${task.text}</span>
                <span class="task-time">${task.time}</span>
            </div>
            <div class="task-actions">
                <button onclick="taskTracker.deleteTask('${task.id}')" class="delete-btn">Delete</button>
            </div>
        `;

        taskList.appendChild(taskElement);
    }
}

// Initialize the task tracker when the page loads
const taskTracker = new TaskTracker();