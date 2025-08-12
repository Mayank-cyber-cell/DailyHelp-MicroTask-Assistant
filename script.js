

// Initialize data from localStorage or create empty arrays
let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let steps = JSON.parse(localStorage.getItem('steps')) || 0;
let bmiData = JSON.parse(localStorage.getItem('bmiData')) || null;

// DOM Elements
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const reminderForm = document.getElementById('reminderForm');
const remindersList = document.getElementById('remindersList');
const noRemindersText = document.getElementById('noRemindersText');
const expenseForm = document.getElementById('expenseForm');
const totalExpenses = document.getElementById('totalExpenses');
const expenseBreakdown = document.getElementById('expenseBreakdown');
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

// Event Listeners
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the app
    renderReminders();
    renderExpenses();
    renderNotes();
    updateStepsDisplay();
    updateBmiDisplay();

    // Set up intersection observer for section animations
    setupIntersectionObserver();

    // Smooth scroll for anchor links
    setupSmoothScroll();
});

hamburger.addEventListener('click', function () {
    mobileMenu.classList.toggle('active');
});

// Reminders functionality
reminderForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const taskName = document.getElementById('taskName').value;
    const taskTime = document.getElementById('taskTime').value;
    const repeat = document.querySelector('input[name="repeat"]:checked').value;

    const reminder = {
        id: Date.now(),
        taskName,
        taskTime,
        repeat,
        completed: false
    };

    reminders.push(reminder);
    saveReminders();
    renderReminders();

    // Reset form
    reminderForm.reset();
});

// Expenses functionality
expenseForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;

    const expense = {
        id: Date.now(),
        amount,
        category,
        date: new Date().toISOString()
    };

    expenses.push(expense);
    saveExpenses();
    renderExpenses();

    // Reset form
    expenseForm.reset();
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
});

// Steps Tracker functionality
stepsForm.addEventListener('submit', function (e) {
    e.preventDefault();

    steps = parseInt(document.getElementById('steps').value);
    saveSteps();
    updateStepsDisplay();

    // Reset form
    stepsForm.reset();
});

// Notes functionality
noteForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const content = document.getElementById('noteContent').value;

    const note = {
        id: Date.now(),
        content,
        date: new Date().toISOString()
    };

    notes.push(note);
    saveNotes();
    renderNotes();

    // Reset form
    noteForm.reset();
});

// Helper functions
function renderReminders() {
    if (reminders.length === 0) {
        noRemindersText.style.display = 'block';
        remindersList.innerHTML = '';
        return;
    }

    noRemindersText.style.display = 'none';
    remindersList.innerHTML = '';

    reminders.forEach(reminder => {
        const reminderElement = document.createElement('div');
        reminderElement.className = 'bg-gray-50 p-4 rounded-lg flex justify-between items-center';
        reminderElement.innerHTML = `
    <div>
        <h4 class="font-medium text-gray-800">${reminder.taskName}</h4>
        <p class="text-sm text-gray-600">
            <i class="far fa-clock mr-1"></i> ${formatTime(reminder.taskTime)}
            ${reminder.repeat === 'yes' ? '<span class="ml-2"><i class="fas fa-redo mr-1"></i> Repeats</span>' : ''}
        </p>
    </div>
    <button class="text-red-500 hover:text-red-700 transition" data-id="${reminder.id}">
        <i class="fas fa-trash"></i>
    </button>
    `;

        remindersList.appendChild(reminderElement);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll('#remindersList button').forEach(button => {
        button.addEventListener('click', function () {
            const id = parseInt(this.getAttribute('data-id'));
            deleteReminder(id);
        });
    });
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
        expenseBreakdown.innerHTML = '<p class="text-gray-500 text-center py-4">No expenses recorded yet. Add your first expense to see the breakdown.</p>';
        return;
    }

    expenseBreakdown.innerHTML = '';

    for (const category in categories) {
        const percentage = (categories[category] / total) * 100;

        const categoryElement = document.createElement('div');
        categoryElement.className = 'flex justify-between items-center';
        categoryElement.innerHTML = `
    <div class="flex items-center">
        <div class="w-3 h-3 rounded-full bg-purple-600 mr-2"></div>
        <span class="font-medium">${category}</span>
    </div>
    <div class="text-right">
        <p class="font-medium">$${categories[category].toFixed(2)}</p>
        <p class="text-sm text-gray-500">${percentage.toFixed(1)}%</p>
    </div>
    `;

        expenseBreakdown.appendChild(categoryElement);
    }
}

function renderNotes() {
    if (notes.length === 0) {
        notesList.innerHTML = '<p class="text-gray-500 text-center py-4 col-span-2">No notes saved yet. Add your first note above!</p>';
        return;
    }

    notesList.innerHTML = '';

    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'bg-white rounded-lg shadow p-4 hover:shadow-md transition';
        noteElement.innerHTML = `
    <div class="flex justify-between items-start mb-2">
        <p class="text-gray-700">${note.content}</p>
        <button class="text-red-500 hover:text-red-700 transition" data-id="${note.id}">
            <i class="fas fa-trash"></i>
        </button>
    </div>
    <p class="text-xs text-gray-500">${formatDate(note.date)}</p>
    `;

        notesList.appendChild(noteElement);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll('#notesList button').forEach(button => {
        button.addEventListener('click', function () {
            const id = parseInt(this.getAttribute('data-id'));
            deleteNote(id);
        });
    });
}

function updateStepsDisplay() {
    currentSteps.textContent = steps;
    const progress = (steps / 10000) * 100;
    stepsProgress.style.width = `${Math.min(progress, 100)}%`;
}

function updateBmiDisplay() {
    if (bmiData) {
        bmiValue.textContent = bmiData.bmi;
        bmiCategory.textContent = bmiData.category;

        // Set color based on BMI category
        if (bmiData.category.includes('Underweight')) {
            bmiValue.className = 'text-2xl font-bold mb-2 text-blue-600';
        } else if (bmiData.category.includes('Normal')) {
            bmiValue.className = 'text-2xl font-bold mb-2 text-green-600';
        } else if (bmiData.category.includes('Overweight')) {
            bmiValue.className = 'text-2xl font-bold mb-2 text-yellow-600';
        } else {
            bmiValue.className = 'text-2xl font-bold mb-2 text-red-600';
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
    reminders = reminders.filter(reminder => reminder.id !== id);
    saveReminders();
    renderReminders();
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    renderNotes();
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    let period = 'AM';
    let hour = parseInt(hours);

    if (hour >= 12) {
        period = 'PM';
        if (hour > 12) hour -= 12;
    }

    return `${hour}:${minutes} ${period}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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

// Animation and scroll functions
function setupIntersectionObserver() {
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
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
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                mobileMenu.classList.remove('active');
            }
        });
    });
}