import { displayLoginForm } from "./login.js";
import { displayEmployeePanel } from "./employeepanel.js";

const app = document.getElementById("app");

export async function displayManageTheatre() {
    app.innerHTML = "";

    // --- Check for login ---
    if (!localStorage.getItem("user")) {
        return await displayLoginForm();
    }
    const user = JSON.parse(localStorage.getItem("user"));

    // --- Header with Back Button ---
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

    // --- Main Container ---
    const componentPanel = document.createElement("div");
    componentPanel.classList.add("employee-panel");

    // --- Create Theatre Form ---
    const createTheatreDiv = document.createElement("div");
    createTheatreDiv.classList.add("create-employee-form");

    const heading = document.createElement("h1");
    heading.textContent = "Tilføj ny sal (Theatre)";
    heading.classList.add("form-heading");
    createTheatreDiv.appendChild(heading);

    // --- Cinema Select ---
    const cinemaLabel = document.createElement("label");
    cinemaLabel.textContent = "Vælg biograf";
    cinemaLabel.setAttribute("for", "cinemaSelect");
    createTheatreDiv.appendChild(cinemaLabel);

    const cinemaSelect = document.createElement("select");
    cinemaSelect.id = "cinemaSelect";
    cinemaSelect.classList.add("form-select");

    // Fetch cinemas
    const cinemaResponse = await fetch(`${window.config.API_BASE_URL}/api/cinemas`);
    const cinemaData = await cinemaResponse.json();

    if (!Array.isArray(cinemaData) || cinemaData.length === 0) {
        alert("Ingen biografer fundet");
    } else {
        for (const cin of cinemaData) {
            const option = document.createElement("option");
            option.value = cin.id;
            option.textContent = cin.name;
            cinemaSelect.appendChild(option);
        }
    }
    createTheatreDiv.appendChild(cinemaSelect);

    // --- Theatre Name Input ---
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Navn på sal";
    nameLabel.setAttribute("for", "theatreNameInput");
    createTheatreDiv.appendChild(nameLabel);

    const nameInput = document.createElement("input");
    nameInput.id = "theatreNameInput";
    nameInput.type = "text";
    nameInput.placeholder = "Skriv salens navn";
    nameInput.classList.add("form-input");
    createTheatreDiv.appendChild(nameInput);

    // --- Number of Rows Input ---
    const rowsLabel = document.createElement("label");
    rowsLabel.textContent = "Antal rækker";
    rowsLabel.setAttribute("for", "rowsInput");
    createTheatreDiv.appendChild(rowsLabel);

    const rowsInput = document.createElement("input");
    rowsInput.id = "rowsInput";
    rowsInput.type = "number";
    rowsInput.placeholder = "F.eks. 10";
    rowsInput.classList.add("form-input");
    createTheatreDiv.appendChild(rowsInput);

    // --- Seats per Row Input ---
    const seatsLabel = document.createElement("label");
    seatsLabel.textContent = "Antal sæder pr. række";
    seatsLabel.setAttribute("for", "seatsInput");
    createTheatreDiv.appendChild(seatsLabel);

    const seatsInput = document.createElement("input");
    seatsInput.id = "seatsInput";
    seatsInput.type = "number";
    seatsInput.placeholder = "F.eks. 15";
    seatsInput.classList.add("form-input");
    createTheatreDiv.appendChild(seatsInput);

    // --- Submit Button ---
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Tilføj sal";
    submitBtn.classList.add("btn", "btn-submit");

    submitBtn.addEventListener("click", async function () {
        if (!cinemaSelect.value || !nameInput.value || !rowsInput.value || !seatsInput.value) {
            alert("Udfyld alle felter");
            return;
        }

        const response = await fetch(`${window.config.API_BASE_URL}/api/theatres/dto`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: nameInput.value,
                rows: parseInt(rowsInput.value),
                seatPrRow: parseInt(seatsInput.value),
                cinemaId: parseInt(cinemaSelect.value),
            }),
        });

        if (!response.ok) {
            alert("Noget gik galt under tilføjelsen af salen");
        } else {
            alert("Sal tilføjet!");
            await displayManageTheatre();
        }
    });

    createTheatreDiv.appendChild(submitBtn);
    componentPanel.appendChild(createTheatreDiv);

    // --- Display Existing Theatres ---
    const theatreDisplayDiv = document.createElement("div");
    theatreDisplayDiv.classList.add("employee-display");

    const theatreHeading = document.createElement("h1");
    theatreHeading.textContent = "Alle sale";
    theatreHeading.classList.add("form-heading");
    theatreDisplayDiv.appendChild(theatreHeading);

    const theatreTable = document.createElement("table");
    theatreTable.classList.add("employee-table");

    const headerRow = document.createElement("tr");
    ["Salnavn", "Biograf", "Rækker", "Sæder pr. række", "Handling"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    theatreTable.appendChild(headerRow);

    // Fetch existing theatres
    const theatreResponse = await fetch(`${window.config.API_BASE_URL}/api/theatres/dto`);
    if (!theatreResponse.ok) {
        alert("Kunne ikke indlæse sale");
    } else {
        const theatreData = await theatreResponse.json();

        for (const theatre of theatreData) {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = theatre.name || "N/A";
            row.appendChild(nameCell);

            const cinemaCell = document.createElement("td");
            cinemaCell.textContent = theatre.cinemaName || "Ukendt biograf";
            row.appendChild(cinemaCell);

            const rowsCell = document.createElement("td");
            rowsCell.textContent = theatre.rows || "0";
            row.appendChild(rowsCell);

            const seatsCell = document.createElement("td");
            seatsCell.textContent = theatre.seatPrRow || "0";
            row.appendChild(seatsCell);

            const actionsCell = document.createElement("td");
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Slet sal";
            deleteBtn.classList.add("btn", "btn-delete");

            deleteBtn.addEventListener("click", async () => {
                const confirmed = confirm("Er du sikker på du vil slette denne sal?");
                if (!confirmed) return;

                const delResponse = await fetch(`${window.config.API_BASE_URL}/api/theatres/${theatre.id}`, {
                    method: "DELETE",
                });

                if (delResponse.ok) {
                    alert("Sal slettet");
                    return await displayManageTheatre();
                } else {
                    alert("Noget gik galt ved sletning");
                }
            });

            actionsCell.appendChild(deleteBtn);
            row.appendChild(actionsCell);

            theatreTable.appendChild(row);
        }
    }

    theatreDisplayDiv.appendChild(theatreTable);
    componentPanel.appendChild(theatreDisplayDiv);
    app.appendChild(componentPanel);
}
