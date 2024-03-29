document.addEventListener('DOMContentLoaded', () => {
    const addTaskForm = document.getElementById('add-task-form');
    const newTaskInput = document.getElementById('new-task-input');
    const tasksList = document.getElementById('tasks-list');
    const clearTasksButton = document.getElementById('clear-tasks-button');
    const remainingTasksSpan = document.getElementById('remaining-tasks');

    let tasks = [];

    const addTask = (task) => {
        tasks.push({
            id: Date.now(),
            title: task,
            completed: false
        });
    };

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateRemainingTasks();
    };

    const loadTasks = () => {
        tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        updateRemainingTasks();
    };

    const renderTasks = () => {
        tasksList.innerHTML = '';

        for (const task of tasks) {
            const li = document.createElement('li');
            li.dataset.id = task.id;

            if (task.completed) {
                li.classList.add('completed');
            }

            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="title">${task.title}</span>
                <button class="delete">Delete</button>
            `;

            tasksList.appendChild(li);
        }

        updateRemainingTasks();
    };

    const updateRemainingTasks = () => {
        remainingTasksSpan.textContent = tasks.filter(task => !task.completed).length;
    };

    const markTaskCompleted = (id) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
        }
    };

    const removeTask = (id) => {
        const taskIndex = tasks.findIndex(t => t.id === id);

        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            saveTasks();
        }
    };

    const handleAddTaskForm = (event) => {
        event.preventDefault();

        if (newTaskInput.value.trim()) {
            addTask(newTaskInput.value.trim());
            newTaskInput.value = '';
            saveTasks();
        }
    };

    const handleTaskClick = (event) => {
        if (event.target.classList.contains('title')) {
            markTaskCompleted(Number(event.target.closest('li').dataset.id));
        }
    };

    const handleDeleteTask = (event) => {
        if (event.target.classList.contains('delete')) {
            removeTask(Number(event.target.closest('li').dataset.id));
        }
    };const handleClearTasks = () => {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
    };

    addTaskForm.addEventListener('submit', handleAddTaskForm);
    tasksList.addEventListener('click', handleTaskClick);
    tasksList.addEventListener('click', handleDeleteTask);
    clearTasksButton.addEventListener('click', handleClearTasks);

    loadTasks();
    renderTasks();
});