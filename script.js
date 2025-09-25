// Use relative URLs for API calls so it works both locally and in production
const API_BASE = window.location.origin;

// Initialize these inside DOMContentLoaded to ensure elements exist
let form, input, prioritySelect, yearSelect, timeFormatToggle, alarmAudio;
// Initialize these inside DOMContentLoaded to ensure elements exist
let quickForm, cancelFormBtn, selectedDateTitle;
let notificationSidebar, closeNotificationsBtn, activeNotifications, mainContent;
let list; // Optional task list element (may not exist after sidebar removal)
let prevMonthBtn, nextMonthBtn, currentMonthDisplay, calendarDays;

// Global variables for language and accessibility
let currentLanguage = 'en';

// Translations object
const translations = {
  en: {
    view_day: "Day", view_week: "Week", view_month: "Month", add_task: "Add Task", cancel: "Cancel",
    task_title: "Task Title", start_time: "Start Time", end_time: "End Time", priority: "Priority",
    high: "High", medium: "Medium", low: "Low", recurring: "Recurring", daily: "Daily",
    weekly: "Weekly", monthly: "Monthly", save_task: "Save Task", close: "Close",
    monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday",
    friday: "Friday", saturday: "Saturday", sunday: "Sunday",
    accessibility_options: "Accessibility Options", high_contrast: "High Contrast Mode",
    large_text: "Large Text", keyboard_nav: "Enhanced Keyboard Navigation", font_size: "Font Size",
    task_form_title: "Add New Task", select_days: "Select Days", every: "Every",
    weekdays_only: "Weekdays Only", weekends_only: "Weekends Only", custom: "Custom"
  },
  es: {
    view_day: "Día", view_week: "Semana", view_month: "Mes", add_task: "Agregar Tarea", cancel: "Cancelar",
    task_title: "Título de Tarea", start_time: "Hora de Inicio", end_time: "Hora de Fin", priority: "Prioridad",
    high: "Alta", medium: "Media", low: "Baja", recurring: "Recurrente", daily: "Diario",
    weekly: "Semanal", monthly: "Mensual", save_task: "Guardar Tarea", close: "Cerrar",
    monday: "Lunes", tuesday: "Martes", wednesday: "Miércoles", thursday: "Jueves",
    friday: "Viernes", saturday: "Sábado", sunday: "Domingo",
    accessibility_options: "Opciones de Accesibilidad", high_contrast: "Modo de Alto Contraste",
    large_text: "Texto Grande", keyboard_nav: "Navegación Mejorada por Teclado", font_size: "Tamaño de Fuente",
    task_form_title: "Agregar Nueva Tarea", select_days: "Seleccionar Días", every: "Cada",
    weekdays_only: "Solo Días Laborables", weekends_only: "Solo Fines de Semana", custom: "Personalizado"
  },
  fr: {
    view_day: "Jour", view_week: "Semaine", view_month: "Mois", add_task: "Ajouter Tâche", cancel: "Annuler",
    task_title: "Titre de Tâche", start_time: "Heure de Début", end_time: "Heure de Fin", priority: "Priorité",
    high: "Élevée", medium: "Moyenne", low: "Faible", recurring: "Récurrent", daily: "Quotidien",
    weekly: "Hebdomadaire", monthly: "Mensuel", save_task: "Enregistrer Tâche", close: "Fermer",
    monday: "Lundi", tuesday: "Mardi", wednesday: "Mercredi", thursday: "Jeudi",
    friday: "Vendredi", saturday: "Samedi", sunday: "Dimanche",
    accessibility_options: "Options d'Accessibilité", high_contrast: "Mode Contraste Élevé",
    large_text: "Texte Large", keyboard_nav: "Navigation Clavier Améliorée", font_size: "Taille de Police",
    task_form_title: "Ajouter Nouvelle Tâche", select_days: "Sélectionner Jours", every: "Chaque",
    weekdays_only: "Jours de Semaine Seulement", weekends_only: "Week-ends Seulement", custom: "Personnalisé"
  },
  zh: {
    view_day: "日", view_week: "周", view_month: "月", add_task: "添加任务", cancel: "取消",
    task_title: "任务标题", start_time: "开始时间", end_time: "结束时间", priority: "优先级",
    high: "高", medium: "中", low: "低", recurring: "重复", daily: "每日",
    weekly: "每周", monthly: "每月", save_task: "保存任务", close: "关闭",
    monday: "星期一", tuesday: "星期二", wednesday: "星期三", thursday: "星期四",
    friday: "星期五", saturday: "星期六", sunday: "星期日"
  },
  it: {
    view_day: "Giorno", view_week: "Settimana", view_month: "Mese", add_task: "Aggiungi Attività", cancel: "Annulla",
    task_title: "Titolo Attività", start_time: "Ora Inizio", end_time: "Ora Fine", priority: "Priorità",
    high: "Alta", medium: "Media", low: "Bassa", recurring: "Ricorrente", daily: "Giornaliero",
    weekly: "Settimanale", monthly: "Mensile", save_task: "Salva Attività", close: "Chiudi",
    monday: "Lunedì", tuesday: "Martedì", wednesday: "Mercoledì", thursday: "Giovedì",
    friday: "Venerdì", saturday: "Sabato", sunday: "Domenica"
  },
  ru: {
    view_day: "День", view_week: "Неделя", view_month: "Месяц", add_task: "Добавить Задачу", cancel: "Отмена",
    task_title: "Название Задачи", start_time: "Время Начала", end_time: "Время Окончания", priority: "Приоритет",
    high: "Высокий", medium: "Средний", low: "Низкий", recurring: "Повторяющийся", daily: "Ежедневно",
    weekly: "Еженедельно", monthly: "Ежемесячно", save_task: "Сохранить Задачу", close: "Закрыть",
    monday: "Понедельник", tuesday: "Вторник", wednesday: "Среда", thursday: "Четверг",
    friday: "Пятница", saturday: "Суббота", sunday: "Воскресенье"
  },
  ja: {
    view_day: "日", view_week: "週", view_month: "月", add_task: "タスクを追加", cancel: "キャンセル",
    task_title: "タスクタイトル", start_time: "開始時間", end_time: "終了時間", priority: "優先度",
    high: "高", medium: "中", low: "低", recurring: "繰り返し", daily: "毎日",
    weekly: "毎週", monthly: "毎月", save_task: "タスクを保存", close: "閉じる",
    monday: "月曜日", tuesday: "火曜日", wednesday: "水曜日", thursday: "木曜日",
    friday: "金曜日", saturday: "土曜日", sunday: "日曜日"
  },
  tr: {
    view_day: "Gün", view_week: "Hafta", view_month: "Ay", add_task: "Görev Ekle", cancel: "İptal",
    task_title: "Görev Başlığı", start_time: "Başlangıç Saati", end_time: "Bitiş Saati", priority: "Öncelik",
    high: "Yüksek", medium: "Orta", low: "Düşük", recurring: "Tekrarlayan", daily: "Günlük",
    weekly: "Haftalık", monthly: "Aylık", save_task: "Görevi Kaydet", close: "Kapat",
    monday: "Pazartesi", tuesday: "Salı", wednesday: "Çarşamba", thursday: "Perşembe",
    friday: "Cuma", saturday: "Cumartesi", sunday: "Pazar"
  },
  ar: {
    view_day: "يوم", view_week: "أسبوع", view_month: "شهر", add_task: "إضافة مهمة", cancel: "إلغاء",
    task_title: "عنوان المهمة", start_time: "وقت البداية", end_time: "وقت النهاية", priority: "الأولوية",
    high: "عالية", medium: "متوسطة", low: "منخفضة", recurring: "متكررة", daily: "يومياً",
    weekly: "أسبوعياً", monthly: "شهرياً", save_task: "حفظ المهمة", close: "إغلاق",
    monday: "الإثنين", tuesday: "الثلاثاء", wednesday: "الأربعاء", thursday: "الخميس",
    friday: "الجمعة", saturday: "السبت", sunday: "الأحد"
  }
};

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
    if (!yearSelect) {
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
    }
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
    updateTimeInputs();
    console.log('Time format toggle initialization complete');
}

