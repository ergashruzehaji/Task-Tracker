// Use relative URLs for API calls so it works both locally and in production
const API_BASE = window.location.origin;

// Initialize these inside DOMContentLoaded to ensure elements exist
let form, input, prioritySelect, yearSelect, timeFormatToggle, alarmAudio;
// Search and Quick Add elements
let searchInput, clearSearchBtn, quickAddBtn, exportBtn, importBtn, importInput;
let quickAddModal, quickAddForm, quickTaskInput, quickDate, quickPriority;
// Bulk operations elements
let bulkActions, selectAllBtn, deleteSelectedBtn, completeSelectedBtn;
// Sidebar toggle
let sidebarToggleBtn, taskSidebar;
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
    task_form_title: "Add New Task", select_days: "Select Days", every: "Every",
    weekdays_only: "Weekdays Only", weekends_only: "Weekends Only", custom: "Custom",
    // Short day names
    mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
    // Months
    january: "January", february: "February", march: "March", april: "April",
    may: "May", june: "June", july: "July", august: "August",
    september: "September", october: "October", november: "November", december: "December",
    // Month index translations for calendar
    month_0: "January", month_1: "February", month_2: "March", month_3: "April", month_4: "May", month_5: "June",
    month_6: "July", month_7: "August", month_8: "September", month_9: "October", month_10: "November", month_11: "December",
    // New UI elements
    tools: "Tools", tools_panel: "Tools & Tasks", search_tasks: "Search Tasks", 
    search_placeholder: "Search tasks...", quick_actions: "Quick Actions",
    export: "Export", import: "Import", bulk_actions: "Bulk Actions",
    select_all: "Select All", delete_selected: "Delete Selected", 
    complete_selected: "Complete Selected", add_task_for: "Add Task for",
    // Priority Legend
    priority_legend: "Priority Legend", high_priority: "High Priority", 
    medium_priority: "Medium Priority", low_priority: "Low Priority"
  },
  es: {
    view_day: "Día", view_week: "Semana", view_month: "Mes", add_task: "Agregar Tarea", cancel: "Cancelar",
    task_title: "Título de Tarea", start_time: "Hora de Inicio", end_time: "Hora de Fin", priority: "Prioridad",
    high: "Alta", medium: "Media", low: "Baja", recurring: "Recurrente", daily: "Diario",
    weekly: "Semanal", monthly: "Mensual", save_task: "Guardar Tarea", close: "Cerrar",
    monday: "Lunes", tuesday: "Martes", wednesday: "Miércoles", thursday: "Jueves",
    friday: "Viernes", saturday: "Sábado", sunday: "Domingo",
    task_form_title: "Agregar Nueva Tarea", select_days: "Seleccionar Días", every: "Cada",
    weekdays_only: "Solo Días Laborables", weekends_only: "Solo Fines de Semana", custom: "Personalizado",
    // Short day names  
    mon: "Lun", tue: "Mar", wed: "Mié", thu: "Jue", fri: "Vie", sat: "Sáb", sun: "Dom",
    // Months
    january: "Enero", february: "Febrero", march: "Marzo", april: "Abril",
    may: "Mayo", june: "Junio", july: "Julio", august: "Agosto", 
    september: "Septiembre", october: "Octubre", november: "Noviembre", december: "Diciembre",
    // Month index translations for calendar
    month_0: "Enero", month_1: "Febrero", month_2: "Marzo", month_3: "Abril", month_4: "Mayo", month_5: "Junio",
    month_6: "Julio", month_7: "Agosto", month_8: "Septiembre", month_9: "Octubre", month_10: "Noviembre", month_11: "Diciembre",
    // New UI elements
    tools: "Herramientas", tools_panel: "Herramientas y Tareas", search_tasks: "Buscar Tareas", 
    search_placeholder: "Buscar tareas...", quick_actions: "Acciones Rápidas",
    export: "Exportar", import: "Importar", bulk_actions: "Acciones en Lote",
    select_all: "Seleccionar Todo", delete_selected: "Eliminar Seleccionadas", 
    complete_selected: "Completar Seleccionadas", add_task_for: "Agregar Tarea para",
    // Priority Legend
    priority_legend: "Leyenda de Prioridades", high_priority: "Alta Prioridad",
    medium_priority: "Prioridad Media", low_priority: "Baja Prioridad"
  },
  fr: {
    view_day: "Jour", view_week: "Semaine", view_month: "Mois", add_task: "Ajouter Tâche", cancel: "Annuler",
    task_title: "Titre de Tâche", start_time: "Heure de Début", end_time: "Heure de Fin", priority: "Priorité",
    high: "Élevée", medium: "Moyenne", low: "Faible", recurring: "Récurrent", daily: "Quotidien",
    weekly: "Hebdomadaire", monthly: "Mensuel", save_task: "Enregistrer Tâche", close: "Fermer",
    monday: "Lundi", tuesday: "Mardi", wednesday: "Mercredi", thursday: "Jeudi",
    friday: "Vendredi", saturday: "Samedi", sunday: "Dimanche",
    task_form_title: "Ajouter Nouvelle Tâche", select_days: "Sélectionner Jours", every: "Chaque",
    weekdays_only: "Jours de Semaine Seulement", weekends_only: "Week-ends Seulement", custom: "Personnalisé",
    // Short day names
    mon: "Lun", tue: "Mar", wed: "Mer", thu: "Jeu", fri: "Ven", sat: "Sam", sun: "Dim",
    // Months
    january: "Janvier", february: "Février", march: "Mars", april: "Avril",
    may: "Mai", june: "Juin", july: "Juillet", august: "Août",
    september: "Septembre", october: "Octobre", november: "Novembre", december: "Décembre",
    month_0: "Janvier", month_1: "Février", month_2: "Mars", month_3: "Avril", month_4: "Mai", month_5: "Juin",
    month_6: "Juillet", month_7: "Août", month_8: "Septembre", month_9: "Octobre", month_10: "Novembre", month_11: "Décembre",
    // New UI elements
    tools: "Outils", tools_panel: "Outils et Tâches", search_tasks: "Rechercher Tâches", 
    search_placeholder: "Rechercher tâches...", quick_actions: "Actions Rapides",
    export: "Exporter", import: "Importer", bulk_actions: "Actions en Lot",
    select_all: "Tout Sélectionner", delete_selected: "Supprimer Sélectionnées", 
    complete_selected: "Terminer Sélectionnées", add_task_for: "Ajouter Tâche pour",
    // Priority Legend
    priority_legend: "Légende des priorités", high_priority: "Priorité élevée",
    medium_priority: "Priorité moyenne", low_priority: "Priorité faible"
  },
  zh: {
    view_day: "日", view_week: "周", view_month: "月", add_task: "添加任务", cancel: "取消",
    task_title: "任务标题", start_time: "开始时间", end_time: "结束时间", priority: "优先级",
    high: "高", medium: "中", low: "低", recurring: "重复", daily: "每日",
    weekly: "每周", monthly: "每月", save_task: "保存任务", close: "关闭",
    monday: "星期一", tuesday: "星期二", wednesday: "星期三", thursday: "星期四",
    friday: "星期五", saturday: "星期六", sunday: "星期日",
    task_form_title: "添加新任务", select_days: "选择日期", every: "每",
    weekdays_only: "仅工作日", weekends_only: "仅周末", custom: "自定义",
    // Short day names
    mon: "周一", tue: "周二", wed: "周三", thu: "周四", fri: "周五", sat: "周六", sun: "周日",
    // Months
    january: "一月", february: "二月", march: "三月", april: "四月",
    may: "五月", june: "六月", july: "七月", august: "八月",
    september: "九月", october: "十月", november: "十一月", december: "十二月",
    month_0: "一月", month_1: "二月", month_2: "三月", month_3: "四月", month_4: "五月", month_5: "六月",
    month_6: "七月", month_7: "八月", month_8: "九月", month_9: "十月", month_10: "十一月", month_11: "十二月",
    // New UI elements
    tools: "工具", tools_panel: "工具和任务", search_tasks: "搜索任务", 
    search_placeholder: "搜索任务...", quick_actions: "快速操作",
    export: "导出", import: "导入", bulk_actions: "批量操作",
    select_all: "全选", delete_selected: "删除选中", 
    complete_selected: "完成选中", add_task_for: "为...添加任务",
    // Priority Legend
    priority_legend: "优先级图例", high_priority: "高优先级",
    medium_priority: "中优先级", low_priority: "低优先级"
  },
  it: {
    view_day: "Giorno", view_week: "Settimana", view_month: "Mese", add_task: "Aggiungi Attività", cancel: "Annulla",
    task_title: "Titolo Attività", start_time: "Ora Inizio", end_time: "Ora Fine", priority: "Priorità",
    high: "Alta", medium: "Media", low: "Bassa", recurring: "Ricorrente", daily: "Giornaliero",
    weekly: "Settimanale", monthly: "Mensile", save_task: "Salva Attività", close: "Chiudi",
    monday: "Lunedì", tuesday: "Martedì", wednesday: "Mercoledì", thursday: "Giovedì",
    friday: "Venerdì", saturday: "Sabato", sunday: "Domenica",
    task_form_title: "Aggiungi Nuova Attività", select_days: "Seleziona Giorni", every: "Ogni",
    weekdays_only: "Solo Giorni Feriali", weekends_only: "Solo Weekend", custom: "Personalizzato",
    // Short day names
    mon: "Lun", tue: "Mar", wed: "Mer", thu: "Gio", fri: "Ven", sat: "Sab", sun: "Dom",
    // Months
    january: "Gennaio", february: "Febbraio", march: "Marzo", april: "Aprile",
    may: "Maggio", june: "Giugno", july: "Luglio", august: "Agosto",
    september: "Settembre", october: "Ottobre", november: "Novembre", december: "Dicembre",
    month_0: "Gennaio", month_1: "Febbraio", month_2: "Marzo", month_3: "Aprile", month_4: "Maggio", month_5: "Giugno",
    month_6: "Luglio", month_7: "Agosto", month_8: "Settembre", month_9: "Ottobre", month_10: "Novembre", month_11: "Dicembre",
    // New UI elements
    tools: "Strumenti", tools_panel: "Strumenti e Attività", search_tasks: "Cerca Attività", 
    search_placeholder: "Cerca attività...", quick_actions: "Azioni Rapide",
    export: "Esporta", import: "Importa", bulk_actions: "Azioni Multiple",
    select_all: "Seleziona Tutto", delete_selected: "Elimina Selezionate", 
    complete_selected: "Completa Selezionate", add_task_for: "Aggiungi Attività per",
    // Priority Legend
    priority_legend: "Legenda Priorità", high_priority: "Alta Priorità",
    medium_priority: "Media Priorità", low_priority: "Bassa Priorità"
  },
  ru: {
    view_day: "День", view_week: "Неделя", view_month: "Месяц", add_task: "Добавить Задачу", cancel: "Отмена",
    task_title: "Название Задачи", start_time: "Время Начала", end_time: "Время Окончания", priority: "Приоритет",
    high: "Высокий", medium: "Средний", low: "Низкий", recurring: "Повторяющийся", daily: "Ежедневно",
    weekly: "Еженедельно", monthly: "Ежемесячно", save_task: "Сохранить Задачу", close: "Закрыть",
    monday: "Понедельник", tuesday: "Вторник", wednesday: "Среда", thursday: "Четверг",
    friday: "Пятница", saturday: "Суббота", sunday: "Воскресенье",
    task_form_title: "Добавить Новую Задачу", select_days: "Выбрать Дни", every: "Каждый",
    weekdays_only: "Только Будни", weekends_only: "Только Выходные", custom: "Настроить",
    // Short day names
    mon: "Пн", tue: "Вт", wed: "Ср", thu: "Чт", fri: "Пт", sat: "Сб", sun: "Вс",
    // Months
    january: "Январь", february: "Февраль", march: "Март", april: "Апрель",
    may: "Май", june: "Июнь", july: "Июль", august: "Август",
    september: "Сентябрь", october: "Октябрь", november: "Ноябрь", december: "Декабрь",
    month_0: "Январь", month_1: "Февраль", month_2: "Март", month_3: "Апрель", month_4: "Май", month_5: "Июнь",
    month_6: "Июль", month_7: "Август", month_8: "Сентябрь", month_9: "Октябрь", month_10: "Ноябрь", month_11: "Декабрь",
    // Priority Legend
    priority_legend: "Легенда Приоритетов", high_priority: "Высокий Приоритет",
    medium_priority: "Средний Приоритет", low_priority: "Низкий Приоритет"
  },
  ja: {
    view_day: "日", view_week: "週", view_month: "月", add_task: "タスクを追加", cancel: "キャンセル",
    task_title: "タスクタイトル", start_time: "開始時間", end_time: "終了時間", priority: "優先度",
    high: "高", medium: "中", low: "低", recurring: "繰り返し", daily: "毎日",
    weekly: "毎週", monthly: "毎月", save_task: "タスクを保存", close: "閉じる",
    monday: "月曜日", tuesday: "火曜日", wednesday: "水曜日", thursday: "木曜日",
    friday: "金曜日", saturday: "土曜日", sunday: "日曜日",
    task_form_title: "新しいタスクを追加", select_days: "日を選択", every: "毎",
    weekdays_only: "平日のみ", weekends_only: "週末のみ", custom: "カスタム",
    // Short day names
    mon: "月", tue: "火", wed: "水", thu: "木", fri: "金", sat: "土", sun: "日",
    // Months
    january: "1月", february: "2月", march: "3月", april: "4月",
    may: "5月", june: "6月", july: "7月", august: "8月",
    september: "9月", october: "10月", november: "11月", december: "12月",
    month_0: "1月", month_1: "2月", month_2: "3月", month_3: "4月", month_4: "5月", month_5: "6月",
    month_6: "7月", month_7: "8月", month_8: "9月", month_9: "10月", month_10: "11月", month_11: "12月",
    // Priority Legend
    priority_legend: "優先度凡例", high_priority: "高優先度",
    medium_priority: "中優先度", low_priority: "低優先度"
  },
  tr: {
    view_day: "Gün", view_week: "Hafta", view_month: "Ay", add_task: "Görev Ekle", cancel: "İptal",
    task_title: "Görev Başlığı", start_time: "Başlangıç Saati", end_time: "Bitiş Saati", priority: "Öncelik",
    high: "Yüksek", medium: "Orta", low: "Düşük", recurring: "Tekrarlayan", daily: "Günlük",
    weekly: "Haftalık", monthly: "Aylık", save_task: "Görevi Kaydet", close: "Kapat",
    monday: "Pazartesi", tuesday: "Salı", wednesday: "Çarşamba", thursday: "Perşembe",
    friday: "Cuma", saturday: "Cumartesi", sunday: "Pazar",
    task_form_title: "Yeni Görev Ekle", select_days: "Günleri Seç", every: "Her",
    weekdays_only: "Sadece Hafta İçi", weekends_only: "Sadece Hafta Sonu", custom: "Özel",
    // Short day names
    mon: "Pzt", tue: "Sal", wed: "Çar", thu: "Per", fri: "Cum", sat: "Cmt", sun: "Paz",
    // Months
    january: "Ocak", february: "Şubat", march: "Mart", april: "Nisan",
    may: "Mayıs", june: "Haziran", july: "Temmuz", august: "Ağustos",
    september: "Eylül", october: "Ekim", november: "Kasım", december: "Aralık",
    month_0: "Ocak", month_1: "Şubat", month_2: "Mart", month_3: "Nisan", month_4: "Mayıs", month_5: "Haziran",
    month_6: "Temmuz", month_7: "Ağustos", month_8: "Eylül", month_9: "Ekim", month_10: "Kasım", month_11: "Aralık",
    // Priority Legend
    priority_legend: "Öncelik Açıklaması", high_priority: "Yüksek Öncelik",
    medium_priority: "Orta Öncelik", low_priority: "Düşük Öncelik"
  },
  ar: {
    view_day: "يوم", view_week: "أسبوع", view_month: "شهر", add_task: "إضافة مهمة", cancel: "إلغاء",
    task_title: "عنوان المهمة", start_time: "وقت البداية", end_time: "وقت النهاية", priority: "الأولوية",
    high: "عالية", medium: "متوسطة", low: "منخفضة", recurring: "متكررة", daily: "يومياً",
    weekly: "أسبوعياً", monthly: "شهرياً", save_task: "حفظ المهمة", close: "إغلاق",
    monday: "الإثنين", tuesday: "الثلاثاء", wednesday: "الأربعاء", thursday: "الخميس",
    friday: "الجمعة", saturday: "السبت", sunday: "الأحد",
    task_form_title: "إضافة مهمة جديدة", select_days: "اختر الأيام", every: "كل",
    weekdays_only: "أيام العمل فقط", weekends_only: "عطلة نهاية الأسبوع فقط", custom: "مخصص",
    // Short day names
    mon: "إثن", tue: "ثلا", wed: "أرب", thu: "خمي", fri: "جمع", sat: "سبت", sun: "أحد",
    // Months
    january: "يناير", february: "فبراير", march: "مارس", april: "أبريل",
    may: "مايو", june: "يونيو", july: "يوليو", august: "أغسطس",
    september: "سبتمبر", october: "أكتوبر", november: "نوفمبر", december: "ديسمبر",
    month_0: "يناير", month_1: "فبراير", month_2: "مارس", month_3: "أبريل", month_4: "مايو", month_5: "يونيو",
    month_6: "يوليو", month_7: "أغسطس", month_8: "سبتمبر", month_9: "أكتوبر", month_10: "نوفمبر", month_11: "ديسمبر",
    // Priority Legend
    priority_legend: "مفتاح الأولويات", high_priority: "أولوية عالية",
    medium_priority: "أولوية متوسطة", low_priority: "أولوية منخفضة"
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

function clearSidebarForm() {
    // Clear form fields
    const taskTitle = document.getElementById('sidebar-task-title');
    const startTime = document.getElementById('sidebar-start-time');
    const endTime = document.getElementById('sidebar-end-time');
    const priority = document.getElementById('sidebar-priority');
    
    if (taskTitle) taskTitle.value = '';
    if (startTime) startTime.value = '';
    if (endTime) endTime.value = '';
    if (priority) priority.value = 'medium';
    
    // Reset recurring options
    const recurringOptions = document.getElementById('sidebar-recurring-options');
    if (recurringOptions) {
        recurringOptions.style.display = 'none';
    }
    
    const recurringType = document.getElementById('sidebar-recurring-type');
    if (recurringType) {
        recurringType.value = 'none';
    }
    
    // Clear weekday checkboxes
    const weekdayCheckboxes = document.querySelectorAll('#sidebar-weekly-options input[type="checkbox"]');
    weekdayCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
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
    
    // Clear the form before showing
    clearSidebarForm();
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
    
    // Show task form section when opening for task creation
    const taskFormSection = document.getElementById('task-form-section');
    if (taskFormSection) {
        taskFormSection.style.display = 'block';
    }
    sidebarOpen = true;
    
    console.log('🔧 Sidebar classes after show:', sidebar.className);
    console.log('🔧 Body classes:', document.body.className);
    
    // Focus on task input
    setTimeout(() => {
        const taskInput = document.getElementById('sidebar-task-title');
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
    
    const taskText = document.getElementById('sidebar-task-title')?.value.trim();
    const startTime = document.getElementById('sidebar-start-time')?.value || '';
    const endTime = document.getElementById('sidebar-end-time')?.value || '';
    const priority = document.getElementById('sidebar-priority')?.value || 'medium';
    
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
        'sidebar-submit-btn': translate('save_task')
    };
    
    Object.entries(buttons).forEach(([className, text]) => {
        const element = document.querySelector(`.${className}`) || document.getElementById(className);
        if (element) {
            element.textContent = text;
        }
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
    

    
    // Set text direction for Arabic
    if (currentLanguage === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
    }
}

function initializeLanguage() {
    const languageSelect = document.getElementById('language-select');
    
    // Load saved language
    const savedLanguage = localStorage.getItem('task-tracker-language') || 'en';
    if (languageSelect) {
        languageSelect.value = savedLanguage;
        updateLanguage(savedLanguage);
        
        languageSelect.addEventListener('change', (e) => {
            updateLanguage(e.target.value);
        });
    }
}



// Search functionality
function setupSearchFeature() {
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.toLowerCase().trim();
        
        // Show/hide clear button
        if (clearSearchBtn) {
            clearSearchBtn.style.display = query ? 'block' : 'none';
        }
        
        // Debounced search
        searchTimeout = setTimeout(() => {
            searchTasks(query);
        }, 300);
    });
    
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearSearchBtn.style.display = 'none';
            searchTasks(''); // Show all tasks
        });
    }
}

