import { displayLoginForm } from "./login.js";
import { displayShowEmployeePanel } from "./showsEmployeePanel.js";
import { displayMovieEmployeePanel } from  "./movieEmployeePanel.js"

const app = document.getElementById("app");

export async function displayEmployeePanel() {
    app.innerHTML = "";

    if (!localStorage.getItem("user")) {
       return await displayLoginForm();
    }
    const headerButtonsDiv = document.createElement("div")
    headerButtonsDiv.classList.add("header-container")
    const backbutton = document.createElement("img")
    backbutton.src = "pictures/backbutton.png"
    backbutton.classList.add("back-button");
    backbutton.addEventListener("click", async function(){
        alert("skal opdateres til hjemmesideforsiden!!")
    })
    headerButtonsDiv.appendChild(backbutton)

    const logout = document.createElement("img")
    logout.src = "pictures/signout.png"
    logout.classList.add("back-button");
    logout.addEventListener("click", async function(){
        localStorage.removeItem("user")
        alert("Du er blevet logget ud")
        return await displayEmployeePanel();

    })
    headerButtonsDiv.appendChild(logout)



    app.appendChild(headerButtonsDiv)

    const user = JSON.parse(localStorage.getItem("user"));

    const employeePanelDiv = document.createElement("div");
    employeePanelDiv.classList.add("card", "employee-panel");

    const employeePanelHeader = document.createElement("h1");
    employeePanelHeader.textContent = "Velkommen " + user.username;
    employeePanelHeader.classList.add("panel-header");
    employeePanelDiv.appendChild(employeePanelHeader);

    const employeePanelComponentDiv = document.createElement("div");
    employeePanelComponentDiv.classList.add("component-container");

    // Manage Shows component
    const newShowComponent = document.createElement("div");
    newShowComponent.classList.add("card", "component");

    const newShowComponentHeader = document.createElement("h1");
    newShowComponentHeader.textContent = "Håndter forestillinger";
    newShowComponentHeader.classList.add("component-header");
    newShowComponent.appendChild(newShowComponentHeader);

    newShowComponent.addEventListener("click", async function () {
        await displayShowEmployeePanel();
    });
    employeePanelComponentDiv.appendChild(newShowComponent);

    // Manage Movies component
    const manageMovieComponent = document.createElement("div");
    manageMovieComponent.classList.add("card", "component");

    const manageMovieComponentHeader = document.createElement("h1");
    manageMovieComponentHeader.textContent = "Håndter film";
    manageMovieComponentHeader.classList.add("component-header");
    manageMovieComponent.appendChild(manageMovieComponentHeader);

    manageMovieComponent.addEventListener("click", async function () {
        return await displayMovieEmployeePanel()
    });
    employeePanelComponentDiv.appendChild(manageMovieComponent);

    // Append components
    employeePanelDiv.appendChild(employeePanelComponentDiv);
    app.appendChild(employeePanelDiv);
}
