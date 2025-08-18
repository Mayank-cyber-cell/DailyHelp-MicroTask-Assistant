

// Initialize data from localStorage or create empty arrays
let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let steps = JSON.parse(localStorage.getItem('steps')) || 0;
let bmiData = JSON.parse(localStorage.getItem('bmiData')) || null;
let isDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
let currentFilter = 'all';
let currentSort = 'date';
let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
let tourStep = 0;
let isToggleBarVisible = true;

// Tour steps
const tourSteps = [
    {
        element: '#toggleBar',
        title: 'Settings Panel',
        description: 'Access dark mode, settings, fullscreen, and help from this convenient side panel.'
    },
    {
        element: '#fabButton',
        title: 'Quick Actions',
        description: 'Use this floating button to quickly add reminders, expenses, or notes.'
    },
    {
        element: '#reminders',
        title: 'Smart Reminders',
        description: 'Set up reminders with different priorities and repeat options.'
    },
    {
        element: '#expenses',
        title: 'Expense Tracking',
        description: 'Track your spending by category and monitor your budget.'
    },
    {
        element: '#health',
        title: 'Health Monitoring',
        description: 'Calculate your BMI and track your daily steps.'
    }
];

// DOM Elements
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const fabButton = document.getElementById('fabButton');
const fabMenu = document.getElementById('fabMenu');
const loadingScreen = document.getElementById('loadingScreen');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const closeToast = document.getElementById('closeToast');
const currentDate = document.getElementById('currentDate');
const reminderCount = document.getElementById('reminderCount');
const totalExpensesQuick = document.getElementById('totalExpensesQuick');
const stepsCountQuick = document.getElementById('stepsCountQuick');
const stepsPercentage = document.getElementById('stepsPercentage');
const newTipButton = document.getElementById('newTipButton');
const dailyTip = document.getElementById('dailyTip');
const notificationBell = document.getElementById('notificationBell');
const notificationPanel = document.getElementById('notificationPanel');
const notificationBadge = document.getElementById('notificationBadge');
const closeNotifications = document.getElementById('closeNotifications');
const userProfile = document.getElementById('userProfile');
const helpToggle = document.getElementById('helpToggle');
const helpPanel = document.getElementById('helpPanel');
const closeHelp = document.getElementById('closeHelp');
const tourButton = document.getElementById('tourButton');
const tourOverlay = document.getElementById('tourOverlay');
const skipTour = document.getElementById('skipTour');
const nextTour = document.getElementById('nextTour');
const reminderForm = document.getElementById('reminderForm');
const remindersList = document.getElementById('remindersList');
const noRemindersText = document.getElementById('noRemindersText');
const sortReminders = document.getElementById('sortReminders');
const filterReminders = document.getElementById('filterReminders');
const expenseForm = document.getElementById('expenseForm');
const totalExpenses = document.getElementById('totalExpenses');
const expenseBreakdown = document.getElementById('expenseBreakdown');
const exportExpenses = document.getElementById('exportExpenses');
const bmiForm = document.getElementById('bmiForm');
const bmiResult = document.getElementById('bmiResult');
const bmiValue = document.getElementById('bmiValue');
const bmiCategory = document.getElementById('bmiCategory');
const stepsForm = document.getElementById('stepsForm');
const currentSteps = document.getElementById('currentSteps');
const goalSteps = document.getElementById('goalSteps');
const stepsProgress = document.getElementById('stepsProgress');
const noteForm = document.getElementById('noteForm');
const notesList = document.getElementById('notesList');
const searchNotes = document.getElementById('searchNotes');
const sortNotes = document.getElementById('sortNotes');
const darkModeToggleMain = document.getElementById('darkModeToggleMain');
const settingsToggle = document.getElementById('settingsToggle');
const fullscreenToggle = document.getElementById('fullscreenToggle');
const toggleBar = document.getElementById('toggleBar');

