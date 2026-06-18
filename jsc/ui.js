var todoWrapEl = document.querySelector(".todo-list");
const emptyStateEl = document.querySelector('[data-state="empty"]');

const statCount = document.querySelector('[data-stat="count"]');
const statDone = document.querySelector('[data-stat="done"]');
const statActive = document.querySelector('[data-stat="active"]');

export function renderTodos(arr) {
    todoWrapEl.innerHTML = "";

    if (arr.length == 0) {
        if (emptyStateEl) emptyStateEl.style.display = "block";
        return;
    } else {
        if (emptyStateEl) emptyStateEl.style.display = "none";
    }

    for (var k = 0; k < arr.length; k++) {
        var todo = arr[k];
        var id = todo.id;
        var title = todo.title;
        var description = todo.description;
        var completed = todo.completed;
        var created_at = todo.created_at;
        
        var date = created_at ? created_at.substring(0, 10) : "2026-06-18";

        todoWrapEl.innerHTML += `
            <li class="todo-item ${completed ? 'is-done' : ''}">
              <button class="check ${completed ? 'is-checked' : ''}" type="button" data-action="toggle" data-id="${id}" data-completed="${completed}">
                <span class="check-icon">${completed ? '✓' : ''}</span>
              </button>

              <div class="todo-content">
                <div class="todo-top">
                  <h3 class="todo-title">${title}</h3>
                  <span class="badge ${completed ? 'badge-done' : 'badge-active'}">
                    ${completed ? 'Completed' : 'Active'}
                  </span>
                </div>
                <p class="todo-desc">${description || 'Izoh yo\'q'}</p>
                <div class="meta">
                  <span class="meta-item"><span class="meta-label">ID:</span><span class="meta-value">${id}</span></span>
                  <span class="meta-item"><span class="meta-label">Created:</span><span class="meta-value">${date}</span></span>
                </div>
              </div>

              <div class="todo-actions">
                <button class="icon-btn" type="button" data-action="edit" data-id="${id}" data-title="${title}" data-desc="${description || ''}" data-completed="${completed}">✎</button>
                <button class="icon-btn danger" type="button" data-action="delete" data-id="${id}">🗑</button>
              </div>
            </li>
        `;
    }
}

export function renderStatistics(hammaMalumotlar) {
    var jami = hammaMalumotlar.length;
    var bajarilgan = 0;

    for (var m = 0; m < hammaMalumotlar.length; m++) {
        if (hammaMalumotlar[m].completed == true) {
            bajarilgan++;
        }
    }

    var faol = jami - bajarilgan;

    if (statCount) statCount.textContent = jami;
    if (statDone) statDone.textContent = bajarilgan;
    if (statActive) statActive.textContent = faol;
}