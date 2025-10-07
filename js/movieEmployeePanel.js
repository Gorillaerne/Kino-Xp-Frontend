import {displayLoginForm} from "./login.js";
import {displayEmployeePanel} from "./employeepanel.js";


const app = document.getElementById("app")


export async function displayMovieEmployeePanel(){
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

// ---- Create New Movie Form ----
    const createNewMovieFormDiv = document.createElement("div")
    createNewMovieFormDiv.classList.add("create-movie-form")

    const createNewMovieHeading = document.createElement("h1")
    createNewMovieHeading.textContent = "Opret ny Film"
    createNewMovieHeading.classList.add("form-heading")
    createNewMovieFormDiv.appendChild(createNewMovieHeading)

// Title input
    const titleLabel = document.createElement("label")
    titleLabel.textContent = "Titel"
    titleLabel.setAttribute("for", "titleInput")
    createNewMovieFormDiv.appendChild(titleLabel)

    const titleInput = document.createElement("input")
    titleInput.id = "titleInput"
    titleInput.type = "text"
    titleInput.placeholder = "Titel"
    titleInput.classList.add("form-input")
    createNewMovieFormDiv.appendChild(titleInput)

// Duration input
    const durationLabel = document.createElement("label")
    durationLabel.textContent = "Filmens længde"
    durationLabel.setAttribute("for", "durationInput")
    createNewMovieFormDiv.appendChild(durationLabel)

    const durationInput = document.createElement("input")
    durationInput.id = "durationInput"
    durationInput.type = "time"
    durationInput.placeholder = "Filmens længde"
    durationInput.classList.add("form-input")
    createNewMovieFormDiv.appendChild(durationInput)

// Description input
    const descriptionLabel = document.createElement("label")
    descriptionLabel.textContent = "Beskrivelse"
    descriptionLabel.setAttribute("for", "descriptionInput")
    createNewMovieFormDiv.appendChild(descriptionLabel)

    const descriptionInput = document.createElement("textarea")
    descriptionInput.id = "descriptionInput"
    descriptionInput.placeholder = "Beskrivelse"
    descriptionInput.classList.add("form-input")
    descriptionInput.classList.add("descriptionArea")
    createNewMovieFormDiv.appendChild(descriptionInput)

// Age requirement input
    const ageLimitLabel = document.createElement("label")
    ageLimitLabel.textContent = "Minimum alder"
    ageLimitLabel.setAttribute("for", "ageLimitInput")
    createNewMovieFormDiv.appendChild(ageLimitLabel)

    const ageLimitInput = document.createElement("input")
    ageLimitInput.id = "ageLimitInput"
    ageLimitInput.type = "number"
    ageLimitInput.placeholder = "Minimum alder"
    ageLimitInput.classList.add("form-input")
    createNewMovieFormDiv.appendChild(ageLimitInput)

// Category select
    const categoryLabel = document.createElement("label")
    categoryLabel.textContent = "Kategori"
    categoryLabel.setAttribute("for", "categorySelect")
    createNewMovieFormDiv.appendChild(categoryLabel)

    const categorySelect = document.createElement("select")
    categorySelect.id = "categorySelect"
    categorySelect.classList.add("form-select")

// Fetch categories from backend (enums)
    const categoryResponse = await fetch(`${window.config.API_BASE_URL}` +"/api/movies/categories")
    const categoryData = await categoryResponse.json();
    if (!categoryData){
        alert("Noget gik galt med indsamlingen af kategorier")
    }
    for (let cat of categoryData){
        const option = document.createElement("option")
        option.textContent = cat.name
        option.value = cat.value
        categorySelect.appendChild(option)
    }
    createNewMovieFormDiv.appendChild(categorySelect)

// Poster input
    const posterLabel = document.createElement("label")
    posterLabel.textContent = "Vælg filmplakat"
    posterLabel.setAttribute("for", "posterInput")
    createNewMovieFormDiv.appendChild(posterLabel)

    const posterInput = document.createElement("input")
    posterInput.id = "posterInput"
    posterInput.type = "file"
    posterInput.accept = "image/*"
    posterInput.classList.add("form-input")
    createNewMovieFormDiv.appendChild(posterInput)

// Submit button
    const submitBtn = document.createElement("button")
    submitBtn.textContent = "Opret film"
    submitBtn.classList.add("btn", "btn-submit")
    submitBtn.addEventListener("click", async function () {

        if (!titleInput.value || !durationInput.value || !descriptionInput.value || !posterInput.files.length > 0 || !categorySelect.value ||!ageLimitInput.value){
            alert("Udfyld alle felter")
return  await displayMovieEmployeePanel()
        }

        let posterBase64 = null;
        if (posterInput.files.length > 0) {
            posterBase64 = await toBase64(posterInput.files[0]);
        }

        const response = await fetch(`${window.config.API_BASE_URL}` +"/api/movies",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "title" : titleInput.value,
                "duration" : durationInput.value,
                "description" : descriptionInput.value,
                "posterImage" : posterBase64,
                "category" : categorySelect.value,
                "ageLimit" : ageLimitInput.value
            })
        })

        if (!response.ok){
            alert("Noget gik galt med oprettelse af film")
        } else {
            alert("Film oprettet")
            return await displayMovieEmployeePanel()
        }
    })
    createNewMovieFormDiv.appendChild(submitBtn)
    componentPanel.appendChild(createNewMovieFormDiv)