// Daily tips array
const dailyTips = [
    "Start your day with a glass of water and 5 minutes of deep breathing to boost your energy and focus.",
    "Take a 10-minute walk after meals to improve digestion and maintain steady energy levels.",
    "Practice the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.",
    "Keep a gratitude journal and write down 3 things you're thankful for each day.",
    "Set your phone to 'Do Not Disturb' mode 1 hour before bedtime for better sleep quality.",
    "Try meal prepping on Sundays to save time and eat healthier throughout the week.",
    "Use the Pomodoro Technique: Work for 25 minutes, then take a 5-minute break.",
    "Stretch for 5 minutes every morning to improve flexibility and reduce stiffness.",
    "Keep healthy snacks like nuts or fruits within easy reach to avoid junk food.",
    "Practice mindful breathing for 2 minutes when you feel stressed or overwhelmed."
];

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    // Show loading screen
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transform = 'scale(0.95)';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 300);
    }, 1200);

    // Initialize the app
    initializeApp();
    renderReminders();
    renderExpenses();
    renderNotes();
    updateStepsDisplay();
    updateBmiDisplay();
    updateQuickStats();
    updateCurrentDate();
    setRandomDailyTip();

    // Set up intersection observer for section animations
    setupIntersectionObserver();

    // Smooth scroll for anchor links
    setupSmoothScroll();
    
    // Set up scroll progress indicator
    setupScrollProgress();
    
    // Apply dark mode if enabled
    if (isDarkMode) {
        document.body.classList.add('dark');
        darkModeToggle.innerHTML = '<i class="fas fa-sun text-lg"></i>';
    }
    
    // Initialize toggle bar animations
    initializeToggleBar();
});

hamburger.addEventListener('click', function () {
    const isActive = mobileMenu.classList.contains('active');
    if (isActive) {
        mobileMenu.classList.remove('active');
        mobileMenu.classList.add('hidden');
    } else {
        mobileMenu.classList.add('active');
        mobileMenu.classList.remove('hidden');
    }
});

// Notification bell
notificationBell.addEventListener('click', function () {
    const isVisible = !notificationPanel.classList.contains('translate-x-full');
    if (isVisible) {
        notificationPanel.classList.add('translate-x-full');
    } else {
        notificationPanel.classList.remove('translate-x-full');
        updateNotificationBadge();
    }
});

// Close notifications
closeNotifications.addEventListener('click', function () {
    notificationPanel.classList.add('translate-x-full');
});

// User profile
userProfile.addEventListener('click', function () {
    showToast('Profile settings coming soon!', 'info');
});

// Help toggle
helpToggle.addEventListener('click', function () {
    helpPanel.classList.remove('hidden');
    this.style.transform = 'scale(1.2)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 200);
});

// Close help
closeHelp.addEventListener('click', function () {
    helpPanel.classList.add('hidden');
});

// Tour functionality
tourButton.addEventListener('click', function () {
    startTour();
});

skipTour.addEventListener('click', function () {
    endTour();
});

nextTour.addEventListener('click', function () {
    nextTourStep();
});

// Dark mode toggle (main)
darkModeToggleMain.addEventListener('click', function () {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark');
    
    // Add transition effect
    document.body.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    
    if (isDarkMode) {
        this.innerHTML = '<i class="fas fa-sun text-lg"></i>';
        this.style.color = '#fbbf24';
    } else {
        this.innerHTML = '<i class="fas fa-moon text-lg"></i>';
        this.style.color = '#6b7280';
    }
    
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    showToast(`${isDarkMode ? 'Dark' : 'Light'} mode activated!`, 'success');
    
    // Add animation effect
    this.style.transform = 'scale(1.2)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 200);
});

// Settings toggle
settingsToggle.addEventListener('click', function () {
    showToast('⚙️ Advanced settings coming soon!', 'info');
    this.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        this.style.transform = 'rotate(0deg)';
    }, 300);
});

// Fullscreen toggle
fullscreenToggle.addEventListener('click', function () {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            this.innerHTML = '<i class="fas fa-compress text-lg"></i>';
            showToast('Entered fullscreen mode', 'success');
        });
    } else {
        document.exitFullscreen().then(() => {
            this.innerHTML = '<i class="fas fa-expand text-lg"></i>';
            showToast('Exited fullscreen mode', 'info');
        });
    }
    
    // Animation effect
    this.style.transform = 'scale(1.2)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 200);
});

// Toggle bar visibility on scroll
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
        toggleBar.style.transform = 'translateX(-100%)';
    } else {
        toggleBar.style.transform = 'translateX(0)';
    }
    lastScrollY = window.scrollY;
});

// FAB functionality
fabButton.addEventListener('click', function () {
    fabMenu.classList.toggle('active');
    
    // Rotate FAB button
    if (fabMenu.classList.contains('active')) {
        this.style.transform = 'rotate(45deg)';
    } else {
        this.style.transform = 'rotate(0deg)';
    }
});