function searchTasks(query) {
    const taskItems = document.querySelectorAll('.task-item');
    let hasResults = false;
    
    taskItems.forEach(item => {
        if (!query) {
            item.classList.remove('search-hidden', 'search-match');
            hasResults = true;
            return;
        }
        
        const taskText = item.textContent.toLowerCase();
        const isMatch = taskText.includes(query);
        
        if (isMatch) {
            item.classList.remove('search-hidden');
            item.classList.add('search-match');
            hasResults = true;
        } else {
            item.classList.add('search-hidden');
            item.classList.remove('search-match');
        }
    });
    
    // Show no results message if needed
    updateSearchResultsMessage(hasResults, query);
}

function updateSearchResultsMessage(hasResults, query) {
    let messageEl = document.getElementById('search-no-results');
    
    if (!hasResults && query) {
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'search-no-results';
            messageEl.className = 'search-no-results';
            messageEl.style.cssText = `
                text-align: center;
                padding: 20px;
                color: #666;
                font-style: italic;
                background: rgba(255, 255, 255, 0.7);
                border-radius: 10px;
                margin: 20px;
            `;
            
            // Insert after calendar or at start of main content
            const calendar = document.querySelector('.calendar-layout');
            if (calendar) {
                calendar.parentNode.insertBefore(messageEl, calendar.nextSibling);
            }
        }
        messageEl.textContent = `No tasks found for "${query}"`;
        messageEl.style.display = 'block';
    } else if (messageEl) {
        messageEl.style.display = 'none';
    }
}

