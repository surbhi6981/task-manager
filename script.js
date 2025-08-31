const API_URL = '/api/tasks';

const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

async function fetchTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  renderTasks(tasks);
}

async function addTask() {
  const title = taskInput.value.trim();
  if (!title) return alert("Please enter a task.");
  
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, completed: false }),
  });

  taskInput.value = '';
  fetchTasks();
}

async function toggleComplete(id, completed) {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !completed }),
  });
  fetchTasks();
}

async function deleteTask(id) {
  if (!confirm("Delete this task?")) return;

  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  fetchTasks();
}

function renderTasks(tasks) {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    taskList.innerHTML = '<li class="list-group-item text-muted text-center">No tasks added yet.</li>';
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    const span = document.createElement('span');
    span.textContent = task.title;
    if (task.completed) span.classList.add('text-decoration-line-through', 'text-muted');
    span.onclick = () => toggleComplete(task.id, task.completed);

    // Button group (Edit + Delete)
    const btnGroup = document.createElement('div');
    btnGroup.className = "btn-group btn-group-sm";

    // Edit Button
    const editBtn = document.createElement('button');
    editBtn.className = "btn btn-warning";
    editBtn.innerHTML = '<i class="bi bi-pencil"></i>'; // pencil icon
    editBtn.onclick = async () => {
      const newTitle = prompt("Edit task:", task.title);
      if (newTitle && newTitle.trim()) {
        await fetch(`${API_URL}/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle.trim() })
        });
        fetchTasks();
      }
    };

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = "btn btn-danger";
    deleteBtn.innerHTML = '<i class="bi bi-trash"></i>'; // trash icon
    deleteBtn.onclick = () => deleteTask(task.id);

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(btnGroup);
    taskList.appendChild(li);
  });
}

// Initial load
fetchTasks();