// FAB menu items
document.querySelectorAll('.fab-item').forEach(item => {
    item.addEventListener('click', function () {
        const action = this.getAttribute('data-action');
        fabMenu.classList.remove('active');
        
        switch (action) {
            case 'reminder':
                document.getElementById('reminders').scrollIntoView({ behavior: 'smooth' });
                document.getElementById('taskName').focus();
                break;
            case 'expense':
                document.getElementById('expenses').scrollIntoView({ behavior: 'smooth' });
                document.getElementById('expenseAmount').focus();
                break;
            case 'note':
                document.getElementById('notes').scrollIntoView({ behavior: 'smooth' });
                document.getElementById('noteContent').focus();
                break;
        }
    });
});

// New tip button
newTipButton.addEventListener('click', function () {
    setRandomDailyTip();
    showToast('✨ New tip loaded!', 'success');
    
    // Add rotation animation
    const icon = this.querySelector('i');
    icon.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        icon.style.transform = 'rotate(0deg)';
    }, 500);
});

// Toast close button
closeToast.addEventListener('click', function () {
    hideToast();
});

// Reminders functionality
reminderForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const taskName = document.getElementById('taskName').value;
    const taskTime = document.getElementById('taskTime').value;
    const taskPriority = document.getElementById('taskPriority').value;
    const repeat = document.querySelector('input[name="repeat"]:checked').value;

    const reminder = {
        id: Date.now(),
        taskName,
        taskTime,
        priority: taskPriority,
        repeat,
        completed: false,
        createdAt: new Date().toISOString(),
        notified: false
    };

    reminders.push(reminder);
    saveReminders();
    renderReminders();
    updateQuickStats();
    addNotification('Reminder Added', `"${taskName}" has been scheduled for ${formatTime(taskTime)}`);

    // Reset form
    reminderForm.reset();
    showToast('✅ Reminder added successfully!', 'success');
    
    // Add success animation
    addSuccessAnimation(reminderForm);
});

// Sort reminders
sortReminders.addEventListener('click', function () {
    currentSort = currentSort === 'date' ? 'priority' : currentSort === 'priority' ? 'name' : 'date';
    renderReminders();
    showToast(`Sorted by ${currentSort}`, 'info');
});

// Filter reminders
filterReminders.addEventListener('click', function () {
    const filters = ['all', 'high', 'medium', 'low'];
    const currentIndex = filters.indexOf(currentFilter);
    currentFilter = filters[(currentIndex + 1) % filters.length];
    renderReminders();
    showToast(`Filtered by ${currentFilter} priority`, 'info');
});

// Expenses functionality
expenseForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;
    const description = document.getElementById('expenseDescription').value;

    const expense = {
        id: Date.now(),
        amount,
        category,
        description,
        date: new Date().toISOString()
    };

    expenses.push(expense);
    saveExpenses();
    renderExpenses();
    updateQuickStats();
    addNotification('Expense Added', `$${amount.toFixed(2)} spent on ${category}`);

    // Reset form
    expenseForm.reset();
    showToast('💰 Expense added successfully!', 'success');
    
    // Add success animation
    addSuccessAnimation(expenseForm);
});

// Export expenses
exportExpenses.addEventListener('click', function () {
    exportExpensesToCSV();
    showToast('📊 Expenses exported successfully!', 'success');
});

// BMI Calculator functionality
bmiForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const height = parseFloat(document.getElementById('height').value) / 100; // convert to meters
    const weight = parseFloat(document.getElementById('weight').value);

    const bmi = weight / (height * height);

    bmiData = {
        bmi: bmi.toFixed(1),
        category: getBmiCategory(bmi)
    };

    saveBmiData();
    updateBmiDisplay();

    // Show result
    bmiResult.classList.remove('hidden');
    showToast('📏 BMI calculated successfully!', 'success');
    
    // Add success animation
    addSuccessAnimation(bmiForm);
});

// Steps Tracker functionality
stepsForm.addEventListener('submit', function (e) {
    e.preventDefault();

    steps = parseInt(document.getElementById('steps').value);
    saveSteps();
    updateStepsDisplay();
    updateQuickStats();

    // Reset form
    stepsForm.reset();
    showToast('👟 Steps updated successfully!', 'success');
    
    // Add success animation
    addSuccessAnimation(stepsForm);
});