// ---- Movie Display Table ----
    const movieDisplayDiv = document.createElement("div");
    movieDisplayDiv.classList.add("movie-display");

    const movieTableHeader = document.createElement("h1");
    movieTableHeader.textContent = "Alle Film";
    movieTableHeader.classList.add("form-heading");
    movieDisplayDiv.appendChild(movieTableHeader);

    const movieTable = document.createElement("table");
    movieTable.classList.add("movie-table");

    const headerRow = document.createElement("tr");
// Added "Aldersgrænse" to header
    ["Plakat", "Titel", "Kategori", "Varighed", "Aldersgrænse", "Beskrivelse", "Handlinger"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });
    movieTable.appendChild(headerRow);

// Fetch movies
    const movieResponse = await fetch(`${window.config.API_BASE_URL}` +"/api/movies");
    const movieData = await movieResponse.json();

    for (let movie of movieData) {
        const row = document.createElement("tr");

        // Poster cell
        const posterCell = document.createElement("td");
        if (movie.posterImage) {
            const img = document.createElement("img");
            img.src = movie.posterImage;
            img.alt = "Poster";
            img.style.width = "80px";
            img.style.height = "auto";
            img.style.borderRadius = "6px";
            posterCell.appendChild(img);
        } else {
            posterCell.textContent = "N/A";
        }
        row.appendChild(posterCell);

        // Title cell
        const titleCell = document.createElement("td");
        titleCell.textContent = movie.title || "N/A";
        row.appendChild(titleCell);

        // Category cell
        const categoryCell = document.createElement("td");
        categoryCell.textContent = movie.category || "N/A";
        row.appendChild(categoryCell);

        // Duration cell
        const durationCell = document.createElement("td");
        durationCell.textContent = movie.duration ? movie.duration.split(':')[0] + " timer og " + movie.duration.split(':')[1] + " minutter": "N/A";
        row.appendChild(durationCell);

        // Age limit cell
        const ageLimitCell = document.createElement("td");
        ageLimitCell.textContent = movie.ageLimit ? movie.ageLimit + "+" : "N/A"; // Assumes ageLimit is stored in movie.ageLimit
        row.appendChild(ageLimitCell);

        // Description cell
        const descCell = document.createElement("td");
        descCell.textContent = movie.description || "N/A";
        row.appendChild(descCell);

        // Actions cell
        const actionsCell = document.createElement("td");
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Fjern";
        removeBtn.classList.add("btn", "btn-delete");

        removeBtn.addEventListener("click", async () => {
            const confirmed = confirm("Er du sikker på du vil slette denne film?");
            if (!confirmed) return;

            const delResponse = await fetch(`${window.config.API_BASE_URL}` +"/api/movies/" + movie.id, {
                method: "DELETE"
            });

            if (delResponse.ok) {
                alert("Film slettet");
                await displayMovieEmployeePanel(); // Refresh
            } else {
                alert("Noget gik galt med sletning");
            }
        });

        actionsCell.appendChild(removeBtn);
        row.appendChild(actionsCell);

        movieTable.appendChild(row);
    }

    movieDisplayDiv.appendChild(movieTable);
    componentPanel.appendChild(movieDisplayDiv);
    app.appendChild(componentPanel);

}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file); // encodes as base64 with "data:image/png;base64,..."
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}