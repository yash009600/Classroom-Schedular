const teachers = [
    "Mrs. Smith", "Mr. Johnson", "Ms. Davis", "Dr. Wilson", "Mrs. Brown",
    "Mr. Taylor", "Ms. Anderson", "Dr. Thomas", "Mrs. Martinez", "Mr. Garcia",
    "Dr. Lee", "Ms. White", "Mr. Harris", "Mrs. Clark", "Ms. Lewis",
    "Mr. Young", "Dr. King", "Mrs. Wright", "Mr. Lopez", "Ms. Hall",
    "Dr. Green", "Mrs. Adams", "Mr. Baker", "Ms. Nelson", "Dr. Carter"
];

const classrooms = [
    "Room 1", "Room 2", "Room 3", "Room 4", "Room 5",
    "Lab A", "Lab B", "Lab C", "Library", "Auditorium",
    "Gymnasium"
];

let scheduledClasses = [];

window.onload = function() {
    initializeSelects();
    setMinDate();
    loadScheduleFromStorage();
};

function initializeSelects() {
    const teacherSelect = document.getElementById('teacher');
    const classroomSelect = document.getElementById('classroom');

    teachers.forEach(teacher => {
        const option = new Option(teacher, teacher);
        teacherSelect.add(option);
    });

    classrooms.forEach(classroom => {
        const option = new Option(classroom, classroom);
        classroomSelect.add(option);
    });
}

function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').min = today;
}

function checkCollision(newClass) {
    return scheduledClasses.some(existingClass => {
        if (existingClass.date === newClass.date && 
            existingClass.classroom === newClass.classroom) {
            
            const newStart = new Date(`2000-01-01T${newClass.startTime}`);
            const newEnd = new Date(`2000-01-01T${newClass.endTime}`);
            const existingStart = new Date(`2000-01-01T${existingClass.startTime}`);
            const existingEnd = new Date(`2000-01-01T${existingClass.endTime}`);

            return !(newEnd <= existingStart || newStart >= existingEnd);
        }
        return false;
    });
}

function scheduleClass() {
    const teacher = document.getElementById('teacher').value;
    const classroom = document.getElementById('classroom').value;
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const messageDiv = document.getElementById('message');

    messageDiv.textContent = '';
    messageDiv.className = '';

    if (!validateInputs(teacher, classroom, date, startTime, endTime)) {
        return;
    }

    const newClass = { teacher, classroom, date, startTime, endTime };

    if (checkCollision(newClass)) {
        showMessage('error', 'Scheduling conflict detected! Please choose different time or classroom');
        return;
    }

    scheduledClasses.push(newClass);
    saveScheduleToStorage();
    updateScheduleDisplay();

    showMessage('success', 'Class scheduled successfully!');
    resetForm();
}

function validateInputs(teacher, classroom, date, startTime, endTime) {
    if (!teacher || !classroom || !date || !startTime || !endTime) {
        showMessage('error', 'Please fill in all fields');
        return false;
    }

    if (new Date(`2000-01-01T${startTime}`) >= new Date(`2000-01-01T${endTime}`)) {
        showMessage('error', 'End time must be after start time');
        return false;
    }

    return true;
}

function showMessage(type, text) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = type;
}

function resetForm() {
    document.getElementById('teacher').value = '';
    document.getElementById('classroom').value = '';
    document.getElementById('date').value = '';
    document.getElementById('startTime').value = '';
    document.getElementById('endTime').value = '';
}

function updateScheduleDisplay() {
    const tbody = document.getElementById('scheduleBody');
    tbody.innerHTML = '';

    scheduledClasses.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
    });

    scheduledClasses.forEach(cls => {
        const row = tbody.insertRow();
        row.insertCell().textContent = cls.teacher;
        row.insertCell().textContent = cls.classroom;
        row.insertCell().textContent = formatDate(cls.date);
        row.insertCell().textContent = formatTime(cls.startTime);
        row.insertCell().textContent = formatTime(cls.endTime);
    });
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function formatTime(time) {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function saveScheduleToStorage() {
    localStorage.setItem('scheduledClasses', JSON.stringify(scheduledClasses));
}

function loadScheduleFromStorage() {
    const saved = localStorage.getItem('scheduledClasses');
    if (saved) {
        scheduledClasses = JSON.parse(saved);
        updateScheduleDisplay();
    }
}