// Notes functionality
noteForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const content = document.getElementById('noteContent').value;
    const title = document.getElementById('noteTitle').value;
    const category = document.getElementById('noteCategory').value;

    const note = {
        id: Date.now(),
        title: title || 'Untitled Note',
        content,
        category,
        date: new Date().toISOString()
    };

    notes.push(note);
    saveNotes();
    renderNotes();
    addNotification('Note Saved', `"${note.title}" has been saved`);

    // Reset form
    noteForm.reset();
    showToast('📝 Note saved successfully!', 'success');
    
    // Add success animation
    addSuccessAnimation(noteForm);
});

// Search notes
searchNotes.addEventListener('click', function () {
    const searchTerm = prompt('Enter search term:');
    if (searchTerm) {
        searchNotesFunction(searchTerm);
    }
});

// Sort notes
sortNotes.addEventListener('click', function () {
    const sortOptions = ['date', 'title', 'category'];
    const currentIndex = sortOptions.indexOf(currentSort);
    currentSort = sortOptions[(currentIndex + 1) % sortOptions.length];
    renderNotes();
    showToast(`Sorted by ${currentSort}`, 'info');
});

// Helper functions
function initializeApp() {
    // Set up any initial configurations
    initializeAnimations();
    console.log('DailyHelp initialized successfully!');
}

function initializeAnimations() {
    // Add stagger animation to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add stagger animation to tip cards
    const tipCards = document.querySelectorAll('.tip-card');
    tipCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

function initializeToggleBar() {
    // Add hover effects to toggle buttons
    const toggleButtons = [darkModeToggleMain, settingsToggle, fullscreenToggle, helpToggle];
    
    toggleButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Show toggle bar with animation
    setTimeout(() => {
        toggleBar.style.opacity = '1';
        toggleBar.style.transform = 'translateX(0)';
    }, 1000);
}

function addSuccessAnimation(element) {
    element.style.transform = 'scale(1.02)';
    element.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.3)';
    
    setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.boxShadow = '';
    }, 300);
}

function updateCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    currentDate.textContent = now.toLocaleDateString('en-US', options);
}

function updateQuickStats() {
    reminderCount.textContent = reminders.length;
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalExpensesQuick.textContent = total.toFixed(2);
    stepsCountQuick.textContent = steps.toLocaleString();
    updateNotificationBadge();
}

function updateNotificationBadge() {
    const unreadCount = notifications.filter(n => !n.read).length;
    if (unreadCount > 0) {
        notificationBadge.textContent = unreadCount;
        notificationBadge.classList.remove('hidden');
    } else {
        notificationBadge.classList.add('hidden');
    }
}

function addNotification(title, message) {
    const notification = {
        id: Date.now(),
        title,
        message,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    notifications.unshift(notification);
    if (notifications.length > 50) {
        notifications = notifications.slice(0, 50);
    }
    
    saveNotifications();
    updateNotificationBadge();
    renderNotifications();
}

function renderNotifications() {
    const notificationList = document.getElementById('notificationList');
    
    if (notifications.length === 0) {
        notificationList.innerHTML = `
            <div class="p-4 text-center text-gray-500">
                <i class="fas fa-bell-slash text-2xl mb-2"></i>
                <p>No notifications yet</p>
            </div>
        `;
        return;
    }
    
    notificationList.innerHTML = notifications.slice(0, 10).map(notification => `
        <div class="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h4 class="font-medium text-gray-800 text-sm">${notification.title}</h4>
                    <p class="text-gray-600 text-xs mt-1">${notification.message}</p>
                    <p class="text-gray-400 text-xs mt-1">${formatDate(notification.timestamp)}</p>
                </div>
                ${!notification.read ? '<div class="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>' : ''}
            </div>
        </div>
    `).join('');
}

function startTour() {
    tourStep = 0;
    tourOverlay.classList.remove('hidden');
    showTourStep();
}

function showTourStep() {
    if (tourStep >= tourSteps.length) {
        endTour();
        return;
    }
    
    const step = tourSteps[tourStep];
    const element = document.querySelector(step.element);
    
    if (element) {
        const rect = element.getBoundingClientRect();
        const spotlight = document.getElementById('tourSpotlight');
        const tooltip = document.getElementById('tourTooltip');
        
        spotlight.style.left = `${rect.left - 10}px`;
        spotlight.style.top = `${rect.top - 10}px`;
        spotlight.style.width = `${rect.width + 20}px`;
        spotlight.style.height = `${rect.height + 20}px`;
        
        tooltip.style.left = `${rect.right + 20}px`;
        tooltip.style.top = `${rect.top}px`;
        
        document.getElementById('tourTitle').textContent = step.title;
        document.getElementById('tourDescription').textContent = step.description;
        
        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function nextTourStep() {
    tourStep++;
    showTourStep();
}

function endTour() {
    tourOverlay.classList.add('hidden');
    tourStep = 0;
    showToast('🎉 Tour completed! You\'re ready to use DailyHelp!', 'success');
}

function setRandomDailyTip() {
    const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];
    dailyTip.textContent = randomTip;
}

function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = `fixed top-20 right-4 bg-white shadow-lg rounded-lg p-4 transform transition-all duration-500 z-50 border-l-4 toast-${type}`;
    toast.style.transform = 'translateX(0) scale(1)';
    toast.style.opacity = '1';
    
    // Add entrance animation
    toast.style.animation = 'slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        hideToast();
    }, 4000);
}

