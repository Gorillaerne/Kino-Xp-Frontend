import {displayLoginForm} from "./login.js";
import {displayEmployeePanel} from "./employeepanel.js";

const app = document.getElementById("app");

export async function displayManageCinema(){
    app.innerHTML = "";
    if(!localStorage.getItem("user")){
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

    //Create new Cinema Form

    const createNewCinemaFormDiv = document.createElement("div");
    createNewCinemaFormDiv.classList.add("create-cinema-form");

    const createNewCinemaHeader = document.createElement("h1");
    createNewCinemaHeader.textContent = "Tilføj ny biograf";
    createNewCinemaHeader.classList.add("form-heading");
    createNewCinemaFormDiv.appendChild(createNewCinemaHeader);



    //Name

    //Theatres

    //Seats

    //Show list of current cinemas and it's theatres




}