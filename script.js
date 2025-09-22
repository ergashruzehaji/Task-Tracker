const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const daySelect = document.getElementById('day-select');
const day1List = document.getElementById('day1-list');
const day2List = document.getElementById('day2-list');

// Add a task to the correct list
function addTask(text, day) {
  const li = document.createElement('li');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task-complete-toggle';
  checkbox.addEventListener('change', function() {
    li.classList.toggle('completed', checkbox.checked);
    if (day === "1") checkDay1Completion();
  });

  const span = document.createElement('span');
  span.textContent = text;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'delete-task';
  deleteBtn.addEventListener('click', function() {
    li.parentNode.removeChild(li);
    if (day === "1") checkDay1Completion();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  (day === "1" ? day1List : day2List).appendChild(li);
}

// Check if all Day 1 tasks are completed, then unlock Day 2
function checkDay1Completion() {
  const tasks = day1List.querySelectorAll('li');
  const allCompleted = Array.from(tasks).length > 0 &&
    Array.from(tasks).every(li => li.classList.contains('completed'));
  daySelect.options[1].disabled = !allCompleted;
}

// Form submit event
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const taskText = input.value.trim();
  if (!taskText) return;
  const day = daySelect.value;
  addTask(taskText, day);
  input.value = '';
});