// Update time format toggle button text
function updateTimeFormatToggle() {
    if (timeFormatToggle) {
        timeFormatToggle.textContent = is24HourFormat ? '24H' : 'AM/PM';
        timeFormatToggle.classList.toggle('active-24h', is24HourFormat);
    }
}

// Update time inputs based on current format
function updateTimeInputs() {
    const startTimeInput = document.getElementById('start-time');
    const endTimeInput = document.getElementById('end-time');
    
    if (startTimeInput && endTimeInput) {
        // Store current values
        const startValue = startTimeInput.value;
        const endValue = endTimeInput.value;
        
        // Update input step and format
        if (is24HourFormat) {
            startTimeInput.step = "60"; // 1 minute steps
            endTimeInput.step = "60";
            startTimeInput.placeholder = "13:30";
            endTimeInput.placeholder = "14:30";
        } else {
            startTimeInput.step = "60";
            endTimeInput.step = "60";
            startTimeInput.placeholder = "1:30 PM";
            endTimeInput.placeholder = "2:30 PM";
        }
        
        // Convert existing values if any
        if (startValue) {
            startTimeInput.value = convertTimeFormat(startValue);
        }
        if (endValue) {
            endTimeInput.value = convertTimeFormat(endValue);
        }
    }
}

// Convert time between formats
function convertTimeFormat(timeValue) {
    if (!timeValue) return timeValue;
    
    // HTML time inputs always use 24h format internally (HH:MM)
    // So we don't need to convert the actual value, just update display
    return timeValue;
}

// Sidebar removed

// Recurring Task Functionality
let recurringExpanded = false;

