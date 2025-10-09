import { displayLoginForm } from "./login.js";
import { displayEmployeePanel } from "./employeepanel.js";

const app = document.getElementById("app");

export async function displayManageCinema() {
    app.innerHTML = "";
    if (!localStorage.getItem("user")) {
        await displayLoginForm();
    }
    const user = JSON.parse(localStorage.getItem("user"));

    // ---- Header ----
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

    // Container til det hele
    const componentPanel = document.createElement("div");
    componentPanel.classList.add("employee-panel");

    // Div til formen
    const createNewCinemaFormDiv = document.createElement("div");
    createNewCinemaFormDiv.classList.add("create-movie-form"); // reuse movie form styling

    const createNewCinemaHeader = document.createElement("h1");
    createNewCinemaHeader.textContent = "Opret ny biograf";
    createNewCinemaHeader.classList.add("form-heading");
    createNewCinemaFormDiv.appendChild(createNewCinemaHeader);

    // Name input
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Biograf navn:";
    createNewCinemaFormDiv.appendChild(nameLabel);

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Indtast biografnavn";
    nameInput.required = true;
    nameInput.classList.add("form-input");
    createNewCinemaFormDiv.appendChild(nameInput);

    const submitButton = document.createElement("button");
    submitButton.textContent = "Opret biograf";
    submitButton.classList.add("btn", "btn-submit");
    createNewCinemaFormDiv.appendChild(submitButton);

    componentPanel.appendChild(createNewCinemaFormDiv);

    // Biograf visning
    const cinemaDisplayDiv = document.createElement("div");
    cinemaDisplayDiv.classList.add("movie-display"); // genbruger styling

    const cinemaTableHeader = document.createElement("h1");
    cinemaTableHeader.textContent = "Eksisterende biografer";
    cinemaTableHeader.classList.add("form-heading");
    cinemaDisplayDiv.appendChild(cinemaTableHeader);

    const cinemaTable = document.createElement("table");
    cinemaTable.classList.add("movie-table"); // Genbruger styling

    const headerRow = document.createElement("tr");
    ["Navn", "Handlinger"].forEach((text) => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    cinemaTable.appendChild(headerRow);
    cinemaDisplayDiv.appendChild(cinemaTable);
    componentPanel.appendChild(cinemaDisplayDiv);
    app.appendChild(componentPanel);

    // Indlæs alle biografer
    async function loadCinemasList() {
        const response = await fetch(`${window.config.API_BASE_URL}/api/cinemas`);
        const cinemas = await response.json();

        cinemaTable.innerHTML = "";
        const newHeader = document.createElement("tr");
        ["Navn", "Handlinger"].forEach((text) => {
            const th = document.createElement("th");
            th.textContent = text;
            newHeader.appendChild(th);
        });
        cinemaTable.appendChild(newHeader);

        for (let cinema of cinemas) {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = cinema.name;
            row.appendChild(nameCell);

            const actionsCell = document.createElement("td");
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Fjern";
            removeBtn.classList.add("btn", "btn-delete");

            removeBtn.addEventListener("click", async () => {
                const confirmed = confirm(`Er du sikker på du vil slette biografen "${cinema.name}"?`);
                if (!confirmed) return;

                const delResponse = await fetch(`${window.config.API_BASE_URL}/api/cinemas/${cinema.id}`, {
                    method: "DELETE",
                });

                if (delResponse.ok) {
                    alert("Biograf slettet");
                    await loadCinemasList();
                } else {
                    alert("Noget gik galt med sletning");
                }
            });

            actionsCell.appendChild(removeBtn);
            row.appendChild(actionsCell);
            cinemaTable.appendChild(row);
        }
    }

    await loadCinemasList();

    // Submit knap til at oprette biograf
    submitButton.addEventListener("click", async (event) => {
        event.preventDefault();

        const cinemaName = nameInput.value.trim();
        if (!cinemaName) {
            alert("Du skal indtaste et navn på biografen");
            return;
        }

        const response = await fetch(`${window.config.API_BASE_URL}/api/cinemas/name`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: cinemaName }),
        });

        if (response.ok) {
            alert("Biograf oprettet");
            nameInput.value = "";
            await loadCinemasList();
        } else {
            alert("Noget gik galt under oprettelsen");
        }
    });
}