// Quick Add Modal functionality
function setupQuickAdd() {
    if (!quickAddBtn || !quickAddModal) return;
    
    quickAddBtn.addEventListener('click', () => {
        quickAddModal.style.display = 'flex';
        if (quickTaskInput) {
            quickTaskInput.focus();
            // Set default date to today
            if (quickDate) {
                quickDate.value = new Date().toISOString().split('T')[0];
            }
        }
    });
    
    // Close modal handlers
    const closeBtn = document.getElementById('close-quick-add');
    const cancelBtn = document.getElementById('cancel-quick-add');
    
    [closeBtn, cancelBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', closeQuickAddModal);
        }
    });
    
    // Close on overlay click
    quickAddModal.addEventListener('click', (e) => {
        if (e.target === quickAddModal) {
            closeQuickAddModal();
        }
    });
    
    // Handle form submission
    if (quickAddForm) {
        quickAddForm.addEventListener('submit', handleQuickAddSubmit);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+N or Cmd+N for quick add
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            quickAddBtn?.click();
        }
        
        // Escape to close modal
        if (e.key === 'Escape' && quickAddModal.style.display === 'flex') {
            closeQuickAddModal();
        }
        
        // Ctrl+F or Cmd+F for search focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            searchInput?.focus();
        }
        
        // Ctrl+A or Cmd+A to select all tasks (when not in input)
        if ((e.ctrlKey || e.metaKey) && e.key === 'a' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
            e.preventDefault();
            selectAllBtn?.click();
        }
        
        // Delete key to delete selected tasks
        if (e.key === 'Delete' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
            const selectedTasks = getSelectedTasks();
            if (selectedTasks.length > 0) {
                e.preventDefault();
                deleteSelectedBtn?.click();
            }
        }
        
        // Ctrl+E or Cmd+E for export
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            exportBtn?.click();
        }
    });
}

