import {createHeader, renderPage} from "./landingpage.js";
import {displaySeatReservation} from "./SeatReservation.js";

const app = document.getElementById("app");

export async function displayUpcomingShows(movieId, cinemaId) {
    app.innerHTML = "";





    // Create a reusable container for show listings
    const upcomingShowsHolderDiv = document.createElement("div");

    // Fetch cinema info
    const cinemaResponse = await fetch(`${window.config.API_BASE_URL}` +`/api/cinemas/${cinemaId}`);
    const cinemaData = await cinemaResponse.json();

    // Header
    app.appendChild(createHeader());


    const headingDiv = document.createElement("div");
    const heading = document.createElement("h1");
    headingDiv.classList.add("upcomingshows-headingdiv");
    heading.textContent = "Kommende forestillinger i " + cinemaData.name;
    headingDiv.appendChild(heading);

    const backbutton = document.createElement("img")
    backbutton.src = "pictures/backbutton.png"
    backbutton.classList.add("back-button");
    backbutton.addEventListener("click", async function(){
        return await renderPage()
    })
   headingDiv.appendChild(backbutton)







    app.appendChild(headingDiv);

    // Filter section
    const filterDiv = document.createElement("div");
    filterDiv.classList.add("filter-div");

    const activeMovieResponse = await fetch(`${window.config.API_BASE_URL}`+`/api/movies/active/${cinemaData.id}`);
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

    // If no specific movie selected → show all active movies
    if (!movieId) {
        const response = await fetch(`${window.config.API_BASE_URL}` +`/api/movies/active/${cinemaId}`);
        const movieData = await response.json();

        for (let movie of movieData) {
            await renderMovieShows(cinemaId, movie, containerDiv);
        }
    }
    // Otherwise, show only the selected movie
    else {
        const response = await fetch(`${window.config.API_BASE_URL}` +`/api/movies/${movieId}`);
        const movieData = await response.json();
        await renderMovieShows(cinemaId, movieData, containerDiv);
    }
}

// Helper function to render 7 days of shows for one movie
async function renderMovieShows(cinemaId, movie, containerDiv) {
    const singularUpcomingMovieDiv = document.createElement("div");
    singularUpcomingMovieDiv.classList.add("upcoming-movie");

    // 🎬 Movie section
    const movieSection = document.createElement("div");
    movieSection.classList.add("movie-section");

    const moviePoster = document.createElement("img");
    moviePoster.src = movie.posterImage;
    moviePoster.alt = movie.title;

    const movieName = document.createElement("h2");
    movieName.textContent = movie.title;

    const movieDescription = document.createElement("a")
    movieDescription.textContent = "Varighed: " + movie.duration.substring(1, 5).split(":")[0] + " T " +movie.duration.substring(1, 5).split(":")[1] + " Min" + " - Aldersgrænse:  " +movie.ageLimit + " år.";


    movieSection.appendChild(moviePoster);
    movieSection.appendChild(movieName);
    movieSection.appendChild(movieDescription)
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

        const options = { weekday: "short", day: "numeric", month: "short" };
        const formattedDate = futureDate.toLocaleDateString("da-DK", options);

        // Date header cell
        const dateCell = document.createElement("th");
        dateCell.textContent = formattedDate;
        dateCell.classList.add("date-cell");
        headerRow.appendChild(dateCell);

        // Showtime cell
        const showtimeCell = document.createElement("td");
        showtimeCell.classList.add("showtime-cell");

        // Fetch shows for this date
        const dateStr = futureDate.toISOString().split("T")[0];
        try {
            const showResponse = await fetch(`${window.config.API_BASE_URL}` +`/api/shows/${cinemaId}/${movie.id}/${dateStr}`);
            if (showResponse.ok) {
                const showData = await showResponse.json();
                showData.sort((a, b) => new Date(a.showTime) - new Date(b.showTime));

                if (showData.length > 0) {
                    for (let show of showData) {
                        console.log(show)
                        const showBtn = document.createElement("div");
                        const showHeading = document.createElement("h3")
                        showHeading.textContent = "Kl. " +show.showTime.split("T")[1]?.substring(0, 5) || show.showTime;

                        showBtn.textContent = show.theatre.name // e.g. "19:30"
                        showBtn.classList.add("showtime-btn");
                        showBtn.appendChild(showHeading)

                        showBtn.addEventListener("click", async function() {
                                return await displaySeatReservation(show.id,cinemaId,movie.id);
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