function hideToast() {
    toast.style.transform = 'translateX(100%) scale(0.95)';
    toast.style.opacity = '0';
}

function renderReminders() {
    let filteredReminders = reminders;
    
    // Apply filter
    if (currentFilter !== 'all') {
        filteredReminders = reminders.filter(reminder => reminder.priority === currentFilter);
    }
    
    // Apply sort
    filteredReminders.sort((a, b) => {
        switch (currentSort) {
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            case 'name':
                return a.taskName.localeCompare(b.taskName);
            case 'date':
            default:
                return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });
    
    if (filteredReminders.length === 0) {
        noRemindersText.style.display = 'block';
        remindersList.innerHTML = '';
        return;
    }

    noRemindersText.style.display = 'none';
    remindersList.innerHTML = '';

    filteredReminders.forEach(reminder => {
        const reminderElement = document.createElement('div');
        reminderElement.className = `reminder-item p-6 rounded-xl flex justify-between items-center mb-4 priority-${reminder.priority} shadow-md hover:shadow-lg transition-all duration-300`;
        reminderElement.innerHTML = `
            <div class="flex-1">
                <div class="flex items-center mb-2">
                    <h4 class="font-semibold text-gray-800 text-lg">${reminder.taskName}</h4>
                    <span class="ml-3 px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(reminder.priority)}">${reminder.priority.toUpperCase()}</span>
                </div>
                <div class="flex items-center text-sm text-gray-600 space-x-4">
                    <span><i class="far fa-clock mr-1"></i> ${formatTime(reminder.taskTime)}</span>
                    ${reminder.repeat !== 'no' ? `<span><i class="fas fa-redo mr-1"></i> ${reminder.repeat}</span>` : ''}
                    <span><i class="fas fa-calendar mr-1"></i> ${formatDate(reminder.createdAt)}</span>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button class="complete-reminder p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-300" data-id="${reminder.id}">
                    <i class="fas fa-check"></i>
                </button>
                <button class="delete-reminder p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300" data-id="${reminder.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        remindersList.appendChild(reminderElement);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-reminder').forEach(button => {
        button.addEventListener('click', function () {
            const id = parseInt(this.getAttribute('data-id'));
            deleteReminder(id);
        });
    });
    
    // Add event listeners to complete buttons
    document.querySelectorAll('.complete-reminder').forEach(button => {
        button.addEventListener('click', function () {
            const id = parseInt(this.getAttribute('data-id'));
            completeReminder(id);
        });
    });
}

function getPriorityColor(priority) {
    switch (priority) {
        case 'high': return 'bg-red-100 text-red-800';
        case 'medium': return 'bg-yellow-100 text-yellow-800';
        case 'low': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function renderExpenses() {
    // Calculate total expenses
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalExpenses.textContent = `$${total.toFixed(2)}`;

    // Group expenses by category
    const categories = {};
    expenses.forEach(expense => {
        if (!categories[expense.category]) {
            categories[expense.category] = 0;
        }
        categories[expense.category] += expense.amount;
    });

    // Render breakdown
    if (Object.keys(categories).length === 0) {
        expenseBreakdown.innerHTML = `
            <div class="text-center py-12">
                <div class="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-chart-pie text-gray-400 text-2xl"></i>
                </div>
                <p class="text-gray-500 text-lg mb-2">No expenses yet</p>
                <p class="text-gray-400 text-sm">Add your first expense to see the breakdown.</p>
            </div>
        `;
        return;
    }

    expenseBreakdown.innerHTML = '';

    for (const category in categories) {
        const percentage = (categories[category] / total) * 100;
        const categoryExpenses = expenses.filter(expense => expense.category === category);

        const categoryElement = document.createElement('div');
        categoryElement.className = 'expense-item';
        categoryElement.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <div class="flex items-center">
                    <div class="w-4 h-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mr-3"></div>
                    <span class="font-semibold text-gray-800">${category}</span>
                </div>
                <div class="text-right">
                    <p class="font-bold text-blue-600">$${categories[category].toFixed(2)}</p>
                    <p class="text-sm text-gray-500">${percentage.toFixed(1)}%</p>
                </div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div class="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
            </div>
            <p class="text-xs text-gray-500">${categoryExpenses.length} transaction${categoryExpenses.length !== 1 ? 's' : ''}</p>
        `;

        expenseBreakdown.appendChild(categoryElement);
    }
}

function exportExpensesToCSV() {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "Date,Category,Amount,Description\n"
        + expenses.map(expense => 
            `${new Date(expense.date).toLocaleDateString()},${expense.category},${expense.amount},"${expense.description || ''}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function renderNotes() {
    let sortedNotes = [...notes];
    
    // Apply sort
    sortedNotes.sort((a, b) => {
        switch (currentSort) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'category':
                return a.category.localeCompare(b.category);
            case 'date':
            default:
                return new Date(b.date) - new Date(a.date);
        }
    });
    
    if (sortedNotes.length === 0) {
        notesList.innerHTML = `
            <div class="text-center py-12 col-span-2">
                <div class="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-sticky-note text-gray-400 text-2xl"></i>
                </div>
                <p class="text-gray-500 text-lg mb-2">No notes yet</p>
                <p class="text-gray-400 text-sm">Create your first note above to get started!</p>
            </div>
        `;
        return;
    }

    notesList.innerHTML = '';

    sortedNotes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-yellow-100';
        noteElement.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-800 text-lg mb-2">${note.title}</h4>
                    <span class="category-badge">${getCategoryIcon(note.category)} ${note.category}</span>
                </div>
                <button class="delete-note p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300" data-id="${note.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <p class="text-gray-700 mb-4 leading-relaxed">${note.content}</p>
            <div class="flex justify-between items-center text-xs text-gray-500">
                <span><i class="fas fa-calendar mr-1"></i> ${formatDate(note.date)}</span>
                <span>${note.content.length} characters</span>
            </div>
        `;

        notesList.appendChild(noteElement);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-note').forEach(button => {
        button.addEventListener('click', function () {
            const id = parseInt(this.getAttribute('data-id'));
            deleteNote(id);
        });
    });
}

function getCategoryIcon(category) {
    const icons = {
        general: '📝',
        work: '💼',
        personal: '👤',
        ideas: '💡',
        shopping: '🛒',
        goals: '🎯'
    };
    return icons[category] || '📝';
}

function searchNotesFunction(searchTerm) {
    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filteredNotes.length === 0) {
        showToast('No notes found matching your search.', 'warning');
        return;
    }
    
    // Temporarily render filtered notes
    const originalNotes = [...notes];
    notes = filteredNotes;
    renderNotes();
    
    // Restore original notes after 5 seconds
    setTimeout(() => {
        notes = originalNotes;
        renderNotes();
        showToast('Search cleared. Showing all notes.', 'info');
    }, 5000);
    
    showToast(`Found ${filteredNotes.length} note(s) matching "${searchTerm}"`, 'success');
}