function closeQuickAddModal() {
    if (quickAddModal) {
        quickAddModal.style.display = 'none';
        if (quickAddForm) {
            quickAddForm.reset();
        }
    }
}

function handleQuickAddSubmit(e) {
    e.preventDefault();
    
    const taskText = quickTaskInput?.value?.trim();
    const taskDate = quickDate?.value;
    const taskPriority = quickPriority?.value || 'medium';
    
    if (!taskText) return;
    
    // Create task object
    const task = {
        id: Date.now(),
        text: taskText,
        priority: taskPriority,
        completed: false,
        day: taskDate || new Date().toISOString().split('T')[0]
    };
    
    // Add task using existing function
    addTask(task);
    
    // Close modal and show success message
    closeQuickAddModal();
    showNotification(`✅ Task "${taskText}" added successfully!`);
}

// Export/Import functionality
function setupDataManagement() {
    if (exportBtn) {
        exportBtn.addEventListener('click', exportTasks);
    }
    
    if (importBtn && importInput) {
        importBtn.addEventListener('click', () => importInput.click());
        importInput.addEventListener('change', importTasks);
    }
}

function exportTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const settings = {
        language: localStorage.getItem('language') || 'en',
        exportDate: new Date().toISOString()
    };
    
    const exportData = {
        tasks,
        settings,
        version: '2.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `task-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('📤 Tasks exported successfully!');
}