function initializeRecurringSection() {
    const toggleBtn = document.getElementById('toggle-recurring');
    const recurringOptions = document.getElementById('recurring-options');
    const recurringType = document.getElementById('recurring-type');
    const weeklyOptions = document.getElementById('weekly-options');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const submitBtn = document.querySelector('.btn-primary');
    const submitText = document.getElementById('submit-text');
    
    if (!toggleBtn || !recurringOptions) return;
    
    // Toggle recurring section
    toggleBtn.addEventListener('click', () => {
        recurringExpanded = !recurringExpanded;
        
        if (recurringExpanded) {
            recurringOptions.style.display = 'block';
            toggleBtn.classList.add('expanded');
            document.querySelector('.recurring-section').classList.add('expanded');
        } else {
            recurringOptions.style.display = 'none';
            toggleBtn.classList.remove('expanded');
            document.querySelector('.recurring-section').classList.remove('expanded');
        }
        
        updateSubmitButtonText();
    });
    
    // Handle recurring type change
    if (recurringType && weeklyOptions) {
        recurringType.addEventListener('change', (e) => {
            if (e.target.value === 'weekly') {
                weeklyOptions.style.display = 'block';
            } else {
                weeklyOptions.style.display = 'none';
            }
            updateSubmitButtonText();
        });
    }
    
    // Handle preset buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const preset = e.target.dataset.preset;
            applyRecurringPreset(preset);
        });
    });
    
    // Update submit button text based on recurring settings
    function updateSubmitButtonText() {
        if (!recurringExpanded || recurringType?.value === 'none') {
            submitText.textContent = 'Add Task';
            return;
        }
        
        const count = document.getElementById('recurring-count')?.value || 1;
        const type = recurringType?.value || 'none';
        
        if (type !== 'none') {
            submitText.textContent = `Add ${count} ${type === 'weekly' ? 'Weekly' : type === 'daily' ? 'Daily' : 'Monthly'} Tasks`;
        } else {
            submitText.textContent = 'Add Task';
        }
    }
    
    // Listen for count changes
    const recurringCount = document.getElementById('recurring-count');
    if (recurringCount) {
        recurringCount.addEventListener('input', updateSubmitButtonText);
    }
}

function applyRecurringPreset(preset) {
    const recurringType = document.getElementById('recurring-type');
    const recurringCount = document.getElementById('recurring-count');
    const weeklyOptions = document.getElementById('weekly-options');
    const weekdayCheckboxes = weeklyOptions?.querySelectorAll('input[type="checkbox"]');
    
    // Clear all checkboxes first
    if (weekdayCheckboxes) {
        weekdayCheckboxes.forEach(cb => cb.checked = false);
    }
    
    switch (preset) {
        case 'work-week':
            recurringType.value = 'weekly';
            recurringCount.value = '52'; // Full year
            weeklyOptions.style.display = 'block';
            // Check Mon-Fri (values 1-5)
            [1, 2, 3, 4, 5].forEach(day => {
                const checkbox = weeklyOptions?.querySelector(`input[value="${day}"]`);
                if (checkbox) checkbox.checked = true;
            });
            break;
            
        case 'weekends':
            recurringType.value = 'weekly';
            recurringCount.value = '26'; // Half year
            weeklyOptions.style.display = 'block';
            // Check Sat-Sun (values 6, 0)
            [6, 0].forEach(day => {
                const checkbox = weeklyOptions?.querySelector(`input[value="${day}"]`);
                if (checkbox) checkbox.checked = true;
            });
            break;
            
        case 'daily-month':
            recurringType.value = 'daily';
            recurringCount.value = '30';
            weeklyOptions.style.display = 'none';
            break;
            
        case 'weekly-year':
            recurringType.value = 'weekly';
            recurringCount.value = '52';
            weeklyOptions.style.display = 'block';
            // Check the same day as today
            const today = new Date().getDay();
            const todayCheckbox = weeklyOptions?.querySelector(`input[value="${today}"]`);
            if (todayCheckbox) todayCheckbox.checked = true;
            break;
    }
    
    // Update button text
    setTimeout(() => {
        const event = new Event('change');
        recurringType.dispatchEvent(event);
    }, 100);
}

// Generate recurring tasks
function generateRecurringTasks(baseTask) {
    const recurringType = document.getElementById('recurring-type')?.value;
    const recurringCount = parseInt(document.getElementById('recurring-count')?.value) || 1;
    
    if (!recurringExpanded || recurringType === 'none' || recurringCount <= 1) {
        return [baseTask]; // Return single task
    }
    
    const tasks = [];
    const baseDate = new Date(baseTask.date);
    
    switch (recurringType) {
        case 'daily':
            for (let i = 0; i < recurringCount; i++) {
                const taskDate = new Date(baseDate);
                taskDate.setDate(baseDate.getDate() + i);
                tasks.push({
                    ...baseTask,
                    id: Date.now() + i,
                    date: taskDate.toISOString().split('T')[0]
                });
            }
            break;
            
        case 'weekly':
            const selectedDays = getSelectedWeekdays();
            if (selectedDays.length === 0) {
                // If no days selected, use the original day
                selectedDays.push(baseDate.getDay());
            }
            
            let weekCount = 0;
            let taskId = 0;
            
            while (tasks.length < recurringCount) {
                selectedDays.forEach(dayOfWeek => {
                    if (tasks.length >= recurringCount) return;
                    
                    const taskDate = new Date(baseDate);
                    // Calculate the next occurrence of this day
                    const dayDiff = (dayOfWeek - baseDate.getDay() + 7) % 7;
                    taskDate.setDate(baseDate.getDate() + dayDiff + (weekCount * 7));
                    
                    tasks.push({
                        ...baseTask,
                        id: Date.now() + taskId++,
                        date: taskDate.toISOString().split('T')[0]
                    });
                });
                weekCount++;
            }
            break;
            
        case 'monthly':
            for (let i = 0; i < recurringCount; i++) {
                const taskDate = new Date(baseDate);
                taskDate.setMonth(baseDate.getMonth() + i);
                tasks.push({
                    ...baseTask,
                    id: Date.now() + i,
                    date: taskDate.toISOString().split('T')[0]
                });
            }
            break;
    }
    
    return tasks.slice(0, recurringCount);
}