function updateStepsDisplay() {
    currentSteps.textContent = steps;
    const goalStepsValue = 10000;
    const progress = (steps / goalStepsValue) * 100;
    const percentage = Math.min(progress, 100);
    
    stepsPercentage.textContent = Math.round(percentage);
    stepsProgress.style.width = `${Math.min(progress, 100)}%`;
    
    // Add celebration effect if goal is reached
    if (steps >= goalStepsValue && steps > 0) {
        stepsProgress.style.background = 'linear-gradient(90deg, #10b981, #059669)';
        showToast('🎉 Congratulations! You reached your daily step goal!', 'success');
    }
}

function updateBmiDisplay() {
    if (bmiData) {
        bmiValue.textContent = bmiData.bmi;
        bmiCategory.textContent = bmiData.category;

        // Set color based on BMI category
        if (bmiData.category.includes('Underweight')) {
            bmiValue.className = 'text-3xl font-bold mb-1 text-blue-600';
        } else if (bmiData.category.includes('Normal')) {
            bmiValue.className = 'text-3xl font-bold mb-1 text-green-600';
        } else if (bmiData.category.includes('Overweight')) {
            bmiValue.className = 'text-3xl font-bold mb-1 text-yellow-600';
        } else {
            bmiValue.className = 'text-3xl font-bold mb-1 text-red-600';
        }

        bmiResult.classList.remove('hidden');
    }
}