function importTasks(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importData = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!importData.tasks || !Array.isArray(importData.tasks)) {
                throw new Error('Invalid file format');
            }
            
            // Confirm import
            const confirmImport = confirm(
                `Import ${importData.tasks.length} tasks?\n\nThis will replace all existing tasks. This action cannot be undone.`
            );
            
            if (!confirmImport) return;
            
            // Import tasks
            localStorage.setItem('tasks', JSON.stringify(importData.tasks));
            
            // Import settings if available
            if (importData.settings?.language) {
                localStorage.setItem('language', importData.settings.language);
                currentLanguage = importData.settings.language;
            }
            
            // Refresh the app
            loadTasks();
            renderCalendar();
            
            showNotification(`✅ Successfully imported ${importData.tasks.length} tasks!`);
            
        } catch (error) {
            console.error('Import error:', error);
            showNotification('❌ Failed to import tasks. Please check the file format.');
        }
    };
    
    reader.readAsText(file);
}

// Sidebar toggle functionality
function setupSidebarToggle() {
    if (!sidebarToggleBtn || !taskSidebar) return;
    
    sidebarToggleBtn.addEventListener('click', () => {
        const isOpen = taskSidebar.classList.contains('show');
        
        if (isOpen) {
            closeSidebar();
        } else {
            // Open sidebar in tools mode (not task creation mode)
            taskSidebar.classList.add('show');
            document.body.classList.add('sidebar-open');
            
            // Hide task form section when opening in tools mode
            const taskFormSection = document.getElementById('task-form-section');
            if (taskFormSection) {
                taskFormSection.style.display = 'none';
            }
        }
    });
}

