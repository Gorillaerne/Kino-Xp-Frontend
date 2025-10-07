import {displayLoginForm} from "./login.js";
import {displayEmployeePanel} from "./employeepanel.js";
import { API_BASE_URL } from "./config.js";

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
    selectAdmin.value = "ADMIN"
    selectAdmin.textContent = "Admin"

    const selectEmployee = document.createElement("option")
    selectEmployee.value = "EMPLOYEE"
    selectEmployee.textContent = "Medarbejder"

    authlevelSelect.appendChild(selectAdmin)
    authlevelSelect.appendChild(selectEmployee)

    authlevelSelect.value = "EMPLOYEE"
    createNewEmployeeFormDiv.appendChild(authlevelSelect);


// ---- Cinema Select ----
    const cinemaLabel = document.createElement("label")
    cinemaLabel.textContent = "Tilhørende Biograf"
    cinemaLabel.setAttribute("for", "cinemaSelect")
    createNewEmployeeFormDiv.appendChild(cinemaLabel)

    const cinemaSelect = document.createElement("select")
    cinemaSelect.id = "cinemaSelect"
    cinemaSelect.classList.add("form-select")

// ---- Fetch cinemas from backend ----
    const cinemaResponse = await fetch(API_BASE_URL + "/api/cinemas")
    const cinemaData = await cinemaResponse.json();
    if (!Array.isArray(cinemaData) || cinemaData.length === 0) {
    alert("Ingen biografer fundet");
  } else {
    for (const cin of cinemaData) {
      const option = document.createElement("option");
      option.textContent = cin.name;
      option.value = cin.id;
      cinemaSelect.appendChild(option);
    }
  }
    createNewEmployeeFormDiv.appendChild(cinemaSelect)
    

// ---- Submit Button ----
    const submitBtn = document.createElement("button")
    submitBtn.textContent = "Tilføj Medarbejder"
    submitBtn.classList.add("btn", "btn-submit")
    submitBtn.addEventListener("click", async function () {
        if (!usernameInput.value || !passwordInput.value || !authlevelSelect.value || !cinemaSelect.value) {
            alert("Udfyld alle felter")
            return await displayManageEmployee()
        }

        const cinemaIds = [parseInt(cinemaSelect.value)];

        const response = await fetch(API_BASE_URL + "/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username" : usernameInput.value,
                "password" : passwordInput.value,
                "authlevel" : authlevelSelect.value,
                "cinemaIds" : cinemaIds
            })
        })

        if (!response.ok){
            alert("Noget gik galt med tilføjelse af medarbejder")
        } else {
            alert("Medarbejder Tilføjet");
            return await displayManageEmployee();
        }
    })
    createNewEmployeeFormDiv.appendChild(submitBtn);
    componentPanel.appendChild(createNewEmployeeFormDiv);

// ---- Display Employee Table ----
    const employeeDisplayDiv = document.createElement("div");
    employeeDisplayDiv.classList.add("employee-display");

    const employeeTableHeader = document.createElement("h1");
    employeeTableHeader.textContent = "Alle Medarbejdere";
    employeeTableHeader.classList.add("form-heading");
    employeeDisplayDiv.appendChild(employeeTableHeader);

    const employeeTable = document.createElement("table");
    employeeTable.classList.add("employee-table");

    const headerRow = document.createElement("tr");
    ["Username", "Password", "Autentificering", "Biograf", "Handling"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    employeeTable.appendChild(headerRow);

    //Fetch Employees
    const employeeResponse = await fetch(API_BASE_URL + "/api/users");
    if (!employeeResponse.ok) {
        alert("Kunne ikke indlæse medarbejdere");
        return;
    }
    const employeeData = await employeeResponse.json();

    for (const emp of employeeData) {
        const row = document.createElement("tr");

        //Username cell
        const usernameCell = document.createElement("td");
        usernameCell.textContent = emp.username || "N/A";
        row.appendChild(usernameCell);

        // Password
        const passwordCell = document.createElement("td");
        passwordCell.textContent = emp.password || "N/A";
        row.appendChild(passwordCell);

        // Authlevel
        const authCell = document.createElement("td");
        authCell.textContent = emp.authlevel || "N/A";
        row.appendChild(authCell);

        // Cinemas (may be an array)
        const cinemaCell = document.createElement("td");
        if (Array.isArray(emp.cinemas) && emp.cinemas.length > 0) {
            cinemaCell.textContent = emp.cinemas.map(cin => cin.name).join(", ");
        } else {
            cinemaCell.textContent = "Ingen biograf";
        }
        row.appendChild(cinemaCell);

        // Actions cell
        const actionsCell = document.createElement("td");
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Fjern";
        removeBtn.classList.add("btn", "btn-delete");

        removeBtn.addEventListener("click", async () => {
            const confirmed = confirm("Er du sikker på du vil slette denne medarbejder?");
            if (!confirmed) return;

            const delResponse = await fetch(API_BASE_URL + "/api/users/" + emp.id, {
                method: "DELETE"
            });

            if (delResponse.ok) {
                alert("Medarbejder slettet");
                return await displayManageEmployee();
            } else {
                alert("Noget gik galt med sletning");
                return await displayManageEmployee(); 
            }
        });
        actionsCell.appendChild(removeBtn);
        row.appendChild(actionsCell);

        employeeTable.appendChild(row);
    }



    employeeDisplayDiv.appendChild(employeeTable);
    componentPanel.appendChild(employeeDisplayDiv);
    app.appendChild(componentPanel);
}