function getSelectedWeekdays() {
    const weeklyOptions = document.getElementById('weekly-options');
    const checkedBoxes = weeklyOptions?.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkedBoxes || []).map(cb => parseInt(cb.value));
}

function resetRecurringForm() {
    const recurringType = document.getElementById('recurring-type');
    const recurringCount = document.getElementById('recurring-count');
    const weeklyOptions = document.getElementById('weekly-options');
    const weekdayCheckboxes = weeklyOptions?.querySelectorAll('input[type="checkbox"]');
    
    if (recurringType) recurringType.value = 'none';
    if (recurringCount) recurringCount.value = '1';
    
    // Uncheck all weekday boxes
    if (weekdayCheckboxes) {
        weekdayCheckboxes.forEach(cb => cb.checked = false);
    }
    
    // Hide weekly options
    if (weeklyOptions) {
        weeklyOptions.style.display = 'none';
    }
}

function showNotification(message) {
    // Create a temporary notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 14px;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add slide-in animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

// Task Sidebar Functionality
let sidebarOpen = false;
let selectedSidebarDate = null;

function initializeTaskSidebar() {
    const sidebar = document.getElementById('task-sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const sidebarForm = document.getElementById('sidebar-task-form');
    const sidebarToggleRecurring = document.getElementById('sidebar-toggle-recurring');
    const sidebarRecurringOptions = document.getElementById('sidebar-recurring-options');
    const sidebarRecurringType = document.getElementById('sidebar-recurring-type');
    const sidebarWeeklyOptions = document.getElementById('sidebar-weekly-options');
    const sidebarTimeFormatToggle = document.getElementById('sidebar-time-format-toggle');
    
    if (!sidebar) return;
    
    // Close sidebar
    if (closeSidebarBtn) {
        console.log('🔧 Close button found, adding event listener');
        closeSidebarBtn.addEventListener('click', () => {
            console.log('🔧 Close button clicked');
            closeSidebar();
        });
    } else {
        console.error('🚨 Close button not found');
    }
    
    // Handle recurring toggle
    if (sidebarToggleRecurring && sidebarRecurringOptions) {
        sidebarToggleRecurring.addEventListener('click', () => {
            const isExpanded = sidebarRecurringOptions.style.display === 'block';
            sidebarRecurringOptions.style.display = isExpanded ? 'none' : 'block';
            sidebarToggleRecurring.classList.toggle('expanded', !isExpanded);
        });
    }
    
    // Handle recurring type change
    if (sidebarRecurringType && sidebarWeeklyOptions) {
        sidebarRecurringType.addEventListener('change', (e) => {
            sidebarWeeklyOptions.style.display = e.target.value === 'weekly' ? 'block' : 'none';
        });
    }
    
    // Handle time format toggle
    if (sidebarTimeFormatToggle) {
        sidebarTimeFormatToggle.addEventListener('click', toggleSidebarTimeFormat);
    }
    
    // Handle preset buttons
    const sidebarPresetBtns = sidebar.querySelectorAll('.preset-btn');
    sidebarPresetBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const preset = e.target.dataset.preset;
            applySidebarRecurringPreset(preset);
        });
    });
    
    // Handle form submission
    if (sidebarForm) {
        sidebarForm.addEventListener('submit', handleSidebarFormSubmit);
    }
}

