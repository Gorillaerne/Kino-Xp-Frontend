import {createHeader} from "./landingpage.js";

const app = document.getElementById("app")



export async function displayUpcomingShows(movieId, cinemaId){
    app.innerHTML = "";

    const cinemaResponse = await fetch("http://localhost:8080/api/cinemas/" + cinemaId)
    const cinemaData = await cinemaResponse.json();

app.appendChild(createHeader())

    const headingDiv = document.createElement("div")
    const heading = document.createElement("h1")
    headingDiv.classList.add("upcomingshows-headingdiv")
    heading.textContent="Kommende forestillinger i " + cinemaData.name
    headingDiv.appendChild(heading)
    app.appendChild(headingDiv)


    const filterDiv = document.createElement("div")
    filterDiv.classList.add("filter-div")
    const activeMovieResponse = await fetch("http://localhost:8080/api/movies/active/"+cinemaData.id)
    const activeMovieData = await activeMovieResponse.json();

console.log(activeMovieData)

    const movieFilterSelect = document.createElement("select")
    const standardOption = document.createElement("option")
    standardOption.textContent = "Vælg film"
    standardOption.value = null;
movieFilterSelect.appendChild(standardOption)



    for (let mov of activeMovieData){
        const option = document.createElement("option")
        option.textContent = mov.title
        option.value = mov.id
        movieFilterSelect.appendChild(option)
    }

    if (movieId !== null && movieId !== undefined) {
        let movieFound = false;

        for (let mov of activeMovieData) {
            if (movieId === mov.id) {
                movieFilterSelect.value = movieId;
                movieFound = true;
                break;
            }
        }

        if (!movieFound) {
            alert("Denne biograf viser ikke denne film");
            movieFilterSelect.selectedIndex = 0;
        }
    } else {
        movieFilterSelect.selectedIndex = 0;
    }

    filterDiv.appendChild(movieFilterSelect)
    app.appendChild(filterDiv)



    const movieTimesDiv = document.createElement("div")








}