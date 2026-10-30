// ===== StudyHub Tasks: CRUD + Local Storage + Search =====

const STORAGE_KEY = "studyhub-tasks";

// --- 1. Grab the page elements we need ---
const form = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const subjectInput = document.getElementById("task-subject");
const dueInput = document.getElementById("task-due");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const searchInput = document.getElementById("search");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");

// --- 2. Data: an array of objects, loaded from Local Storage ---
// Each task looks like: { id: 1730000000000, title: "...", subject: "...", due: "2026-11-02" }
let tasks = loadTasks();
let editId = null; // null = adding a new task, a number = editing that task

function loadTasks() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return []; // nothing saved yet, or the saved text was damaged
    }
}

function saveTasks() {
    // Local Storage only stores text, so the array is converted to a JSON string
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Stops text typed by a visitor from being treated as HTML code
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// --- 3. READ: draw a list of tasks on the page ---
function renderTasks(list) {
    taskCount.textContent = `${list.length} of ${tasks.length} tasks`;

    if (list.length === 0) {
        taskList.innerHTML = `
            <li class="bg-white border border-dashed border-slate-300 rounded-2xl p-6 text-center text-sm text-slate-500">
                No tasks found. Add a task above or change your search.
            </li>`;
        return;
    }

    // map() turns each task object into a piece of HTML
    taskList.innerHTML = list.map((task) => `
        <li class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h3 class="font-bold text-slate-900">${escapeHtml(task.title)}</h3>
                <p class="text-xs text-slate-500 mt-1">${escapeHtml(task.subject)} &middot; Due: ${escapeHtml(task.due)}</p>
            </div>
            <div class="flex gap-2">
                <button type="button" data-action="edit" data-id="${task.id}" class="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition">Edit</button>
                <button type="button" data-action="delete" data-id="${task.id}" class="text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg transition">Delete</button>
            </div>
        </li>
    `).join("");
}

// --- 4. SEARCH: filter() keeps only the tasks that match, then we draw them ---
function applySearch() {
    const query = searchInput.value.trim().toLowerCase();
    const result = tasks.filter((task) =>
        task.title.toLowerCase().includes(query) ||
        task.subject.toLowerCase().includes(query)
    );
    renderTasks(result);
}

// Put the form back to "add a task" mode
function resetForm() {
    form.reset();
    editId = null;
    submitBtn.textContent = "Add Task";
    cancelBtn.classList.add("hidden");
}

// --- 5. CREATE and UPDATE: runs when the form is submitted ---
form.addEventListener("submit", (event) => {
    event.preventDefault(); // stop the browser from reloading the page

    const title = titleInput.value.trim();
    const subject = subjectInput.value;
    const due = dueInput.value;

    // every(): true only if ALL the fields are filled
    const allFilled = [title, subject, due].every((value) => value !== "");
    if (!allFilled) {
        alert("Please fill in the title, subject and due date.");
        return;
    }

    // some(): true if AT LEAST ONE task already has this title (ignoring the one being edited)
    const duplicate = tasks.some((task) =>
        task.title.toLowerCase() === title.toLowerCase() && task.id !== editId
    );
    if (duplicate) {
        alert("A task with this title already exists.");
        return;
    }

    if (editId === null) {
        // CREATE: add a new object to the array
        tasks.push({ id: Date.now(), title, subject, due });
    } else {
        // UPDATE: find() the task being edited and change its fields
        const task = tasks.find((t) => t.id === editId);
        task.title = title;
        task.subject = subject;
        task.due = due;
    }

    saveTasks();
    resetForm();
    applySearch();
});

// --- 6. DELETE and start EDIT: clicks on the Edit / Delete buttons ---
taskList.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const id = Number(button.dataset.id);

    if (button.dataset.action === "delete") {
        if (confirm("Delete this task?")) {
            // filter() keeps every task except the one with this id
            tasks = tasks.filter((task) => task.id !== id);
            saveTasks();
            applySearch();
        }
    } else if (button.dataset.action === "edit") {
        const task = tasks.find((t) => t.id === id);
        titleInput.value = task.title;
        subjectInput.value = task.subject;
        dueInput.value = task.due;
        editId = id;
        submitBtn.textContent = "Update Task";
        cancelBtn.classList.remove("hidden");
        form.scrollIntoView({ behavior: "smooth" });
        titleInput.focus();
    }
});

cancelBtn.addEventListener("click", resetForm);
searchInput.addEventListener("input", applySearch);

// Draw the saved tasks when the page opens
applySearch();
