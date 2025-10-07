import {displayLoginForm} from "./login.js";
import {displayEmployeePanel} from "./employeepanel.js";


const app = document.getElementById("app")

export async function displayShowEmployeePanel(){
    app.innerHTML = ""
    if (!localStorage.getItem("user")){
        await displayLoginForm()
    }
    const user = JSON.parse(localStorage.getItem("user"))

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


    // Container for everything
    const componentPanel = document.createElement("div")
    componentPanel.classList.add("employee-panel")

    // ---- Create New Show Form ----
    const createNewShowFormDiv = document.createElement("div")
    createNewShowFormDiv.classList.add("create-show-form")

    const createNewShowHeading = document.createElement("h1")
    createNewShowHeading.textContent = "Opret ny Forestilling"
    createNewShowHeading.classList.add("form-heading")
    createNewShowFormDiv.appendChild(createNewShowHeading)

    const playTimeInput = document.createElement("input")
    playTimeInput.type = "datetime-local"
    playTimeInput.classList.add("form-input")
    createNewShowFormDiv.appendChild(playTimeInput)

    const chooseMovieInput = document.createElement("select")
    chooseMovieInput.classList.add("form-select")
    const response = await fetch(`${window.config.API_BASE_URL}` +"/api/movies")
    const data = await response.json();
    if (!data){
        alert("noget gik galt med indsamlingen af film")
    }

    for (let movie of data){
        const movieOption = document.createElement("option")
        movieOption.textContent = movie.title
        movieOption.value = movie.id
        chooseMovieInput.appendChild(movieOption)
    }
    createNewShowFormDiv.appendChild(chooseMovieInput)

    const chooseTheaterInput = document.createElement("select")
    chooseTheaterInput.classList.add("form-select")
    console.log(`${window.config.API_BASE_URL}` + "api/users/" + user.id)
    const theatreResponse = await fetch(`${window.config.API_BASE_URL}` + "/api/users/" + user.id)
    const theatreData = await theatreResponse.json();
    if (!theatreData){
        alert("noget gik galt med indsamlingen af sale")
    }
    for (let cinema of theatreData.cinemas){
        const cinemaName = cinema.name;
        for (let theatre of cinema.theatreList){
            const theatreOption = document.createElement("option")
            theatreOption.textContent = cinemaName + ": " + theatre.name
            theatreOption.value = theatre.id
            chooseTheaterInput.appendChild(theatreOption)
        }
    }
    createNewShowFormDiv.appendChild(chooseTheaterInput)

    const submitBtn = document.createElement("button")
    submitBtn.textContent = "Opret forestilling"
    submitBtn.classList.add("btn", "btn-submit")
    submitBtn.addEventListener("click", async function (){

        if (!playTimeInput.value || !chooseTheaterInput.value || !chooseMovieInput.value){
            alert("Udfyld alle felter!")
            return await displayShowEmployeePanel()
        }

        const response = await fetch(`${window.config.API_BASE_URL}` +"/api/shows",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "showTime" : playTimeInput.value,
                "theatre_id" : chooseTheaterInput.value,
                "movie_id" : chooseMovieInput.value
            })
        })

        if (!response.ok){
            alert("noget gik galt med oprettelse af show")
        }else {
            alert("Forestilling oprettet")
            await displayShowEmployeePanel()
        }
    })
    createNewShowFormDiv.appendChild(submitBtn)
    componentPanel.appendChild(createNewShowFormDiv)

    // ---- Show Display Table ----
    const showDisplayDiv = document.createElement("div");
    showDisplayDiv.classList.add("show-display")

    const showTableHeader = document.createElement("h1")
    showTableHeader.textContent = "Kommende forstillinger"
    showTableHeader.classList.add("form-heading")
    showDisplayDiv.appendChild(showTableHeader)

    const showTable = document.createElement("table");
    showTable.classList.add("show-table")

    const headerRow = document.createElement("tr");
    ["Movie", "Theatre", "Show Time", "Actions"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    showTable.appendChild(headerRow);

    // Fetch shows
    const showResponse = await fetch(`${window.config.API_BASE_URL}` +"/api/shows");
    const showData = await showResponse.json();
    showData.sort((a, b) => new Date(a.showTime) - new Date(b.showTime));

    for (let show of showData) {
        const row = document.createElement("tr");

        const movieCell = document.createElement("td");
        movieCell.textContent = show.movie?.title || "N/A";
        row.appendChild(movieCell);

        const theatreCell = document.createElement("td");
        theatreCell.textContent = show.theatre?.name || "N/A";
        row.appendChild(theatreCell);

        const timeCell = document.createElement("td");
        timeCell.textContent = new Date(show.showTime).toLocaleString();
        row.appendChild(timeCell);

        const actionsCell = document.createElement("td");
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Fjern";
        removeBtn.classList.add("btn", "btn-delete")

        removeBtn.addEventListener("click", async () => {
            const confirmed = confirm("Er du sikker på du vil slette denne forestilling?");
            if (!confirmed) return;
            const delResponse = await fetch(`${window.config.API_BASE_URL}` +"/api/shows/"+ show.id, {
                method: "DELETE"
            });

            if (delResponse.ok) {
                alert("Forestilling slettet");
                await displayShowEmployeePanel(); // Refresh
            } else {
                alert("Noget gik galt med sletning");
            }
        });

        actionsCell.appendChild(removeBtn);
        row.appendChild(actionsCell);

        showTable.appendChild(row);
    }

    showDisplayDiv.appendChild(showTable);
    componentPanel.appendChild(showDisplayDiv)

    app.appendChild(componentPanel)
}
