// Task Manager Pro — main application logic
'use strict';

const STORAGE_KEY = 'tm_tasks_v2';
function priorityLabel(priority) {
  return t(`priority${priority.charAt(0).toUpperCase()}${priority.slice(1)}`);
}

function makeId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const I18N = {
  en: {
    subtitle: 'Organize your tasks and achieve your goals',
    taskPlaceholder: 'New task',
    priorityAria: 'Priority',
    priorityHigh: 'High',
    priorityMedium: 'Medium',
    priorityLow: 'Low',
    dateAria: 'Due date',
    datePlaceholder: 'Date',
    addTask: 'Add task',
    filterAll: 'All',
    filterCompleted: 'Completed',
    filterPending: 'Pending',
    statTotal: 'Total',
    statPending: 'Pending',
    statCompleted: 'Completed',
    statRate: 'Pending rate',
    clearCompleted: 'Clear completed',
    emptyNoTasksTitle: 'No tasks yet',
    emptyNoTasksText: 'Add your first task above to get started.',
    tipCtrlEnter: 'Ctrl+Enter to add',
    tipDueDates: 'Set due dates',
    tipPriorities: 'Use priorities',
    emptyNothingCompletedTitle: 'Nothing completed yet',
    emptyNothingCompletedText: 'Finish a task and it will show up here.',
    emptyAllCaughtUpTitle: 'All caught up',
    emptyAllCaughtUpText: 'No pending tasks left.',
    emptyNoTasksHereTitle: 'No tasks here',
    emptyNoTasksHereText: 'Try adding a new task.',
    toastEnterTask: 'Please enter a task name',
    toastTaskAdded: 'Task added',
    toastTaskCompleted: 'Task completed',
    toastTaskPending: 'Task marked as pending',
    toastTaskUpdated: 'Task updated',
    toastTaskDeleted: 'Task deleted',
    toastNoCompleted: 'No completed tasks to clear',
    toastCompletedCleared: 'Completed tasks cleared',
    confirmDeleteHigh: 'Delete this high-priority task?\n\n"{title}"',
    confirmDeleteCompleted: 'Delete {count} completed task(s)?',
    taskWordOne: 'task',
    taskWordMany: 'tasks',
    ariaMarkCompleted: 'Mark task as completed',
    ariaMarkPending: 'Mark task as pending',
    editTask: 'Edit task',
    deleteTask: 'Delete task',
    editButton: 'Edit',
    deleteButton: 'Delete',
    overdue: 'Overdue',
    due: 'Due',
    today: 'today',
    tomorrow: 'tomorrow',
    yesterday: 'yesterday',
    humidity: 'humidity',
    wind: 'wind',
    weatherUnavailable: 'Weather unavailable — check your internet connection',
    weatherClearSky: 'Clear sky',
    weatherMostlyClear: 'Mostly clear',
    weatherPartlyCloudy: 'Partly cloudy',
    weatherOvercast: 'Overcast',
    weatherFog: 'Fog',
    weatherRimeFog: 'Rime fog',
    weatherLightDrizzle: 'Light drizzle',
    weatherDrizzle: 'Drizzle',
    weatherDenseDrizzle: 'Dense drizzle',
    weatherFreezingDrizzle: 'Freezing drizzle',
    weatherFreezingDrizzleDense: 'Dense freezing drizzle',
    weatherLightRain: 'Light rain',
    weatherRain: 'Rain',
    weatherHeavyRain: 'Heavy rain',
    weatherFreezingRain: 'Freezing rain',
    weatherFreezingRainHeavy: 'Heavy freezing rain',
    weatherLightSnow: 'Light snow',
    weatherSnow: 'Snow',
    weatherHeavySnow: 'Heavy snow',
    weatherSnowGrains: 'Snow grains',
    weatherLightShowers: 'Light showers',
    weatherRainShowers: 'Rain showers',
    weatherHeavyShowers: 'Heavy showers',
    weatherSnowShowers: 'Snow showers',
    weatherSnowShowersHeavy: 'Heavy snow showers',
    weatherThunderstorm: 'Thunderstorm',
    weatherThunderstormHail: 'Thunderstorm, hail'
  },
  uk: {
    subtitle: 'Організуйте завдання та досягайте цілей',
    taskPlaceholder: 'Нове завдання',
    priorityAria: 'Пріоритет',
    priorityHigh: 'Високий',
    priorityMedium: 'Середній',
    priorityLow: 'Низький',
    dateAria: 'Термін виконання',
    datePlaceholder: 'Дата',
    addTask: 'Додати',
    filterAll: 'Усі',
    filterCompleted: 'Виконані',
    filterPending: 'В очікуванні',
    statTotal: 'Всього',
    statPending: 'В очікуванні',
    statCompleted: 'Виконано',
    statRate: 'Невиконані, %',
    clearCompleted: 'Очистити виконані',
    emptyNoTasksTitle: 'Завдань ще немає',
    emptyNoTasksText: 'Додайте перше завдання вище.',
    tipCtrlEnter: 'Ctrl+Enter — додати',
    tipDueDates: 'Встановлюйте терміни',
    tipPriorities: 'Використовуйте пріоритети',
    emptyNothingCompletedTitle: 'Виконаних ще немає',
    emptyNothingCompletedText: 'Виконайте завдання — воно з\'явиться тут.',
    emptyAllCaughtUpTitle: 'Усе виконано',
    emptyAllCaughtUpText: 'Немає завдань в очікуванні.',
    emptyNoTasksHereTitle: 'Тут порожньо',
    emptyNoTasksHereText: 'Спробуйте додати нове завдання.',
    toastEnterTask: 'Введіть назву завдання',
    toastTaskAdded: 'Завдання додано',
    toastTaskCompleted: 'Завдання виконано',
    toastTaskPending: 'Завдання повернуто в очікування',
    toastTaskUpdated: 'Завдання оновлено',
    toastTaskDeleted: 'Завдання видалено',
    toastNoCompleted: 'Немає виконаних для очищення',
    toastCompletedCleared: 'Виконані завдання очищено',
    confirmDeleteHigh: 'Видалити завдання з високим пріоритетом?\\n\\n"{title}"',
    confirmDeleteCompleted: 'Видалити {count} виконаних завдань?',
    taskWordOne: 'завдання',
    taskWordMany: 'завдань',
    ariaMarkCompleted: 'Позначити як виконане',
    ariaMarkPending: 'Позначити як невиконане',
    editTask: 'Редагувати завдання',
    deleteTask: 'Видалити завдання',
    editButton: 'Змінити',
    deleteButton: 'Видалити',
    overdue: 'Прострочено',
    due: 'До',
    today: 'сьогодні',
    tomorrow: 'завтра',
    yesterday: 'вчора',
    humidity: 'вологість',
    wind: 'вітер',
    weatherUnavailable: 'Погода недоступна — перевірте з\'єднання',
    weatherClearSky: 'Ясне небо',
    weatherMostlyClear: 'Переважно ясно',
    weatherPartlyCloudy: 'Мінлива хмарність',
    weatherOvercast: 'Похмуро',
    weatherFog: 'Туман',
    weatherRimeFog: 'Паморозевий туман',
    weatherLightDrizzle: 'Легка мряка',
    weatherDrizzle: 'Мряка',
    weatherDenseDrizzle: 'Густа мряка',
    weatherFreezingDrizzle: 'Крижана мряка',
    weatherFreezingDrizzleDense: 'Густа крижана мряка',
    weatherLightRain: 'Легкий дощ',
    weatherRain: 'Дощ',
    weatherHeavyRain: 'Сильний дощ',
    weatherFreezingRain: 'Крижаний дощ',
    weatherFreezingRainHeavy: 'Сильний крижаний дощ',
    weatherLightSnow: 'Легкий сніг',
    weatherSnow: 'Сніг',
    weatherHeavySnow: 'Сильний сніг',
    weatherSnowGrains: 'Сніжні зерна',
    weatherLightShowers: 'Легкі зливи',
    weatherRainShowers: 'Зливи',
    weatherHeavyShowers: 'Сильні зливи',
    weatherSnowShowers: 'Снігові зливи',
    weatherSnowShowersHeavy: 'Сильні снігові зливи',
    weatherThunderstorm: 'Гроза',
    weatherThunderstormHail: 'Гроза з градом'
  },
  zh: {
    subtitle: '组织任务，达成目标',
    taskPlaceholder: '新任务',
    priorityAria: '优先级',
    priorityHigh: '高',
    priorityMedium: '中',
    priorityLow: '低',
    dateAria: '截止日期',
    datePlaceholder: '日期',
    addTask: '添加',
    filterAll: '全部',
    filterCompleted: '已完成',
    filterPending: '待办',
    statTotal: '总计',
    statPending: '待办',
    statCompleted: '已完成',
    statRate: '未完成率',
    clearCompleted: '清除已完成',
    emptyNoTasksTitle: '暂无任务',
    emptyNoTasksText: '在上方添加第一个任务。',
    tipCtrlEnter: 'Ctrl+Enter 添加',
    tipDueDates: '设置截止日期',
    tipPriorities: '使用优先级',
    emptyNothingCompletedTitle: '暂无已完成',
    emptyNothingCompletedText: '完成任务后会显示在这里。',
    emptyAllCaughtUpTitle: '全部完成',
    emptyAllCaughtUpText: '没有待办任务。',
    emptyNoTasksHereTitle: '这里为空',
    emptyNoTasksHereText: '尝试添加新任务。',
    toastEnterTask: '请输入任务名称',
    toastTaskAdded: '任务已添加',
    toastTaskCompleted: '任务已完成',
    toastTaskPending: '任务已标记为待办',
    toastTaskUpdated: '任务已更新',
    toastTaskDeleted: '任务已删除',
    toastNoCompleted: '没有可清除的已完成任务',
    toastCompletedCleared: '已完成任务已清除',
    confirmDeleteHigh: '删除此高优先级任务？\\n\\n"{title}"',
    confirmDeleteCompleted: '删除 {count} 个已完成任务？',
    taskWordOne: '任务',
    taskWordMany: '任务',
    ariaMarkCompleted: '标记为已完成',
    ariaMarkPending: '标记为待办',
    editTask: '编辑任务',
    deleteTask: '删除任务',
    editButton: '编辑',
    deleteButton: '删除',
    overdue: '已逾期',
    due: '截止',
    today: '今天',
    tomorrow: '明天',
    yesterday: '昨天',
    humidity: '湿度',
    wind: '风速',
    weatherUnavailable: '天气不可用 — 请检查网络连接',
    weatherClearSky: '晴朗',
    weatherMostlyClear: '大部晴朗',
    weatherPartlyCloudy: '多云',
    weatherOvercast: '阴天',
    weatherFog: '雾',
    weatherRimeFog: '冻雾',
    weatherLightDrizzle: '小毛毛雨',
    weatherDrizzle: '毛毛雨',
    weatherDenseDrizzle: '密集毛毛雨',
    weatherFreezingDrizzle: '冻毛毛雨',
    weatherFreezingDrizzleDense: '密集冻毛毛雨',
    weatherLightRain: '小雨',
    weatherRain: '雨',
    weatherHeavyRain: '大雨',
    weatherFreezingRain: '冻雨',
    weatherFreezingRainHeavy: '强冻雨',
    weatherLightSnow: '小雪',
    weatherSnow: '雪',
    weatherHeavySnow: '大雪',
    weatherSnowGrains: '雪粒',
    weatherLightShowers: '小阵雨',
    weatherRainShowers: '阵雨',
    weatherHeavyShowers: '强阵雨',
    weatherSnowShowers: '阵雪',
    weatherSnowShowersHeavy: '强阵雪',
    weatherThunderstorm: '雷暴',
    weatherThunderstormHail: '雷暴伴冰雹'
  },
  ru: {
    subtitle: 'Организуйте задачи и достигайте целей',
    taskPlaceholder: 'Новая задача',
    priorityAria: 'Приоритет',
    priorityHigh: 'Высокий',
    priorityMedium: 'Средний',
    priorityLow: 'Низкий',
    dateAria: 'Срок',
    datePlaceholder: 'Дата',
    addTask: 'Добавить',
    filterAll: 'Все',
    filterCompleted: 'Выполненные',
    filterPending: 'В ожидании',
    statTotal: 'Всего',
    statPending: 'В ожидании',
    statCompleted: 'Выполнено',
    statRate: 'Не выполнено, %',
    clearCompleted: 'Очистить выполненные',
    emptyNoTasksTitle: 'Задач пока нет',
    emptyNoTasksText: 'Добавьте первую задачу выше.',
    tipCtrlEnter: 'Ctrl+Enter — добавить',
    tipDueDates: 'Указывайте сроки',
    tipPriorities: 'Используйте приоритеты',
    emptyNothingCompletedTitle: 'Выполненных пока нет',
    emptyNothingCompletedText: 'Выполните задачу — она появится здесь.',
    emptyAllCaughtUpTitle: 'Всё выполнено',
    emptyAllCaughtUpText: 'Нет задач в ожидании.',
    emptyNoTasksHereTitle: 'Здесь пусто',
    emptyNoTasksHereText: 'Попробуйте добавить новую задачу.',
    toastEnterTask: 'Введите название задачи',
    toastTaskAdded: 'Задача добавлена',
    toastTaskCompleted: 'Задача выполнена',
    toastTaskPending: 'Задача возвращена в ожидание',
    toastTaskUpdated: 'Задача обновлена',
    toastTaskDeleted: 'Задача удалена',
    toastNoCompleted: 'Нет выполненных для очистки',
    toastCompletedCleared: 'Выполненные задачи очищены',
    confirmDeleteHigh: 'Удалить задачу с высоким приоритетом?\\n\\n"{title}"',
    confirmDeleteCompleted: 'Удалить {count} выполненных задач?',
    taskWordOne: 'задача',
    taskWordMany: 'задач',
    ariaMarkCompleted: 'Отметить как выполненную',
    ariaMarkPending: 'Отметить как невыполненную',
    editTask: 'Редактировать задачу',
    deleteTask: 'Удалить задачу',
    editButton: 'Изменить',
    deleteButton: 'Удалить',
    overdue: 'Просрочено',
    due: 'До',
    today: 'сегодня',
    tomorrow: 'завтра',
    yesterday: 'вчера',
    humidity: 'влажность',
    wind: 'ветер',
    weatherUnavailable: 'Погода недоступна — проверьте соединение',
    weatherClearSky: 'Ясное небо',
    weatherMostlyClear: 'Преимущественно ясно',
    weatherPartlyCloudy: 'Переменная облачность',
    weatherOvercast: 'Пасмурно',
    weatherFog: 'Туман',
    weatherRimeFog: 'Изморозевый туман',
    weatherLightDrizzle: 'Лёгкая морось',
    weatherDrizzle: 'Морось',
    weatherDenseDrizzle: 'Густая морось',
    weatherFreezingDrizzle: 'Ледяная морось',
    weatherFreezingDrizzleDense: 'Густая ледяная морось',
    weatherLightRain: 'Небольшой дождь',
    weatherRain: 'Дождь',
    weatherHeavyRain: 'Сильный дождь',
    weatherFreezingRain: 'Ледяной дождь',
    weatherFreezingRainHeavy: 'Сильный ледяной дождь',
    weatherLightSnow: 'Небольшой снег',
    weatherSnow: 'Снег',
    weatherHeavySnow: 'Сильный снег',
    weatherSnowGrains: 'Снежные зёрна',
    weatherLightShowers: 'Небольшие ливни',
    weatherRainShowers: 'Ливни',
    weatherHeavyShowers: 'Сильные ливни',
    weatherSnowShowers: 'Снеговые ливни',
    weatherSnowShowersHeavy: 'Сильные снеговые ливни',
    weatherThunderstorm: 'Гроза',
    weatherThunderstormHail: 'Гроза с градом'
  },
  de: {
    subtitle: 'Organisieren Sie Aufgaben und erreichen Sie Ihre Ziele',
    taskPlaceholder: 'Neue Aufgabe',
    priorityAria: 'Priorität',
    priorityHigh: 'Hoch',
    priorityMedium: 'Mittel',
    priorityLow: 'Niedrig',
    dateAria: 'Fälligkeitsdatum',
    datePlaceholder: 'Datum',
    addTask: 'Hinzufügen',
    filterAll: 'Alle',
    filterCompleted: 'Erledigt',
    filterPending: 'Offen',
    statTotal: 'Gesamt',
    statPending: 'Offen',
    statCompleted: 'Erledigt',
    statRate: 'Offen in %',
    clearCompleted: 'Erledigte löschen',
    emptyNoTasksTitle: 'Noch keine Aufgaben',
    emptyNoTasksText: 'Fügen Sie oben Ihre erste Aufgabe hinzu.',
    tipCtrlEnter: 'Strg+Enter zum Hinzufügen',
    tipDueDates: 'Fälligkeiten setzen',
    tipPriorities: 'Prioritäten nutzen',
    emptyNothingCompletedTitle: 'Noch nichts erledigt',
    emptyNothingCompletedText: 'Erledigen Sie eine Aufgabe, dann erscheint sie hier.',
    emptyAllCaughtUpTitle: 'Alles erledigt',
    emptyAllCaughtUpText: 'Keine offenen Aufgaben.',
    emptyNoTasksHereTitle: 'Hier ist nichts',
    emptyNoTasksHereText: 'Versuchen Sie, eine neue Aufgabe hinzuzufügen.',
    toastEnterTask: 'Bitte Aufgabennamen eingeben',
    toastTaskAdded: 'Aufgabe hinzugefügt',
    toastTaskCompleted: 'Aufgabe erledigt',
    toastTaskPending: 'Aufgabe als offen markiert',
    toastTaskUpdated: 'Aufgabe aktualisiert',
    toastTaskDeleted: 'Aufgabe gelöscht',
    toastNoCompleted: 'Keine erledigten Aufgaben zum Löschen',
    toastCompletedCleared: 'Erledigte Aufgaben gelöscht',
    confirmDeleteHigh: 'Diese Aufgabe mit hoher Priorität löschen?\\n\\n"{title}"',
    confirmDeleteCompleted: '{count} erledigte Aufgabe(n) löschen?',
    taskWordOne: 'Aufgabe',
    taskWordMany: 'Aufgaben',
    ariaMarkCompleted: 'Als erledigt markieren',
    ariaMarkPending: 'Als offen markieren',
    editTask: 'Aufgabe bearbeiten',
    deleteTask: 'Aufgabe löschen',
    editButton: 'Bearbeiten',
    deleteButton: 'Löschen',
    overdue: 'Überfällig',
    due: 'Fällig',
    today: 'heute',
    tomorrow: 'morgen',
    yesterday: 'gestern',
    humidity: 'Luftfeuchtigkeit',
    wind: 'Wind',
    weatherUnavailable: 'Wetter nicht verfügbar — Verbindung prüfen',
    weatherClearSky: 'Klarer Himmel',
    weatherMostlyClear: 'Überwiegend klar',
    weatherPartlyCloudy: 'Teilweise bewölkt',
    weatherOvercast: 'Bewölkt',
    weatherFog: 'Nebel',
    weatherRimeFog: 'Reifnebel',
    weatherLightDrizzle: 'Leichter Nieselregen',
    weatherDrizzle: 'Nieselregen',
    weatherDenseDrizzle: 'Dichter Nieselregen',
    weatherFreezingDrizzle: 'Gefrierender Nieselregen',
    weatherFreezingDrizzleDense: 'Dichter gefrierender Nieselregen',
    weatherLightRain: 'Leichter Regen',
    weatherRain: 'Regen',
    weatherHeavyRain: 'Starker Regen',
    weatherFreezingRain: 'Gefrierender Regen',
    weatherFreezingRainHeavy: 'Starker gefrierender Regen',
    weatherLightSnow: 'Leichter Schnee',
    weatherSnow: 'Schnee',
    weatherHeavySnow: 'Starker Schnee',
    weatherSnowGrains: 'Schneegriesel',
    weatherLightShowers: 'Leichte Schauer',
    weatherRainShowers: 'Regenschauer',
    weatherHeavyShowers: 'Starke Schauer',
    weatherSnowShowers: 'Schneeschauer',
    weatherSnowShowersHeavy: 'Starke Schneeschauer',
    weatherThunderstorm: 'Gewitter',
    weatherThunderstormHail: 'Gewitter mit Hagel'
  }
};