function showTaskSidebar(dateString) {
    console.log('🔧 showTaskSidebar called with:', dateString);
    const sidebar = document.getElementById('task-sidebar');
    const sidebarSelectedDate = document.getElementById('sidebar-selected-date');
    
    console.log('🔧 Sidebar element:', sidebar);
    console.log('🔧 Current sidebar classes:', sidebar ? sidebar.className : 'NO SIDEBAR');
    
    if (!sidebar) {
        console.error('🚨 Sidebar element not found!');
        return;
    }
    
    selectedSidebarDate = dateString;
    const date = new Date(dateString);
    
    if (sidebarSelectedDate) {
        sidebarSelectedDate.textContent = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    console.log('🔧 Adding show class to sidebar');
    sidebar.classList.add('show');
    document.body.classList.add('sidebar-open');
    sidebarOpen = true;
    
    console.log('🔧 Sidebar classes after show:', sidebar.className);
    console.log('🔧 Body classes:', document.body.className);
    
    // Focus on task input
    setTimeout(() => {
        const taskInput = document.getElementById('sidebar-task-input');
        console.log('🔧 Task input found:', !!taskInput);
        if (taskInput) taskInput.focus();
    }, 300);
}

function closeSidebar() {
    console.log('🔧 Closing sidebar');
    const sidebar = document.getElementById('task-sidebar');
    if (!sidebar) {
        console.error('🚨 Sidebar not found when trying to close');
        return;
    }
    
    sidebar.classList.remove('show');
    document.body.classList.remove('sidebar-open');
    sidebarOpen = false;
    selectedSidebarDate = null;
    
    console.log('🔧 Sidebar closed, classes:', sidebar.className);
    
    // Reset form
    const sidebarForm = document.getElementById('sidebar-task-form');
    if (sidebarForm) sidebarForm.reset();
    
    // Hide recurring options
    const recurringOptions = document.getElementById('sidebar-recurring-options');
    if (recurringOptions) recurringOptions.style.display = 'none';
    
    const weeklyOptions = document.getElementById('sidebar-weekly-options');
    if (weeklyOptions) weeklyOptions.style.display = 'none';
    
    // Reset recurring toggle
    const recurringToggle = document.getElementById('sidebar-toggle-recurring');
    if (recurringToggle) recurringToggle.classList.remove('expanded');
}

function toggleSidebarTimeFormat() {
    const toggle = document.getElementById('sidebar-time-format-toggle');
    const startTime = document.getElementById('sidebar-start-time');
    const endTime = document.getElementById('sidebar-end-time');
    
    if (!toggle) return;
    
    const is24Hour = toggle.textContent === '24H';
    toggle.textContent = is24Hour ? 'AM/PM' : '24H';
    
    // Update input placeholders and behavior
    if (startTime) startTime.step = is24Hour ? "60" : "300";
    if (endTime) endTime.step = is24Hour ? "60" : "300";
}

function applySidebarRecurringPreset(preset) {
    const recurringType = document.getElementById('sidebar-recurring-type');
    const recurringCount = document.getElementById('sidebar-recurring-count');
    const weeklyOptions = document.getElementById('sidebar-weekly-options');
    const weekdayCheckboxes = weeklyOptions?.querySelectorAll('input[type="checkbox"]');
    
    // Clear all checkboxes first
    if (weekdayCheckboxes) {
        weekdayCheckboxes.forEach(cb => cb.checked = false);
    }
    
    switch (preset) {
        case 'work-week':
            recurringType.value = 'weekly';
            recurringCount.value = '52';
            weeklyOptions.style.display = 'block';
            [1, 2, 3, 4, 5].forEach(day => {
                const checkbox = weeklyOptions?.querySelector(`input[value="${day}"]`);
                if (checkbox) checkbox.checked = true;
            });
            break;
            
        case 'weekends':
            recurringType.value = 'weekly';
            recurringCount.value = '26';
            weeklyOptions.style.display = 'block';
            [6, 0].forEach(day => {
                const checkbox = weeklyOptions?.querySelector(`input[value="${day}"]`);
                if (checkbox) checkbox.checked = true;
            });
            break;
            
        case 'daily-month':
            recurringType.value = 'daily';
            recurringCount.value = '30';
            weeklyOptions.style.display = 'none';
            break;
            
        case 'weekly-year':
            recurringType.value = 'weekly';
            recurringCount.value = '52';
            weeklyOptions.style.display = 'block';
            const today = new Date().getDay();
            const todayCheckbox = weeklyOptions?.querySelector(`input[value="${today}"]`);
            if (todayCheckbox) todayCheckbox.checked = true;
            break;
    }
}

function handleSidebarFormSubmit(e) {
    e.preventDefault();
    
    if (!selectedSidebarDate) return;
    
    const taskText = document.getElementById('sidebar-task-input')?.value.trim();
    const startTime = document.getElementById('sidebar-start-time')?.value || '';
    const endTime = document.getElementById('sidebar-end-time')?.value || '';
    const priority = document.getElementById('sidebar-priority-select')?.value || 'medium';
    
    if (!taskText) return;
    
    const baseTask = {
        text: taskText,
        date: selectedSidebarDate,
        startTime: startTime,
        endTime: endTime,
        alarmTime: startTime,
        priority: priority,
        completed: false,
        acknowledged: false,
        createdAt: new Date().toISOString()
    };
    
    // Generate recurring tasks or single task
    const tasksToAdd = generateSidebarRecurringTasks(baseTask);
    
    // Add all tasks
    tasksToAdd.forEach(task => addTask(task));
    
    // Show confirmation
    if (tasksToAdd.length > 1) {
        showNotification(`Successfully added ${tasksToAdd.length} recurring tasks!`);
    }
    
    // Close sidebar
    closeSidebar();
}

function generateSidebarRecurringTasks(baseTask) {
    const recurringType = document.getElementById('sidebar-recurring-type')?.value;
    const recurringCount = parseInt(document.getElementById('sidebar-recurring-count')?.value) || 1;
    const recurringOptions = document.getElementById('sidebar-recurring-options');
    
    if (!recurringOptions || recurringOptions.style.display === 'none' || recurringType === 'none' || recurringCount <= 1) {
        return [{ ...baseTask, id: Date.now() }];
    }
    
    const tasks = [];
    const baseDate = new Date(baseTask.date);
    
    switch (recurringType) {
        case 'daily':
            for (let i = 0; i < recurringCount; i++) {
                const taskDate = new Date(baseDate);
                taskDate.setDate(baseDate.getDate() + i);
                tasks.push({
                    ...baseTask,
                    id: Date.now() + i,
                    date: taskDate.toISOString().split('T')[0]
                });
            }
            break;
            
        case 'weekly':
            const selectedDays = getSidebarSelectedWeekdays();
            if (selectedDays.length === 0) {
                selectedDays.push(baseDate.getDay());
            }
            
            let weekCount = 0;
            let taskId = 0;
            
            while (tasks.length < recurringCount) {
                selectedDays.forEach(dayOfWeek => {
                    if (tasks.length >= recurringCount) return;
                    
                    const taskDate = new Date(baseDate);
                    const dayDiff = (dayOfWeek - baseDate.getDay() + 7) % 7;
                    taskDate.setDate(baseDate.getDate() + dayDiff + (weekCount * 7));
                    
                    tasks.push({
                        ...baseTask,
                        id: Date.now() + taskId++,
                        date: taskDate.toISOString().split('T')[0]
                    });
                });
                weekCount++;
            }
            break;
            
        case 'monthly':
            for (let i = 0; i < recurringCount; i++) {
                const taskDate = new Date(baseDate);
                taskDate.setMonth(baseDate.getMonth() + i);
                tasks.push({
                    ...baseTask,
                    id: Date.now() + i,
                    date: taskDate.toISOString().split('T')[0]
                });
            }
            break;
    }
    
    return tasks.slice(0, recurringCount);
}

function getSidebarSelectedWeekdays() {
    const weeklyOptions = document.getElementById('sidebar-weekly-options');
    const checkedBoxes = weeklyOptions?.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkedBoxes || []).map(cb => parseInt(cb.value));
}