// Bulk operations functionality
function setupBulkOperations() {
    if (!bulkActions) return;
    
    // Select all button
    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('.task-checkbox');
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            
            checkboxes.forEach(cb => {
                cb.checked = !allChecked;
                toggleTaskSelection(cb);
            });
            
            selectAllBtn.textContent = allChecked ? 'Select All' : 'Deselect All';
        });
    }
    
    // Delete selected button
    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener('click', () => {
            const selectedTasks = getSelectedTasks();
            if (selectedTasks.length === 0) {
                showNotification('No tasks selected');
                return;
            }
            
            const confirmDelete = confirm(`Delete ${selectedTasks.length} selected task(s)?`);
            if (confirmDelete) {
                deleteSelectedTasks(selectedTasks);
            }
        });
    }
    
    // Complete selected button
    if (completeSelectedBtn) {
        completeSelectedBtn.addEventListener('click', () => {
            const selectedTasks = getSelectedTasks();
            if (selectedTasks.length === 0) {
                showNotification('No tasks selected');
                return;
            }
            
            completeSelectedTasks(selectedTasks);
        });
    }
}

function addTaskCheckbox(taskElement, taskId) {
    if (taskElement.querySelector('.task-checkbox')) return; // Already has checkbox
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.dataset.taskId = taskId;
    
    checkbox.addEventListener('change', () => {
        toggleTaskSelection(checkbox);
        updateBulkActionsVisibility();
    });
    
    taskElement.insertBefore(checkbox, taskElement.firstChild);
    
    // Wrap existing content
    const existingContent = Array.from(taskElement.children).slice(1);
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'task-content';
    
    existingContent.forEach(child => {
        contentWrapper.appendChild(child);
    });
    
    taskElement.appendChild(contentWrapper);
}