function t(key) {
  const lang = localStorage.getItem('tm_lang') || 'en';
  const dict = I18N[lang] || I18N.en;
  return dict[key] ?? I18N.en[key] ?? key;
}

window.I18N = I18N;
window.t = t;

class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.filter = 'all';

        // DOM
        this.form = document.getElementById('taskForm');
        this.input = document.getElementById('taskInput');
        this.priority = document.getElementById('prioritySelect');
        this.due = document.getElementById('dueDateInput');
        this.dueWrap = document.querySelector('.date-wrap');
        this.duePlaceholder = document.getElementById('dueDatePlaceholder');
        this.list = document.getElementById('taskList');
        this.empty = document.getElementById('emptyState');
        this.emptyTitle = this.empty ? this.empty.querySelector('h3') : null;
        this.emptyText = this.empty ? this.empty.querySelector('p') : null;
        this.tips = this.empty ? this.empty.querySelector('.tips-container') : null;
        this.filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
        this.statTotal = document.getElementById('totalTasks');
        this.statPending = document.getElementById('pendingTasks');
        this.statCompleted = document.getElementById('completedTasks');
        this.statRate = document.getElementById('pendingPercentage');
        this.statLabels = Array.from(document.querySelectorAll('.stat-label'));
        this.clearBtn = document.getElementById('clearCompleted');
        this.addBtn = document.querySelector('.add-btn');
        this.clockTime = document.getElementById('clockTime');
        this.clockDate = document.getElementById('clockDate');
        this.langSelect = document.getElementById('langSelect');
        this.lang = localStorage.getItem('tm_lang') || 'en';
        if (this.langSelect) {
            this.langSelect.value = this.lang;
            this.langSelect.addEventListener('change', () => {
                this.lang = this.langSelect.value;
                localStorage.setItem('tm_lang', this.lang);
                document.documentElement.lang = this.lang;
                this.applyLanguage();
                this.updateClock();
            });
        }
        document.documentElement.lang = this.lang;

        this.bindEvents();
        this.applyLanguage();
        this.render();
        this.updateClock();
        window.setInterval(() => this.updateClock(), 1000);
    }

    /* ---------- language ---------- */

    applyLanguage() {
        const subtitle = document.querySelector('.subtitle');
        if (subtitle && !window.weatherApp?.weather) subtitle.textContent = t('subtitle');

        if (this.input) this.input.placeholder = t('taskPlaceholder');
        if (this.priority) {
            this.priority.setAttribute('aria-label', t('priorityAria'));
            Array.from(this.priority.options).forEach((opt) => {
                opt.textContent = t(`priority${opt.value.charAt(0).toUpperCase()}${opt.value.slice(1)}`);
            });
        }
        if (this.due) {
            this.due.setAttribute('aria-label', t('dateAria'));
            this.due.setAttribute('title', t('dateAria'));
            this.due.placeholder = t('dateAria');
            this.due.lang = this.lang;
        }
        if (this.duePlaceholder) this.duePlaceholder.textContent = t('datePlaceholder');
        this.updateDuePlaceholder();
        if (this.addBtn) this.addBtn.textContent = t('addTask');

        this.filterBtns.forEach((btn) => {
            const map = { all: 'filterAll', completed: 'filterCompleted', pending: 'filterPending' };
            btn.textContent = t(map[btn.dataset.filter]);
        });

        if (this.statLabels?.[0]) this.statLabels[0].textContent = t('statTotal');
        if (this.statLabels?.[1]) this.statLabels[1].textContent = t('statPending');
        if (this.statLabels?.[2]) this.statLabels[2].textContent = t('statCompleted');
        if (this.statLabels?.[3]) this.statLabels[3].textContent = t('statRate');
        if (this.clearBtn) this.clearBtn.textContent = t('clearCompleted');

        const tips = document.querySelectorAll('.tips-container span');
        if (tips[0]) tips[0].textContent = t('tipCtrlEnter');
        if (tips[1]) tips[1].textContent = t('tipDueDates');
        if (tips[2]) tips[2].textContent = t('tipPriorities');

        if (window.weatherApp?.renderSubtitle) window.weatherApp.renderSubtitle();

        this.render();
    }

    /* ---------- due date placeholder ---------- */

    updateDuePlaceholder() {
        if (!this.dueWrap) return;
        const hasValue = Boolean(this.due && this.due.value);
        this.dueWrap.classList.toggle('filled', hasValue);
        if (this.duePlaceholder) {
            this.duePlaceholder.textContent = hasValue ? '' : t('datePlaceholder');
        }
    }

    /* ---------- clock ---------- */

    updateClock() {
        const now = new Date();
        const locale = this.lang === 'uk' ? 'uk-UA'
            : this.lang === 'ru' ? 'ru-RU'
            : this.lang === 'de' ? 'de-DE'
            : this.lang === 'zh' ? 'zh-CN'
            : 'en-US';
        if (this.clockTime) {
            this.clockTime.textContent = now.toLocaleTimeString(locale, {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        if (this.clockDate) {
            this.clockDate.textContent = now.toLocaleDateString(locale, {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            });
        }
    }

    /* ---------- persistence ---------- */

    loadTasks() {
        for (const key of [STORAGE_KEY, 'tasks']) {
            try {
                const raw = localStorage.getItem(key);
                if (!raw) continue;
                const data = JSON.parse(raw);
                if (!Array.isArray(data)) continue;

                return data
                    .filter(item => item && typeof item === 'object' && typeof item.title === 'string')
                    .map(item => ({
                        id: String(item.id || makeId()),
                        title: String(item.title).slice(0, 500),
                        priority: ['high', 'medium', 'low'].includes(item.priority) ? item.priority : 'medium',
                        dueDate: typeof item.dueDate === 'string' ? item.dueDate.slice(0, 10) : '',
                        completed: Boolean(item.completed),
                        createdAt: item.createdAt || new Date().toISOString()
                    }));
            } catch (err) {
                console.warn(`Could not read saved tasks from "${key}":`, err);
            }
        }
        return [];
    }

    save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
        } catch (err) {
            console.warn('Could not save tasks:', err);
        }
    }

    /* ---------- events ---------- */

    bindEvents() {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.addTask();
        });

        // Ctrl/Cmd + Enter adds a task from anywhere
        document.addEventListener('keydown', (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault();
                this.addTask();
            }
        });

        this.filterBtns.forEach((btn) => {
            btn.addEventListener('click', () => this.setFilter(btn.dataset.filter || 'all'));
        });

        // Event delegation for dynamically rendered tasks
        this.list.addEventListener('change', (event) => {
            if (!event.target.classList.contains('task-checkbox')) return;
            const item = event.target.closest('.task-item');
            if (item) this.toggleTask(item.dataset.id);
        });

        this.list.addEventListener('click', (event) => {
            const actionBtn = event.target.closest('[data-action]');
            if (!actionBtn) return;
            const item = event.target.closest('.task-item');
            if (!item) return;

            if (actionBtn.dataset.action === 'edit') this.editTask(item.dataset.id);
            if (actionBtn.dataset.action === 'delete') this.deleteTask(item.dataset.id);
        });

        if (this.due) {
            this.due.addEventListener('change', () => this.updateDuePlaceholder());
            this.due.addEventListener('input', () => this.updateDuePlaceholder());
        }

        this.clearBtn.addEventListener('click', () => this.clearCompleted());
    }

    /* ---------- CRUD ---------- */

    addTask() {
        const title = this.input.value.trim();

        if (!title) {
            this.toast(t('toastEnterTask'), 'error');
            this.input.focus();
            return;
        }

        this.tasks.unshift({
            id: makeId(),
            title,
            priority: this.priority.value,
            dueDate: this.due.value,
            completed: false,
            createdAt: new Date().toISOString()
        });

        this.save();

        // A new task is pending, so make sure it is visible
        if (this.filter === 'completed') this.setFilter('all');

        this.input.value = '';
        this.due.value = '';
        this.updateDuePlaceholder();
        this.input.focus();

        this.render();
        this.toast(t('toastTaskAdded'), 'success');
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        task.completed = !task.completed;
        this.save();
        this.render();

        this.toast(
            task.completed ? t('toastTaskCompleted') : t('toastTaskPending'),
            task.completed ? 'success' : 'error'
        );
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        const next = window.prompt(t('editTask') + ':', task.title);
        if (next === null) return;

        const title = next.trim();
        if (!title || title === task.title) return;

        task.title = title;
        this.save();
        this.render();
        this.toast(t('toastTaskUpdated'), 'success');
    }

    deleteTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        if (task.priority === 'high' &&
            !window.confirm(t('confirmDeleteHigh').replace('{title}', task.title))) {
            return;
        }

        const item = this.list.querySelector(`.task-item[data-id="${CSS.escape(id)}"]`);
        const finish = () => {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.save();
            this.render();
            this.toast(t('toastTaskDeleted'), 'success');
        };

        if (!item) {
            finish();
            return;
        }

        item.classList.add('removing');
        window.setTimeout(finish, 320);
    }

    clearCompleted() {
        const completed = this.tasks.filter(t => t.completed);
        if (completed.length === 0) {
            this.toast(t('toastNoCompleted'), 'error');
            return;
        }

        const word = completed.length === 1 ? t('taskWordOne') : t('taskWordMany');
        if (!window.confirm(t('confirmDeleteCompleted').replace('{count}', completed.length))) return;

        this.tasks = this.tasks.filter(task => !task.completed);
        this.save();
        this.render();
        this.toast(t('toastCompletedCleared'), 'success');
    }

    /* ---------- filtering ---------- */

    setFilter(filter) {
        this.filter = ['all', 'completed', 'pending'].includes(filter) ? filter : 'all';

        this.filterBtns.forEach((btn) => {
            const active = btn.dataset.filter === this.filter;
            btn.classList.toggle('active', active);
            btn.setAttribute('aria-pressed', String(active));
        });

        this.render();
    }

    visibleTasks() {
        if (this.filter === 'completed') return this.tasks.filter(t => t.completed);
        if (this.filter === 'pending') return this.tasks.filter(t => !t.completed);
        return this.tasks;
    }

    /* ---------- rendering ---------- */

    render() {
        const visible = this.visibleTasks();

        this.list.innerHTML = '';
        const fragment = document.createDocumentFragment();

        visible.forEach((task, index) => {
            const item = this.createTaskElement(task);
            // tiny stagger, capped so long lists do not feel slow
            item.style.animationDelay = `${Math.min(index, 12) * 0.03}s`;
            fragment.appendChild(item);
        });

        this.list.appendChild(fragment);
        this.updateEmptyState(visible.length);
        this.updateStats();
    }

    createTaskElement(task) {
        const item = document.createElement('div');
        item.className = `task-item priority-${task.priority}${task.completed ? ' completed' : ''}`;
        item.dataset.id = task.id;

        const due = this.describeDue(task);

        item.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}
                   aria-label="${task.completed ? t('ariaMarkPending') : t('ariaMarkCompleted')}">
            <span class="priority-badge pri-${task.priority}">${priorityLabel(task.priority)}</span>
            <div class="task-content">
                <h3 class="task-title">${this.escape(task.title)}</h3>
                ${due ? `
                    <div class="task-meta">
                        <span class="due-chip${due.overdue ? ' overdue' : ''}">${due.label}</span>
                    </div>` : ''}
            </div>
            <div class="task-actions">
                <button type="button" class="action-btn" data-action="edit" title="${t('editTask')}" aria-label="${t('editTask')}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                    </svg>
                    <span>${t('editButton')}</span>
                </button>
                <button type="button" class="action-btn danger" data-action="delete" title="${t('deleteTask')}" aria-label="${t('deleteTask')}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M3 6h18"></path>
                        <path d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6"></path>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                        <path d="M10 11v5M14 11v5"></path>
                    </svg>
                    <span>${t('deleteButton')}</span>
                </button>
            </div>
        `;

        return item;
    }

    updateEmptyState(visibleCount) {
        if (!this.empty) return;

        const isEmpty = visibleCount === 0;
        this.empty.style.display = isEmpty ? 'block' : 'none';
        if (!isEmpty) return;

        if (this.tasks.length === 0) {
            if (this.emptyTitle) this.emptyTitle.textContent = t('emptyNoTasksTitle');
            if (this.emptyText) this.emptyText.textContent = t('emptyNoTasksText');
            if (this.tips) this.tips.hidden = false;
        } else if (this.filter === 'completed') {
            if (this.emptyTitle) this.emptyTitle.textContent = t('emptyNothingCompletedTitle');
            if (this.emptyText) this.emptyText.textContent = t('emptyNothingCompletedText');
            if (this.tips) this.tips.hidden = true;
        } else if (this.filter === 'pending') {
            if (this.emptyTitle) this.emptyTitle.textContent = t('emptyAllCaughtUpTitle');
            if (this.emptyText) this.emptyText.textContent = t('emptyAllCaughtUpText');
            if (this.tips) this.tips.hidden = true;
        } else {
            if (this.emptyTitle) this.emptyTitle.textContent = t('emptyNoTasksHereTitle');
            if (this.emptyText) this.emptyText.textContent = t('emptyNoTasksHereText');
            if (this.tips) this.tips.hidden = true;
        }
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const rate = total > 0 ? Math.round((pending / total) * 100) : 0;

        if (this.statTotal) this.statTotal.textContent = total;
        if (this.statPending) this.statPending.textContent = pending;
        if (this.statCompleted) this.statCompleted.textContent = completed;
        if (this.statRate) this.statRate.textContent = `${rate}%`;
        if (this.clearBtn) this.clearBtn.hidden = completed === 0;
    }

    describeDue(task) {
        if (!task.dueDate) return null;

        const date = new Date(`${task.dueDate}T00:00:00`);
        if (Number.isNaN(date.getTime())) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const locale = this.lang === 'uk' ? 'uk-UA'
            : this.lang === 'ru' ? 'ru-RU'
            : this.lang === 'de' ? 'de-DE'
            : this.lang === 'zh' ? 'zh-CN'
            : 'en-GB';

        const diffDays = Math.round((date - today) / 86400000);
        const overdue = diffDays < 0 && !task.completed;

        let base;
        if (diffDays === 0) base = t('today');
        else if (diffDays === 1) base = t('tomorrow');
        else if (diffDays === -1 && task.completed) base = t('yesterday');
        else {
            const sameYear = date.getFullYear() === today.getFullYear();
            base = date.toLocaleDateString(locale, {
                day: 'numeric',
                month: 'short',
                ...(sameYear ? {} : { year: 'numeric' })
            });
        }

        let label;
        if (overdue) label = `${t('overdue')} · ${base}`;
        else if (task.completed) label = base.charAt(0).toUpperCase() + base.slice(1);
        else label = `${t('due')} ${base}`;

        return { label, overdue };
    }

    /* ---------- helpers ---------- */

    escape(value) {
        return String(value).replace(/[&<>"']/g, (char) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char]));
    }

    toast(message, type = 'success') {
        // only one toast at a time
        document.querySelectorAll('.toast').forEach(t => t.remove());

        const el = document.createElement('div');
        el.className = `toast ${type}`;
        el.setAttribute('role', 'status');
        el.textContent = message;
        document.body.appendChild(el);

        requestAnimationFrame(() => el.classList.add('show'));

        window.setTimeout(() => {
            el.classList.remove('show');
            window.setTimeout(() => el.remove(), 320);
        }, 2600);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.taskApp) {
        window.taskApp = new TaskManager();
    }
});

window.livelyPropertyListener = function(name, val) {
    if (name !== 'zoom') return;
    const scale = Math.max(0.5, Math.min(2, Number(val) || 1));
    const container = document.querySelector('.container');
    if (container) {
        container.style.transformOrigin = 'top center';
        container.style.transform = `scale(${scale})`;
    }
    try { localStorage.setItem('tm_zoom', String(scale)); } catch (e) {}
};

(function applySavedZoom() {
    try {
        const saved = localStorage.getItem('tm_zoom');
        if (saved) window.livelyPropertyListener('zoom', saved);
    } catch (e) {}
})();
