document.addEventListener('DOMContentLoaded', function() {
    
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const pendingTasksList = document.getElementById('pendingTasks');
    const completedTasksList = document.getElementById('completedTasks');
    const pendingCount = document.getElementById('pendingCount');
    const completedCount = document.getElementById('completedCount');
    const taskTemplate = document.getElementById('taskTemplate');
    const editModal = document.getElementById('editModal');
    const editTaskInput = document.getElementById('editTaskInput');
    const closeModal = document.getElementById('closeModal');
    const cancelEdit = document.getElementById('cancelEdit');
    const saveEdit = document.getElementById('saveEdit');

    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentEditId = null;

    
    renderTasks();

    
    taskForm.addEventListener('submit', addTask);
    closeModal.addEventListener('click', closeEditModal);
    cancelEdit.addEventListener('click', closeEditModal);
    saveEdit.addEventListener('click', saveEditedTask);

    
    function addTask(e) {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (!taskText) return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }

    function renderTasks() {
        pendingTasksList.innerHTML = '';
        completedTasksList.innerHTML = '';

        const pendingTasks = tasks.filter(task => !task.completed);
        const completedTasks = tasks.filter(task => task.completed);

        pendingCount.textContent = pendingTasks.length;
        completedCount.textContent = completedTasks.length;

        pendingTasks.forEach(task => renderTask(task, pendingTasksList));
        completedTasks.forEach(task => renderTask(task, completedTasksList));

        feather.replace();
    }

    function renderTask(task, container) {
        const taskElement = taskTemplate.content.cloneNode(true);
        const taskItem = taskElement.querySelector('.task-item');
        const taskText = taskElement.querySelector('.task-text');
        const taskDate = taskElement.querySelector('.task-date');
        const completeBtn = taskElement.querySelector('.complete-btn');
        const editBtn = taskElement.querySelector('.edit-btn');
        const deleteBtn = taskElement.querySelector('.delete-btn');

        taskText.textContent = task.text;
        taskDate.textContent = new Date(task.createdAt).toLocaleString();

        if (task.completed) {
            taskItem.classList.add('completed');
            completeBtn.innerHTML = '<i data-feather="check-circle" class="w-5 h-5"></i>';
        }

        completeBtn.addEventListener('click', () => toggleComplete(task.id));
        editBtn.addEventListener('click', () => openEditModal(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        container.appendChild(taskElement);
    }

    function toggleComplete(taskId) {
        tasks = tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks();
    }

    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    }

    function openEditModal(taskId) {
        const task = tasks.find(task => task.id === taskId);
        if (!task) return;

        currentEditId = taskId;
        editTaskInput.value = task.text;
        editModal.classList.remove('hidden');
    }

    function closeEditModal() {
        editModal.classList.add('hidden');
        currentEditId = null;
    }

    function saveEditedTask() {
        const newText = editTaskInput.value.trim();
        if (!newText || !currentEditId) return;

        tasks = tasks.map(task => 
            task.id === currentEditId ? { ...task, text: newText } : task
        );

        saveTasks();
        renderTasks();
        closeEditModal();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});