import { v4 as uuidV4 } from "uuid"

type Task = {
  id: string,
  title: string,
  completed: boolean,
  createdAt: Date
}
 
// Different ways of grabbing HTML elements
const list = document.querySelector<HTMLUListElement>('#list');
const form = document.getElementById('new-task-form') as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>('#new-task-title');

// Task array that can only contain the Task type
const tasks:Task[] = loadTasks();
tasks.forEach(addListItem)

// Add task event listener
form?.addEventListener("submit", e => {
  e.preventDefault();

  if(input?.value == "" || input?.value == null) return // Typescript knows after this code that input cannot be null, so '?' is no longer needed

  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date()
  }
  tasks.push(newTask);
  saveTasks();

  addListItem(newTask);

})

function addListItem(task: Task) {

  // reset input
  if (input != null) input.value = "";

  const item = document.createElement("li");
  item.setAttribute("id", `task-${task.id}`)
  const label = document.createElement("label")
  const checkbox = document.createElement("input")
  const deleteButton = document.createElement("button");

  // Delete button event listener
  deleteButton.addEventListener('click', (e) => removeTask(task, e))
  deleteButton.innerHTML = 'delete';

  // Check/Uncheck event listener
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    saveTasks();
  })

  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  label.append(checkbox, task.title, deleteButton);
  item.append(label);
  list?.append(item);
}

// Save tasks to local storage
function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks))
}

// Loads tasks from location storage
function loadTasks(): Task[] { // Explicitly stating that the return statement will be an array of Tasks
  const taskJSON = localStorage.getItem("TASKS");
  if(taskJSON == null) return []; // This is written because JSON.parse(taskJSON) is possibly null so it gives an error if you try to return it
  return JSON.parse(taskJSON);
}

// Remove task from local storage
function removeTask(task: Task, e: Event) {
  e.preventDefault();

  // Remove task from tasks
  const indexForRemoval = tasks.indexOf(task);
  if (indexForRemoval > -1) tasks.splice(indexForRemoval, 1);

  // Remove task from dom
  const taskForRemoval = document.getElementById(`task-${task.id}`);
  taskForRemoval?.remove();

  saveTasks();
}