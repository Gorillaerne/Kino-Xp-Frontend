import {displayLoginForm} from "./login.js";

const app = document.getElementById("app")



export async function displayShowEmployeePanel(){

    //Tjekker først om user er logget ind
app.innerHTML = ""
    if (!localStorage.getItem("user")){
        await displayLoginForm()
    }
    const user = JSON.parse(localStorage.getItem("user"))


    //opretter div til at holde alle components
    const componentPanel = document.createElement("div")

    //første component
    const createNewShowFormDiv = document.createElement("div")

    const createNewShowHeading = document.createElement("h1")
    createNewShowHeading.textContent = "Opret ny Forestilling"
    createNewShowFormDiv.appendChild(createNewShowHeading)

    const playTimeInput = document.createElement("input")
    playTimeInput.type="datetime-local"
    createNewShowFormDiv.appendChild(playTimeInput)

    const chooseMovieInput = document.createElement("select")
    const response = await fetch("http://localhost:8080/api/movies")
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
     const theatreResponse = await fetch("http://localhost:8080/api/users/" + user.id)
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
    submitBtn.addEventListener("click",async function (){
        const response = await fetch("http://localhost:8080/api/shows",{
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

    //tilføjet første component
componentPanel.appendChild(createNewShowFormDiv)

// andede component til visningen af alle shows med delete
    const showDisplayDiv = document.createElement("div");

    const showTable = document.createElement("table");
    showTable.style.width = "100%";
    showTable.border = "1";

    const headerRow = document.createElement("tr");
    ["Movie", "Theatre", "Show Time", "Actions"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    showTable.appendChild(headerRow);

    // Fetch all shows
    const showResponse = await fetch("http://localhost:8080/api/shows");
    const showData = await showResponse.json();

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
        removeBtn.style.color = "red";

        removeBtn.addEventListener("click", async () => {
            const confirmed = confirm("Er du sikker på du vil slette denne forestilling?");
            if (!confirmed) return;

            const delResponse = await fetch(`http://localhost:8080/api/shows/${show.id}`, {
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
















    app.appendChild(componentPanel)
}