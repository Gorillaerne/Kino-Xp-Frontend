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
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Biograf navn:";
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Indtast biografnavn";
    nameInput.required = true;

    createNewCinemaFormDiv.appendChild(nameLabel);
    createNewCinemaFormDiv.appendChild(nameInput);

    //Knappen til at oprette cinema
    const submitButton = document.createElement("button");
    submitButton.textContent = "Opret biograf";
    submitButton.classList.add("btn-submit");

    submitButton.addEventListener("click", async (event) =>{
        event.preventDefault();

        const cinemaName = nameInput.value.trim();
        if(!cinemaName){
            alert("Du skal indtaste et navn på biografen");
            return displayManageCinema();
        }

        //Hent eksisterende biografer så den kan tjekke om du opretter nogle med samme navn
        const responseGet = await fetch(`${window.config.API_BASE_URL}/api/cinemas`);
        const cinemas = await responseGet.json();

        const cinemaExists = cinemas.some(
            (cinema) => cinema.name.toLowerCase() === cinemaName.toLowerCase()
        );

        if (cinemaExists) {
            alert("Der findes allerede en biograf med det navn!");
            nameInput.value = "";
            return;
        }

        const response = await fetch(`${window.config.API_BASE_URL}` + "/api/cinemas/name",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name: cinemaName}),
        });

        if(response.ok){
            alert("Biografen blev oprettet");
            nameInput.value = "";
            await loadCinemasList();

        } else {
            alert("Noget gik galt under oprettelsen");
        }


    });

    createNewCinemaFormDiv.appendChild(submitButton);
    app.appendChild(createNewCinemaFormDiv);

    //Show list of current cinemas
    const cinemaListDiv = document.createElement("div");
    cinemaListDiv.classList.add("cinema-list");
    app.appendChild(cinemaListDiv);

    async function loadCinemasList(){
        const response = await fetch(`${window.config.API_BASE_URL}` + "/api/cinemas");
        const cinemas = await response.json();

        cinemaListDiv.innerHTML = "<h2>Eksisterende biografer:</h2>";
        cinemas.forEach((cinema) =>{
            const item = document.createElement("div");
            item.classList.add("cinema-item");
            item.textContent = cinema.name;
            cinemaListDiv.appendChild(item);
        })
    }

    await loadCinemasList();
}