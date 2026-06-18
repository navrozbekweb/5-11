let todos = JSON.parse(localStorage.getItem('todos')) || [
  {
    id: 1,
    title: "Express bilan TODO API yozish",
    description: "CRUD endpointlar: GET (pagination), POST, PATCH, DELETE. UI’dan ishlatib ko‘rish.",
    completed: false,
    created: "2026-05-14"
  },
  {
    id: 2,
    title: "Swagger response formatni tushunish",
    description: "API response: count, next, previous, results bilan keladi.",
    completed: true,
    created: "2026-05-13"
  }
];

let currentFilter = 'all';
let currentSort = 'newest';
let searchQuery = '';
let currentPage = 1;
const itemsPerPage = 2; 
let editingId = null; 

const todoList = document.querySelector('[data-list="todos"]');
const createForm = document.querySelector('[data-form="create"]');
const todoTitleInput = document.getElementById('todoTitle');
const todoDescInput = document.getElementById('todoDesc');
const submitBtn = document.getElementById('addTodo');
const emptyState = document.querySelector('[data-state="empty"]');

const statCount = document.querySelector('[data-stat="count"]');
const statDone = document.querySelector('[data-stat="done"]');
const statActive = document.querySelector('[data-stat="active"]');

const searchInput = document.querySelector('[data-field="search"]');
const filterButtons = document.querySelectorAll('.segmented .seg-btn');
const sortSelect = document.querySelector('[data-field="sort"]');
const refreshBtn = document.querySelector('[data-action="refresh"]');

const prevBtn = document.querySelector('[data-action="prev"]');
const nextBtn = document.querySelector('[data-action="next"]');
const currentPageEl = document.querySelector('[data-page="current"]');
const totalPageEl = document.querySelector('[data-page="total"]');

function render() {
  let filtered = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  if (currentSort === 'newest') {
    filtered.sort((a, b) => new Date(b.created) - new Date(a.created));
  } else if (currentSort === 'oldest') {
    filtered.sort((a, b) => new Date(a.created) - new Date(b.created));
  } else if (currentSort === 'az') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (currentSort === 'za') {
    filtered.sort((a, b) => b.title.localeCompare(a.title));
  }

  const total = todos.length;
  const done = todos.filter(t => t.completed).length;
  const active = total - done;

  statCount.textContent = total;
  statDone.textContent = done;
  statActive.textContent = active;

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTodos = filtered.slice(startIndex, startIndex + itemsPerPage);

  currentPageEl.textContent = currentPage;
  totalPageEl.textContent = totalPages;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  if (paginatedTodos.length === 0) {
    todoList.innerHTML = '';
    emptyState.removeAttribute('hidden');
    return;
  } else {
    emptyState.setAttribute('hidden', '');
  }

  todoList.innerHTML = paginatedTodos.map(todo => `
    <li class="todo-item ${todo.completed ? 'is-done' : ''}" data-id="${todo.id}" data-completed="${todo.completed}">
      <button class="check ${todo.completed ? 'is-checked' : ''}" type="button" data-action="toggle">
        <span class="check-icon" aria-hidden="true">${todo.completed ? '✓' : ''}</span>
      </button>

      <div class="todo-content">
        <div class="todo-top">
          <h3 class="todo-title">${todo.title}</h3>
          <span class="badge ${todo.completed ? 'badge-done' : 'badge-active'}">
            ${todo.completed ? 'Completed' : 'Active'}
          </span>
        </div>
        <p class="todo-desc">${todo.description || 'Izoh qoldirilmagan'}</p>

        <div class="meta">
          <span class="meta-item">
            <span class="meta-label">ID:</span>
            <span class="meta-value">${todo.id}</span>
          </span>
          <span class="meta-item">
            <span class="meta-label">Created:</span>
            <span class="meta-value">${todo.created}</span>
          </span>
        </div>
      </div>

      <div class="todo-actions">
        <button class="icon-btn" type="button" title="Edit" data-action="edit">✎</button>
        <button class="icon-btn danger" type="button" title="Delete" data-action="delete">🗑</button>
      </div>
    </li>
  `).join('');

  localStorage.setItem('todos', JSON.stringify(todos));
}


createForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = todoTitleInput.value.trim();
  const description = todoDescInput.value.trim();

  if (!title) return;

  if (editingId) {
    todos = todos.map(todo => todo.id === editingId ? { ...todo, title, description } : todo);
    editingId = null;
    submitBtn.textContent = 'Add';
  } else {
    const newTodo = {
      id: Date.now(), 
      title,
      description,
      completed: false,
      created: new Date().toISOString().split('T')[0]
    };
    todos.push(newTodo);
  }

  createForm.reset();
  render();
});

todoList.addEventListener('click', (e) => {
  const targetBtn = e.target.closest('button');
  if (!targetBtn) return;

  const todoItem = targetBtn.closest('.todo-item');
  const id = Number(todoItem.dataset.id);
  const action = targetBtn.dataset.action;

  if (action === 'toggle') {
    todos = todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
    render();
  } else if (action === 'delete') {
    todos = todos.filter(todo => todo.id !== id);
    render();
  } else if (action === 'edit') {
    const todoToEdit = todos.find(todo => todo.id === id);
    if (todoToEdit) {
      todoTitleInput.value = todoToEdit.title;
      todoDescInput.value = todoToEdit.description;
      editingId = id;
      submitBtn.textContent = 'Save'; 
      todoTitleInput.focus();
    }
  }
});

searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  currentPage = 1; 
  render();
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    currentFilter = btn.dataset.filter;
    currentPage = 1;
    render();
  });
});

sortSelect.addEventListener('change', (e) => {
  currentSort = e.value || sortSelect.value;
  render();
});

refreshBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  currentFilter = 'all';
  currentSort = 'newest';
  currentPage = 1;
  
  filterButtons.forEach(b => b.classList.remove('is-active'));
  filterButtons[0].classList.add('is-active');
  sortSelect.value = 'newest';

  render();
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    render();
  }
});

nextBtn.addEventListener('click', () => {
  currentPage++;
  render();
});

render();