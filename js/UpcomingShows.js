import { createHeader } from "./landingpage.js";

const app = document.getElementById("app");

export async function displayUpcomingShows(movieId, cinemaId) {
    app.innerHTML = "";

    // Create a reusable container for show listings
    const upcomingShowsHolderDiv = document.createElement("div");

    // Fetch cinema info
    const cinemaResponse = await fetch(`http://localhost:8080/api/cinemas/${cinemaId}`);
    const cinemaData = await cinemaResponse.json();

    // Header
    app.appendChild(createHeader());

    const headingDiv = document.createElement("div");
    const heading = document.createElement("h1");
    headingDiv.classList.add("upcomingshows-headingdiv");
    heading.textContent = "Kommende forestillinger i " + cinemaData.name;
    headingDiv.appendChild(heading);
    app.appendChild(headingDiv);

    // Filter section
    const filterDiv = document.createElement("div");
    filterDiv.classList.add("filter-div");

    const activeMovieResponse = await fetch(`http://localhost:8080/api/movies/active/${cinemaData.id}`);
    const activeMovieData = await activeMovieResponse.json();

    const movieFilterSelect = document.createElement("select");
    const standardOption = document.createElement("option");
    standardOption.textContent = "Vælg film";
    standardOption.value = "";
    movieFilterSelect.appendChild(standardOption);

    // Populate movie options
    for (let mov of activeMovieData) {
        const option = document.createElement("option");
        option.textContent = mov.title;
        option.value = mov.id;
        movieFilterSelect.appendChild(option);
    }

    // Preselect if movieId is given
    if (movieId) {
        const found = activeMovieData.find(mov => mov.id === movieId);
        movieFilterSelect.value = found ? movieId : "";
        if (!found) alert("Denne biograf viser ikke denne film");
    }

    // When user selects a movie, refresh content
    movieFilterSelect.addEventListener("change", async () => {
        await updateUpcomingMovies(cinemaId, movieFilterSelect.value, upcomingShowsHolderDiv);
    });

    filterDiv.appendChild(movieFilterSelect);
    app.appendChild(filterDiv);
    app.appendChild(upcomingShowsHolderDiv);

    // Initial render
    await updateUpcomingMovies(cinemaId, movieId, upcomingShowsHolderDiv);
}

async function updateUpcomingMovies(cinemaId, movieId, containerDiv) {
    containerDiv.innerHTML = ""; // Clear old data

    if (!movieId) {
        // Show all active movies
        const response = await fetch(`http://localhost:8080/api/movies/active/${cinemaId}`);
        const movieData = await response.json();

        for (let movie of movieData) {
            const singularUpcomingMovieDiv = document.createElement("div");
            singularUpcomingMovieDiv.classList.add("upcoming-movie");

            const movieSection = document.createElement("div");
            movieSection.classList.add("movie-section");

            const moviePoster = document.createElement("img");
            moviePoster.src = movie.posterImage;
            moviePoster.alt = movie.title;

            const movieName = document.createElement("h2");
            movieName.textContent = movie.title;

            movieSection.appendChild(moviePoster);
            movieSection.appendChild(movieName);
            singularUpcomingMovieDiv.appendChild(movieSection);

            containerDiv.appendChild(singularUpcomingMovieDiv);
        }
    } else {
        // Show screenings for specific movie (future expansion)
        containerDiv.textContent = `Viser forestillinger for valgt film (ID: ${movieId})`;
    }
}
