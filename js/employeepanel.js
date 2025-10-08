import { displayLoginForm } from "./login.js";
import { displayShowEmployeePanel } from "./showsEmployeePanel.js";
import { displayMovieEmployeePanel } from  "./movieEmployeePanel.js";
import { displayManageEmployee } from "./manageemployee.js";
import {renderPage} from "./landingpage.js";
import {displayManageCinema} from "./manageCinema.js";


const app = document.getElementById("app");

export async function displayEmployeePanel() {
    app.innerHTML = "";

    if (!localStorage.getItem("user")) {
       return await displayLoginForm();
    }
    const user = JSON.parse(localStorage.getItem("user"));
    const headerButtonsDiv = document.createElement("div")
    headerButtonsDiv.classList.add("header-container");
    const backbutton = document.createElement("img")
    backbutton.src = "pictures/backbutton.png"
    backbutton.classList.add("back-button");
    backbutton.addEventListener("click", async function(){
       return await renderPage()
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
        return await displayShowEmployeePanel();
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

    // Manage employees (Admin Only)
    if(user.authlevel == "ADMIN"){
        const manageEmployeeComponent = document.createElement("div");
        manageEmployeeComponent.classList.add("card", "component");

        const manageEmployeeComponentHeader = document.createElement("h1");
        manageEmployeeComponentHeader.textContent = "Håndter Medarbejdere";
        manageEmployeeComponentHeader.classList.add("component-header");
        manageEmployeeComponent.appendChild(manageEmployeeComponentHeader);

        manageEmployeeComponent.addEventListener("click", async function(){
            return await displayManageEmployee()
        });
        employeePanelComponentDiv.appendChild(manageEmployeeComponent);
    }

    // Manage Cinema (Admin only)
    if(user.authlevel === "ADMIN"){
        const manageCinemaComponent = document.createElement("div");
        manageCinemaComponent.classList.add("card", "component");

        const manageCinemaComponentHeader = document.createElement("h1");
        manageCinemaComponentHeader.textContent = "Håndter biografer";
        manageCinemaComponentHeader.classList.add("component-header");
        manageCinemaComponent.appendChild(manageCinemaComponentHeader);

        manageCinemaComponent.addEventListener("click", async function(){
            return await displayManageCinema();
        });

        employeePanelComponentDiv.appendChild(manageCinemaComponent);

    }


    if(user.authlevel === "ADMIN"){
        const manageTheatreComponent = document.createElement("div")
        manageTheatreComponent.classList.add("card", "component");

        const manageTheatreComponentHeader = document.createElement("h1");
        manageTheatreComponentHeader.textContent = "Håndter Sale";
        manageTheatreComponentHeader.classList.add("component-header");
        manageTheatreComponent.appendChild(manageTheatreComponentHeader);

        manageTheatreComponent.addEventListener("click", async function(){
           return await displayManageTheatre();

        });

        employeePanelComponentDiv.appendChild(manageTheatreComponent);

    }

    // Append components
    employeePanelDiv.appendChild(employeePanelComponentDiv);
    app.appendChild(employeePanelDiv);
}




