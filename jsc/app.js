import { fetchTodos, postTodo, patchTodoStatus, putTodo, removeTodo } from "./api.js";
import { renderTodos, renderStatistics } from "./ui.js";

const FormEl = document.querySelector(".create-form");
const listContainer = document.querySelector(".todo-list");
const filterBtns = document.querySelectorAll(".segmented .seg-btn");

var hammaTodolar = [];
var hozirgiFiltr = "all";

async function initApp() {
    hammaTodolar = await fetchTodos();
    renderStatistics(hammaTodolar);
    saralashVaChizish();
}

function saralashVaChizish() {
    var saralangan = [];

    for (var i = 0; i < hammaTodolar.length; i++) {
        var element = hammaTodolar[i];

        if (hozirgiFiltr == "all") {
            saralangan.push(element);
        } else if (hozirgiFiltr == "active" && element.completed == false) {
            saralangan.push(element);
        } else if (hozirgiFiltr == "completed" && element.completed == true) {
            saralangan.push(element);
        }
    }

    renderTodos(saralangan);
}

FormEl.addEventListener("submit", async function (hodisa) {
    hodisa.preventDefault();

    var sarlavhaInput = FormEl.querySelector('input[name="title"]');
    var izohInput = FormEl.querySelector('textarea[name="description"]');

    if (sarlavhaInput.value.trim() == "") {
        alert("Iltimos, sarlavha yozing!");
        return;
    }

    var muvaffaqiyat = await postTodo(sarlavhaInput.value, izohInput.value);
    if (muvaffaqiyat) {
        FormEl.reset();
        initApp();
    } else {
        alert("Serverga qo'shishda xatolik bo'ldi!");
    }
});

listContainer.addEventListener("click", async function (e) {
    var nishon = e.target;

    if (nishon.closest('[data-action="toggle"]')) {
        var btn = nishon.closest('[data-action="toggle"]');
        var id = btn.getAttribute("data-id");
        var completed = btn.getAttribute("data-completed") == "true";
        
        var muvaffaqiyat = await patchTodoStatus(id, completed);
        if (muvaffaqiyat) initApp();
    }

    if (nishon.closest('[data-action="edit"]')) {
        var btn = nishon.closest('[data-action="edit"]');
        var id = btn.getAttribute("data-id");
        var oldTitle = btn.getAttribute("data-title");
        var oldDesc = btn.getAttribute("data-desc");
        var completed = btn.getAttribute("data-completed") == "true";

        var yangiTitle = prompt("Yangi sarlavha kiriting:", oldTitle);
        if (yangiTitle == null) return;

        var yangiDesc = prompt("Yangi izoh kiriting:", oldDesc);
        if (yangiDesc == null) return;

        var muvaffaqiyat = await putTodo(id, yangiTitle || oldTitle, yangiDesc || oldDesc, completed);
        if (muvaffaqiyat) initApp();
    }

    if (nishon.closest('[data-action="delete"]')) {
        var btn = nishon.closest('[data-action="delete"]');
        var id = btn.getAttribute("data-id");

        if (confirm("O'chirmoqchimisiz?")) {
            var muvaffaqiyat = await removeTodo(id);
            if (muvaffaqiyat) initApp();
        }
    }
});

for (var n = 0; n < filterBtns.length; n++) {
    filterBtns[n].addEventListener("click", function (e) {
        for (var x = 0; x < filterBtns.length; x++) {
            filterBtns[x].classList.remove("is-active");
        }
        
        var bosilganTugma = e.target;
        bosilganTugma.classList.add("is-active");

        var matn = bosilganTugma.textContent.trim().toLowerCase();
        hozirgiFiltr = matn;

        saralashVaChizish();
    });
}

window.getTodos = initApp;
initApp();