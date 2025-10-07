import {displayLoginForm} from "./login.js";
import {displayEmployeePanel} from "./employeepanel.js";

const app = document.getElementById("app")

export async function displayManageEmployee() {
    app.innerHTML = ""
    if (!localStorage.getItem("user")){
        await displayLoginForm()
    }
    const user = JSON.parse(localStorage.getItem("user"))

// ---- Header ----
    const headerButtonDiv = document.createElement("div")
    headerButtonDiv.classList.add("header-container")

    const backbutton = document.createElement("img")
    backbutton.src = "pictures/backbutton.png"
    backbutton.classList.add("back-button");
    backbutton.addEventListener("click", async function(){
        await displayEmployeePanel();
    })
    headerButtonDiv.appendChild(backbutton)
    app.appendChild(headerButtonDiv)

// ---- Container for everything ----
    const componentPanel = document.createElement("div")
    componentPanel.classList.add("employee-panel")
    

// ---- Create New Employee Form----
    const createNewEmployeeFormDiv = document.createElement("div")
    createNewEmployeeFormDiv.classList.add("create-employee-form")

    const createNewEmployeeHeading = document.createElement("h1")
    createNewEmployeeHeading.textContent = "Tilføj ny medarbejder"
    createNewEmployeeHeading.classList.add("form-heading")
    createNewEmployeeFormDiv.appendChild(createNewEmployeeHeading)
    
// ---- Username input ----
    const usernameLabel = document.createElement("label")
    usernameLabel.textContent = "Username"
    usernameLabel.setAttribute("for", "usernameInput")
    createNewEmployeeFormDiv.appendChild(usernameLabel)

    const usernameInput = document.createElement("input")
    usernameInput.id = "usernameInput"
    usernameInput.type = "text"
    usernameInput.placeholder = "Username"
    usernameInput.classList.add("form-input")
    createNewEmployeeFormDiv.appendChild(usernameInput)

// ---- Password input ----
    const passwordLabel = document.createElement("label")
    passwordLabel.textContent = "Password"
    passwordLabel.setAttribute("for", "passwordInput")
    createNewEmployeeFormDiv.appendChild(passwordLabel)

    const passwordInput = document.createElement("input")
    passwordInput.id = "passwordInput"
    passwordInput.type = "text"
    passwordInput.placeholder = "Password"
    passwordInput.classList.add("form-input")
    createNewEmployeeFormDiv.appendChild(passwordInput)

// ---- AuthLevel Select ----
    const authlevelLabel = document.createElement("label")
    authlevelLabel.textContent = "Autentificerings Niveau"
    authlevelLabel.setAttribute("for", "authlevelSelect")
    createNewEmployeeFormDiv.appendChild(authlevelLabel)

    const authlevelSelect = document.createElement("select")
    authlevelSelect.id = "authlevelSelect"
    authlevelSelect.classList.add("form-select")

    const selectAdmin = document.createElement("option")
    selectAdmin.value = "1"
    selectAdmin.textContent = "Admin"

    const selectEmployee = document.createElement("option")
    selectEmployee.value = "2"
    selectEmployee.textContent = "Medarbejder"

    authlevelSelect.appendChild(selectAdmin)
    authlevelSelect.appendChild(selectEmployee)

    authlevelSelect.value = "2"
    createNewEmployeeFormDiv.appendChild(authlevelSelect);


// ---- Cinema Select ----











    componentPanel.appendChild(createNewEmployeeFormDiv)
    app.appendChild(componentPanel);
}