// ****** item selection **********
// After writing did come thinking and rewrote this and was able to literally cut 100 lines wow!
const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// event listeners 

form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);

// edit option 
let editElement, editFlag = false, editID = "";

// functions 
// practicing better documentation
function addItem(e) {
  e.preventDefault();
  const value = grocery.value.trim(); // Trimming to avoid whitespace-only entries
  const id = new Date().getTime().toString();

  if (value && !editFlag) {
    createListItem(id, value);
    displayAlert("item added to the list", "success");
    container.classList.add("show-container");
    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("please enter value", "danger");
  }
}

function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

function clearItems() {
  list.innerHTML = "";
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

function deleteItem(e) {
  const element = e.currentTarget.closest(".grocery-item");
  const id = element.dataset.id;

  list.removeChild(element);
  if (!list.children.length) container.classList.remove("show-container");
  displayAlert("item removed", "danger");

  setBackToDefault();
  removeFromLocalStorage(id);
}

function editItem(e) {
  const element = e.currentTarget.closest(".grocery-item");
  editElement = element.querySelector(".title");
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "edit";
}

function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// ****** local storage **********

function addToLocalStorage(id, value) {
  const items = getLocalStorage();
  items.push({ id, value });
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return JSON.parse(localStorage.getItem("list")) || [];
}

function removeFromLocalStorage(id) {
  const items = getLocalStorage().filter(item => item.id !== id);
  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  const items = getLocalStorage().map(item => 
    item.id === id ? { ...item, value } : item
  );
  localStorage.setItem("list", JSON.stringify(items));
}

// ****** setup items **********

function setupItems() {
  const items = getLocalStorage();
  if (items.length) {
    items.forEach(item => createListItem(item.id, item.value));
    container.classList.add("show-container");
  }
}

function createListItem(id, value) {
  const element = document.createElement("article");
  element.setAttribute("data-id", id);
  element.classList.add("grocery-item");
  element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn"><i class="fas fa-edit"></i></button>
      <button type="button" class="delete-btn"><i class="fas fa-trash"></i></button>
    </div>`;
  
  element.querySelector(".delete-btn").addEventListener("click", deleteItem);
  element.querySelector(".edit-btn").addEventListener("click", editItem);
  list.appendChild(element);
}
