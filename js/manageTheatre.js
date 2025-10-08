import { displayLoginForm } from "./login.js";
import { displayEmployeePanel } from "./employeepanel.js";

const app = document.getElementById("app");

export async function displayManageTheatre() {
    app.innerHTML = "";
    if (!localStorage.getItem("user")) {
        await displayLoginForm();
    }
    const user = JSON.parse(localStorage.getItem("user"));

    // Header for siden så man kan komme tilbage.
    const headerButtonDiv = document.createElement("div");
    headerButtonDiv.classList.add("header-container");

    const backbutton = document.createElement("img");
    backbutton.src = "pictures/backbutton.png";
    backbutton.classList.add("back-button");
    backbutton.addEventListener("click", async function () {
        await displayEmployeePanel();
    });

    headerButtonDiv.appendChild(backbutton);
    app.appendChild(headerButtonDiv);



}