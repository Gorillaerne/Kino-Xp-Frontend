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
    standardOption.textContent = "Se alle";
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

            // 🎞️ Table showing 7 days
            const dateTable = document.createElement("table");
            dateTable.classList.add("date-table");

            const headerRow = document.createElement("tr");
            const showtimeRow = document.createElement("tr");

            const today = new Date();

            for (let i = 0; i < 7; i++) {
                const futureDate = new Date(today);
                futureDate.setDate(today.getDate() + i);

                // Format as "Mon 6 Oct"
                const options = { weekday: "short", day: "numeric", month: "short" };
                const formattedDate = futureDate.toLocaleDateString("da-DK", options);

                // Date cell
                const dateCell = document.createElement("th");
                dateCell.textContent = formattedDate;
                dateCell.classList.add("date-cell");
                headerRow.appendChild(dateCell);

                // 🎟️ Cell for multiple showtimes
                const showtimeCell = document.createElement("td");
                showtimeCell.classList.add("showtime-cell");

                // Fetch shows for this movie/date (if you have an endpoint like this)
                const dateStr = futureDate.toISOString().split("T")[0]; // e.g. 2025-10-05
                try {
                    const showResponse = await fetch(`http://localhost:8080/api/shows/` + cinemaId + "/"+ movie.id +  "/"+dateStr);
                    if (showResponse.ok) {
                        const showData = await showResponse.json();

                        if (showData.length > 0) {
                            for (let show of showData) {
                                const showBtn = document.createElement("button");
                                showBtn.textContent = show.showTime; // e.g. "19:30"
                                showBtn.classList.add("showtime-btn");

                                showBtn.addEventListener("click", () => {
                                    alert("Tilføj dette")
                                });

                                showtimeCell.appendChild(showBtn);
                            }
                        } else {
                            showtimeCell.textContent = "Ingen forestillinger";
                            showtimeCell.classList.add("no-showtime");
                        }
                    } else {
                        showtimeCell.textContent = "Fejl";
                    }
                } catch (err) {
                    showtimeCell.textContent = "Fejl ved hentning";
                }

                showtimeRow.appendChild(showtimeCell);
            }

            dateTable.appendChild(headerRow);
            dateTable.appendChild(showtimeRow);
            singularUpcomingMovieDiv.appendChild(dateTable);
            containerDiv.appendChild(singularUpcomingMovieDiv);
        }
    } else {
        // Show screenings for specific movie (future expansion)
        const response = await fetch("http://localhost:8080/api/movies/" + movieId);
        const movieData = await response.json();
        const singularUpcomingMovieDiv = document.createElement("div");
        singularUpcomingMovieDiv.classList.add("upcoming-movie");

        const movieSection = document.createElement("div");
        movieSection.classList.add("movie-section");

        const moviePoster = document.createElement("img");
        moviePoster.src = movieData.posterImage;
        moviePoster.alt = movieData.title;

        const movieName = document.createElement("h2");
        movieName.textContent = movieData.title;

        movieSection.appendChild(moviePoster);
        movieSection.appendChild(movieName);
        singularUpcomingMovieDiv.appendChild(movieSection);

        containerDiv.appendChild(singularUpcomingMovieDiv);
    }
}