function getBmiCategory(bmi) {
    if (bmi < 18.5) return 'Underweight (BMI < 18.5)';
    if (bmi < 25) return 'Normal weight (BMI 18.5-24.9)';
    if (bmi < 30) return 'Overweight (BMI 25-29.9)';
    return 'Obese (BMI ≥ 30)';
}

function deleteReminder(id) {
    if (confirm('Are you sure you want to delete this reminder?')) {
        reminders = reminders.filter(reminder => reminder.id !== id);
        saveReminders();
        renderReminders();
        updateQuickStats();
        showToast('🗑️ Reminder deleted successfully!', 'success');
    }
}

function completeReminder(id) {
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
        if (reminder.repeat === 'no') {
            deleteReminder(id);
            showToast('✅ Reminder completed and removed!', 'success');
        } else {
            showToast('🔄 Recurring reminder completed! It will repeat as scheduled.', 'info');
        }
    }
}

function deleteNote(id) {
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(note => note.id !== id);
        saveNotes();
        renderNotes();
        showToast('🗑️ Note deleted successfully!', 'success');
    }
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    let period = 'AM';
    let hour = parseInt(hours);

    if (hour >= 12) {
        period = 'PM';
        if (hour > 12) hour -= 12;
    }
    
    if (hour === 0) hour = 12;

    return `${hour}:${minutes} ${period}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// LocalStorage functions
function saveReminders() {
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function saveSteps() {
    localStorage.setItem('steps', JSON.stringify(steps));
}

function saveBmiData() {
    localStorage.setItem('bmiData', JSON.stringify(bmiData));
}

function saveNotifications() {
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// Animation and scroll functions
function setupIntersectionObserver() {
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Update active nav link
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

function setupScrollProgress() {
    const progressBar = document.querySelector('.progress-indicator');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        
        progressBar.style.transform = `scaleX(${scrollPercent})`;
        
        if (scrollPercent > 0.1) {
            progressBar.classList.add('active');
        } else {
            progressBar.classList.remove('active');
        }
    });
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                mobileMenu.classList.remove('active');
                
                // Close FAB menu if open
                fabMenu.classList.remove('active');
            }
        });
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for quick actions
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        fabButton.click();
    }
    
    // Ctrl/Cmd + D for dark mode toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        darkModeToggle.click();
    }
    
    // F11 for fullscreen
    if (e.key === 'F11') {
        e.preventDefault();
        fullscreenToggle.click();
    }
    
    // Escape to close modals/menus
    if (e.key === 'Escape') {
        mobileMenu.classList.remove('active');
        fabMenu.classList.remove('active');
        fabButton.style.transform = 'rotate(0deg)';
        hideToast();
    }
});

// Auto-save functionality
let autoSaveTimer;
function scheduleAutoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        saveReminders();
        saveExpenses();
        saveNotes();
        saveSteps();
        saveBmiData();
        saveNotifications();
        console.log('✅ Auto-save completed');
    }, 30000); // 30 seconds
}

// Initialize notifications
document.addEventListener('DOMContentLoaded', function() {
    renderNotifications();
    updateNotificationBadge();
});

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Performance monitoring
window.addEventListener('load', () => {
    setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('🚀 Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        
        // Show welcome message after load
        setTimeout(() => {
            showToast('🎉 Welcome to DailyHelp by Mayank Shah!', 'success');
        }, 1000);
    }, 0);
});

// Add smooth scroll behavior enhancement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Add scroll animation
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Add highlight effect to target section
            target.style.transform = 'scale(1.01)';
            target.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                target.style.transform = 'scale(1)';
            }, 300);
        }
    });
});