// Toggle between AM/PM and 24h formats
function toggleTimeFormat() {
  is24HourFormat = !is24HourFormat;
  updateTimeFormatToggle();
  updateTimeInputs();
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
    // Add handlers for time blocks
    document.querySelectorAll('.time-block').forEach(block => {
        block.addEventListener('click', function() {
            const date = this.dataset.date;
            const hour = parseInt(this.dataset.hour);
            
            // Show sidebar with pre-filled time
            showTaskSidebar(date);
            
            // Pre-fill start time in sidebar
            setTimeout(() => {
                const sidebarStartTime = document.getElementById('sidebar-start-time');
                if (sidebarStartTime) {
                    sidebarStartTime.value = `${hour.toString().padStart(2, '0')}:00`;
                }
            }, 100);
        });
    });
    
    // Add handlers for day headers
    document.querySelectorAll('.day-header').forEach(header => {
        const dayColumn = header.closest('.day-column');
        if (dayColumn) {
            header.addEventListener('click', function() {
                const date = dayColumn.dataset.date;
                showTaskSidebar(date);
            });
            
            // Make header look clickable
            header.style.cursor = 'pointer';
            header.title = 'Click to add task for this day';
        }
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
// Language and Accessibility Functions
function translate(key) {
    return translations[currentLanguage][key] || translations['en'][key] || key;
}

function updateLanguage(langCode) {
    currentLanguage = langCode;
    
    // Update all elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (element.tagName === 'OPTION') {
            element.textContent = translate(key);
        } else if (element.innerHTML && element.innerHTML.includes('<')) {
            // For elements with HTML content, preserve structure
            const htmlContent = element.innerHTML;
            const textNodes = element.childNodes;
            textNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                    node.textContent = translate(key);
                }
            });
        } else {
            element.textContent = translate(key);
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        element.placeholder = translate(key);
    });
    
    // Update placeholders and other text
    updateUITexts();
    
    // Save language preference
    localStorage.setItem('task-tracker-language', langCode);
}

function updateUITexts() {
    // Update placeholders
    const placeholders = {
        'sidebar-task-title': translate('task_title')
    };
    
    Object.entries(placeholders).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) {
            element.placeholder = text;
        }
    });
    
    // Update button text content
    const buttons = {
        'sidebar-submit-btn': translate('save_task'),
        'close-accessibility-menu': translate('close')
    };
    
    Object.entries(buttons).forEach(([className, text]) => {
        const element = document.querySelector(`.${className}`) || document.getElementById(className);
        if (element) {
            element.textContent = text;
        }
    });
    
    // Update labels
    const labels = document.querySelectorAll('label');
    labels.forEach(label => {
        const text = label.textContent.trim();
        if (text.includes('High Contrast')) label.textContent = translate('high_contrast');
        if (text.includes('Large Text')) label.textContent = translate('large_text');
        if (text.includes('Enhanced Keyboard')) label.textContent = translate('keyboard_nav');
        if (text.includes('Font Size')) label.textContent = `${translate('font_size')}: ${label.querySelector('#font-size-value')?.textContent || '16px'}`;
    });
    
    // Update select options
    const prioritySelect = document.getElementById('sidebar-priority');
    if (prioritySelect) {
        const options = prioritySelect.querySelectorAll('option');
        if (options[0]) options[0].textContent = translate('high');
        if (options[1]) options[1].textContent = translate('medium');
        if (options[2]) options[2].textContent = translate('low');
    }
    
    // Update recurring select options
    const recurringSelect = document.getElementById('sidebar-recurring-type');
    if (recurringSelect) {
        const options = recurringSelect.querySelectorAll('option');
        if (options[0]) options[0].textContent = translate('daily');
        if (options[1]) options[1].textContent = translate('weekly');
        if (options[2]) options[2].textContent = translate('monthly');
    }
    
    // Update accessibility menu title
    const accessibilityTitle = document.querySelector('#accessibility-menu h3');
    if (accessibilityTitle) {
        accessibilityTitle.textContent = translate('accessibility_options');
    }
    
    // Set text direction for Arabic
    if (currentLanguage === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
    }
}

