const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

form.addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent page reload
  const taskText = input.value.trim();
  if (taskText === '') return;

  const li = document.createElement('li');

  // Create completion toggle
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-complete-toggle';
  checkbox.addEventListener('change', function() {
    li.classList.toggle('completed', checkbox.checked);
  });

  // Task text span
  const span = document.createElement('span');
  span.textContent = taskText;

  // Create delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'delete-task';
  deleteBtn.addEventListener('click', function() {
    list.removeChild(li);
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);
  list.appendChild(li);

  input.value = ''; // Clear input
});

// Optional: visually mark completed tasks
const style = document.createElement('style');
style.textContent = `
  .completed span {
    text-decoration: line-through;
    color: #888;
  }
  .delete-task {
    margin-left: 10px;
    background: #e74c3c;
    color: #fff;
    border: none;
    padding: 3px 8px;
    cursor: pointer;
    border-radius: 3px;
  }
  .task-complete-toggle {
    margin-right: 8px;
  }
`;
document.head.appendChild(style);