function toggleTaskSelection(checkbox) {
    const taskElement = checkbox.closest('.task-item');
    if (taskElement) {
        taskElement.classList.toggle('selected', checkbox.checked);
    }
}

function updateBulkActionsVisibility() {
    const selectedCount = document.querySelectorAll('.task-checkbox:checked').length;
    
    if (bulkActions) {
        bulkActions.style.display = selectedCount > 0 ? 'flex' : 'none';
    }
    
    // Update select all button text
    if (selectAllBtn) {
        const totalCheckboxes = document.querySelectorAll('.task-checkbox').length;
        const allSelected = selectedCount === totalCheckboxes && totalCheckboxes > 0;
        selectAllBtn.textContent = allSelected ? 'Deselect All' : 'Select All';
    }
}

function getSelectedTasks() {
    const selectedCheckboxes = document.querySelectorAll('.task-checkbox:checked');
    return Array.from(selectedCheckboxes).map(cb => ({
        id: cb.dataset.taskId,
        element: cb.closest('.task-item')
    }));
}

function deleteSelectedTasks(selectedTasks) {
    selectedTasks.forEach(task => {
        // Remove from DOM
        if (task.element) {
            task.element.remove();
        }
        
        // Remove from storage
        let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks = tasks.filter(t => t.id.toString() !== task.id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    });
    
    updateBulkActionsVisibility();
    showNotification(`🗑️ Deleted ${selectedTasks.length} task(s)`);
}

function completeSelectedTasks(selectedTasks) {
    selectedTasks.forEach(task => {
        const taskElement = task.element;
        if (taskElement) {
            // Toggle completion visually
            taskElement.classList.add('completed');
            
            // Update in storage
            let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            const taskIndex = tasks.findIndex(t => t.id.toString() === task.id);
            if (taskIndex !== -1) {
                tasks[taskIndex].completed = true;
            }
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    });
    
    // Clear selections
    document.querySelectorAll('.task-checkbox:checked').forEach(cb => {
        cb.checked = false;
        toggleTaskSelection(cb);
    });
    
    updateBulkActionsVisibility();
    showNotification(`✅ Completed ${selectedTasks.length} task(s)`);
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
    
    // Initialize search and quick add elements
    searchInput = document.getElementById('search-input');
    clearSearchBtn = document.getElementById('clear-search');
    quickAddBtn = document.getElementById('quick-add-btn');
    exportBtn = document.getElementById('export-btn');
    importBtn = document.getElementById('import-btn');
    importInput = document.getElementById('import-input');
    quickAddModal = document.getElementById('quick-add-modal');
    quickAddForm = document.getElementById('quick-add-form');
    quickTaskInput = document.getElementById('quick-task-input');
    quickDate = document.getElementById('quick-date');
    quickPriority = document.getElementById('quick-priority');
    
    // Initialize bulk operations elements
    bulkActions = document.getElementById('bulk-actions');
    selectAllBtn = document.getElementById('select-all-btn');
    deleteSelectedBtn = document.getElementById('delete-selected-btn');
    completeSelectedBtn = document.getElementById('complete-selected-btn');
    
    // Initialize sidebar toggle elements
    sidebarToggleBtn = document.getElementById('sidebar-toggle');
    taskSidebar = document.getElementById('task-sidebar');
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
    initializeLanguage(); // Initialize language features
    
    // Initialize new features
    setupSearchFeature();
    setupQuickAdd();
    setupDataManagement();
    setupBulkOperations();
    setupSidebarToggle();
    
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
  // Use localStorage directly for better performance and reliability
  tasks.push(task);
  saveTasksToLocalStorage();
  
  // Refresh calendar and check for notifications
  renderCalendar();
  renderCurrentView(); // Also refresh timeslot view
  setupAlarmForTask(task);
  checkForActiveNotifications();
  
  // Sidebar removed
}

// Load tasks
async function loadTasks() {
  // Use localStorage directly for better performance
  loadTasksFromLocalStorage();
  
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
  li.classList.add('task-item'); // Add task-item class for styling and selection
  li.dataset.taskId = task.id; // Add task ID for bulk operations
  
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
    <input type="checkbox" class="task-checkbox" data-task-id="${task.id}">
    <div class="task-content">
      <div style="display: flex; align-items: center;">
        <input type="checkbox" class="completion-checkbox" ${task.completed ? 'checked' : ''} 
               onchange="toggleTaskCompletion(${task.id})" style="margin-right: 10px;">
        <div class="task-priority ${task.priority || 'medium'}"></div>
        <div class="task-text ${task.completed ? 'completed' : ''}">${task.text}</div>
      </div>
      <div class="task-details">
        ${taskDetails.join('')}
      </div>
    </div>
    <div class="task-actions">
      <button class="delete-btn" onclick="deleteTask('${task.day || new Date().toISOString().split('T')[0]}', ${task.id})">Delete</button>
    </div>
  `;
  
  if (!list) return;
  list.appendChild(li);
  
  // Add event listener for bulk selection checkbox
  const bulkCheckbox = li.querySelector('.task-checkbox');
  if (bulkCheckbox) {
    bulkCheckbox.addEventListener('change', () => {
      toggleTaskSelection(bulkCheckbox);
      updateBulkActionsVisibility();
    });
  }
}

// Toggle task completion
async function toggleTaskCompletion(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  
  task.completed = !task.completed;
  
  // Save to localStorage
  saveTasksToLocalStorage();
  
  saveTasksToLocalStorage();
  renderCalendar();
  checkForActiveNotifications();
}

// Delete task
async function deleteTask(date, id) {
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
        const monthKey = `month_${month}`;
        const monthName = translations[currentLanguage][monthKey] || translations['en'][monthKey];
        currentMonthDisplay.textContent = `${monthName} ${year}`;
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
        // Remove completed tasks from local array
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