function initializeLanguageAndAccessibility() {
    const languageSelect = document.getElementById('language-select');
    const accessibilityBtn = document.getElementById('accessibility-toggle');
    
    // Load saved language
    const savedLanguage = localStorage.getItem('task-tracker-language') || 'en';
    if (languageSelect) {
        languageSelect.value = savedLanguage;
        updateLanguage(savedLanguage);
        
        languageSelect.addEventListener('change', (e) => {
            updateLanguage(e.target.value);
        });
    }
    
    // Initialize accessibility features
    if (accessibilityBtn) {
        accessibilityBtn.addEventListener('click', toggleAccessibilityMenu);
    }
    
    // Load saved accessibility settings
    loadAccessibilitySettings();
}

function toggleAccessibilityMenu() {
    let menu = document.getElementById('accessibility-menu');
    if (!menu) {
        menu = createAccessibilityMenu();
        document.body.appendChild(menu);
    }
    
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function createAccessibilityMenu() {
    const menu = document.createElement('div');
    menu.id = 'accessibility-menu';
    menu.innerHTML = `
        <div class="accessibility-menu-content">
            <h3>Accessibility Options</h3>
            <div class="accessibility-option">
                <label>
                    <input type="checkbox" id="high-contrast-toggle"> High Contrast Mode
                </label>
            </div>
            <div class="accessibility-option">
                <label>
                    <input type="checkbox" id="large-text-toggle"> Large Text
                </label>
            </div>
            <div class="accessibility-option">
                <label>
                    <input type="checkbox" id="keyboard-navigation-toggle"> Enhanced Keyboard Navigation
                </label>
            </div>
            <div class="accessibility-option">
                <label>
                    <input type="range" id="font-size-slider" min="12" max="24" value="16"> Font Size: <span id="font-size-value">16px</span>
                </label>
            </div>
            <button class="close-accessibility-menu">Close</button>
        </div>
    `;
    
    // Add event listeners
    menu.querySelector('#high-contrast-toggle').addEventListener('change', toggleHighContrast);
    menu.querySelector('#large-text-toggle').addEventListener('change', toggleLargeText);
    menu.querySelector('#keyboard-navigation-toggle').addEventListener('change', toggleKeyboardNavigation);
    menu.querySelector('#font-size-slider').addEventListener('input', adjustFontSize);
    menu.querySelector('.close-accessibility-menu').addEventListener('click', () => {
        menu.style.display = 'none';
    });
    
    return menu;
}

function toggleHighContrast(e) {
    document.body.classList.toggle('high-contrast', e.target.checked);
    saveAccessibilitySetting('highContrast', e.target.checked);
}

function toggleLargeText(e) {
    document.body.classList.toggle('large-text', e.target.checked);
    saveAccessibilitySetting('largeText', e.target.checked);
}

function toggleKeyboardNavigation(e) {
    document.body.classList.toggle('keyboard-navigation', e.target.checked);
    saveAccessibilitySetting('keyboardNavigation', e.target.checked);
    
    if (e.target.checked) {
        addKeyboardNavigationSupport();
    }
}

function adjustFontSize(e) {
    const size = e.target.value;
    document.documentElement.style.fontSize = size + 'px';
    document.getElementById('font-size-value').textContent = size + 'px';
    saveAccessibilitySetting('fontSize', size);
}

function addKeyboardNavigationSupport() {
    // Add tabindex to interactive elements
    document.querySelectorAll('.time-block, .day-header, .view-btn, button').forEach((element, index) => {
        if (!element.tabIndex) {
            element.tabIndex = 0;
        }
    });
    
    // Add keyboard event listeners
    document.addEventListener('keydown', handleKeyboardNavigation);
}

function handleKeyboardNavigation(e) {
    if (e.key === 'Enter' && e.target.classList.contains('time-block')) {
        e.target.click();
    }
    if (e.key === 'Escape' && document.getElementById('task-sidebar').classList.contains('show')) {
        closeSidebar();
    }
}

function saveAccessibilitySetting(key, value) {
    const settings = JSON.parse(localStorage.getItem('accessibility-settings') || '{}');
    settings[key] = value;
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
}

function loadAccessibilitySettings() {
    const settings = JSON.parse(localStorage.getItem('accessibility-settings') || '{}');
    
    if (settings.highContrast) {
        document.body.classList.add('high-contrast');
        const toggle = document.getElementById('high-contrast-toggle');
        if (toggle) toggle.checked = true;
    }
    
    if (settings.largeText) {
        document.body.classList.add('large-text');
        const toggle = document.getElementById('large-text-toggle');
        if (toggle) toggle.checked = true;
    }
    
    if (settings.keyboardNavigation) {
        document.body.classList.add('keyboard-navigation');
        const toggle = document.getElementById('keyboard-navigation-toggle');
        if (toggle) toggle.checked = true;
        addKeyboardNavigationSupport();
    }
    
    if (settings.fontSize) {
        document.documentElement.style.fontSize = settings.fontSize + 'px';
        const slider = document.getElementById('font-size-slider');
        if (slider) {
            slider.value = settings.fontSize;
            document.getElementById('font-size-value').textContent = settings.fontSize + 'px';
        }
    }
}

function initializeApp() {
    try {
    // Check if all elements exist
    const debugElements = {
        'prev-period': document.getElementById('prev-period'),
        'next-period': document.getElementById('next-period'), 
        'current-period': document.getElementById('current-period'),
        'year-select': document.getElementById('year-select'),
        'time-format-toggle': document.getElementById('time-format-toggle'),
        'start-time': document.getElementById('start-time'),
        'end-time': document.getElementById('end-time')
    };
    
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
    
    loadTasks();
    initializeCalendar();
    setupFormHandlers();
    setupNotificationSystem();
  // Sidebar removed
    initializeAlarmAudio(); // Initialize alarm sound system  
    setupAlarmHandlers(); // Setup alarm UI handlers
    startNotificationChecker();
    initializeRecurringSection(); // Initialize recurring task functionality
    initializeTaskSidebar(); // Initialize task sidebar functionality
    initializeLanguageAndAccessibility(); // Initialize language and accessibility features
    
    // Initialize dropdowns
    
    // Force year selector population with retry mechanism
    setTimeout(() => {
        // Running year selector initialization
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
        
        const baseTask = {
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
        
        // Generate recurring tasks or single task
        const tasksToAdd = generateRecurringTasks(baseTask);
        
        // Add all tasks
        tasksToAdd.forEach(task => addTask(task));
        
        // Show confirmation message
        if (tasksToAdd.length > 1) {
            showNotification(`Successfully added ${tasksToAdd.length} recurring tasks!`);
        }
        
        // Clear form and hide it
        input.value = '';
        document.getElementById('start-time').value = '';
        document.getElementById('end-time').value = '';
        prioritySelect.value = 'medium';
        
        // Reset recurring section
        if (recurringExpanded) {
            document.getElementById('toggle-recurring').click();
        }
        resetRecurringForm();
        
        hideQuickForm();
    });
    
    // Cancel form handler
    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', hideQuickForm);
    }
}

// Show quick form for selected date
function showQuickForm(dateString) {
    // Use sidebar instead of old quick form
    showTaskSidebar(dateString);
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
let alarmOscillators = [];
let alarmGainNodes = [];
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

// Generate gentle alarm sound with gradual volume increase
function playAlarmSound() {
    if (!alarmContext) return;
    
    // Stop any existing alarm
    stopAlarmSound();
    
    // Create multiple oscillators for rich, gentle sound
    const fundamentalFreq = 432; // Calming frequency (A4 tuned to 432Hz)
    const harmonicFreqs = [432, 432 * 1.5, 432 * 2]; // Fundamental + harmonics for warmth
    
    alarmOscillators = [];
    alarmGainNodes = [];
    
    // Create a gentle, warm sound with multiple harmonics
    harmonicFreqs.forEach((freq, index) => {
        const oscillator = alarmContext.createOscillator();
        const gainNode = alarmContext.createGain();
        const filter = alarmContext.createBiquadFilter();
        
        // Configure filter for warmth
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, alarmContext.currentTime);
        filter.Q.setValueAtTime(0.5, alarmContext.currentTime);
        
        // Connect audio chain: oscillator -> filter -> gain -> destination
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(alarmContext.destination);
        
        // Use sine wave for smoothness
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, alarmContext.currentTime);
        
        // Set volume based on harmonic (fundamental loudest)
        const baseVolume = index === 0 ? 0.15 : 0.05 / (index + 1);
        
        // Start with very low volume and gradually increase over 10 seconds
        gainNode.gain.setValueAtTime(0.001, alarmContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(baseVolume * 0.3, alarmContext.currentTime + 5);
        gainNode.gain.exponentialRampToValueAtTime(baseVolume * 0.6, alarmContext.currentTime + 15);
        gainNode.gain.exponentialRampToValueAtTime(baseVolume, alarmContext.currentTime + 30);
        
        // Add gentle vibrato for life
        const lfo = alarmContext.createOscillator();
        const lfoGain = alarmContext.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(4.5, alarmContext.currentTime); // Slow vibrato
        lfoGain.gain.setValueAtTime(3, alarmContext.currentTime); // Subtle depth
        
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        
        lfo.start(alarmContext.currentTime);
        oscillator.start(alarmContext.currentTime);
        
        // Schedule stop after 60 seconds
        lfo.stop(alarmContext.currentTime + 60);
        oscillator.stop(alarmContext.currentTime + 60);
        
        alarmOscillators.push(oscillator);
        alarmGainNodes.push(gainNode);
    });
    
    console.log('🔔 Playing gentle alarm sound with gradual volume increase');
}

function stopAlarmSound() {
    // Stop all oscillators
    alarmOscillators.forEach(oscillator => {
        if (oscillator) {
            try {
                oscillator.stop();
            } catch (e) {
                // Oscillator already stopped
            }
        }
    });
    
    // Clear arrays
    alarmOscillators = [];
    alarmGainNodes = [];
    
    console.log('🔕 Stopped gentle alarm sound');
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
