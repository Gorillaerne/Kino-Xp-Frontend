import {displayLoginForm} from "./login.js";

const app = document.getElementById("app")



export async function displayCreateNewShowForm(){
app.innerHTML = ""
    if (!localStorage.getItem("user")){
        await displayLoginForm()
    }

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
        movieOption.value = JSON.stringify(movie)
chooseMovieInput.appendChild(movieOption)
    }
    createNewShowFormDiv.appendChild(chooseMovieInput)







    app.appendChild(createNewShowFormDiv)
}