document.addEventListener("DOMContentLoaded", loadTasks);

const input = document.querySelector(".addTask input");
const addButton = document.querySelector(".addTask button");
const notCompleted = document.querySelector(".notCompleted");
const completed = document.querySelector(".completed");

addButton.addEventListener("click", addList);
input.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
        addList(e);
    }
});

function toggleTaskState(taskElement) {
    const isCompleted = taskElement.parentNode === completed;

    if (isCompleted) {
        notCompleted.appendChild(taskElement);
    } else {
        completed.appendChild(taskElement);
    }
}

function addList(e) {
    e.preventDefault();
    const taskText = input.value.trim();
    const maxTextLength = 50;

    if (taskText !== "") {
        if (taskText.length > maxTextLength) {
            alert("Текст задачи слишком длинный. Пожалуйста, сократите.");
            return;
        }
        
        const newLi = createTaskElement(taskText);
        notCompleted.appendChild(newLi);
        input.value = "";

        newLi.querySelector(".fa-check").addEventListener("click", function () {
            moveTaskCompleted(newLi);
            saveTasks();
            loadTasks();
        });

        newLi.querySelector(".fa-trash").addEventListener("click", function () {
            deleteTask(newLi);
            saveTasks();
            loadTasks();
        });

        saveTasks();
    } else {
        alert("Введите текст задачи");
    }
}

function createTaskElement(taskText) {
    const newLi = document.createElement("li");
    const taskTextSpan = document.createElement("span");
    const icon = document.createElement("i");
    const checkButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    taskTextSpan.textContent = taskText;
    
    icon.className = "fa fa-check";
    checkButton.appendChild(icon);
    deleteButton.innerHTML = "<i class='fa fa-trash'></i>";

    newLi.appendChild(taskTextSpan);
    newLi.appendChild(checkButton);
    newLi.appendChild(deleteButton);

    return newLi;
}

function moveTaskCompleted(taskElement) {
    notCompleted.removeChild(taskElement);
    const clonedTask = taskElement.cloneNode(true);
    completed.appendChild(clonedTask);
}

function saveTasks() {
    const tasks = [];

    document.querySelectorAll(".notCompleted li").forEach((taskElement) => {
        tasks.push({ text: taskElement.querySelector("span").textContent, completed: false });
    });

    document.querySelectorAll(".completed li").forEach((taskElement) => {
        tasks.push({ text: taskElement.querySelector("span").textContent, completed: true });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(taskElement) {
    if (taskElement.querySelector("span").textContent.trim() !== "") {
        const isCompleted = taskElement.parentNode === completed;
        taskElement.remove();
        saveTasks();

        if (isCompleted) {
            loadTasks();
        }
    } else {
        taskElement.remove();
        saveTasks();
    }
}

function loadTasks() {
    notCompleted.innerHTML = "";
    completed.innerHTML = "";

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach((task) => {
        const newLi = createTaskElement(task.text);

        if (task.completed) {
            completed.appendChild(newLi);
        } else {
            notCompleted.appendChild(newLi);
        }

        newLi.querySelector(".fa-check").addEventListener("click", function () {
            toggleTaskState(newLi);
            saveTasks();
            loadTasks();
        });

        newLi.querySelector(".fa-trash").addEventListener("click", function () {
            deleteTask(newLi);
            saveTasks();
            loadTasks();
        });
    });
}
