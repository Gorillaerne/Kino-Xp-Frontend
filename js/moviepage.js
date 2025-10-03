
async function fetchMovie(id) {
    try {
        const response = await fetch(`http://localhost:8080/api/movies/${id}`);
        if (!response.ok) throw new Error("Kunne ikke hente filmen");
        const movie = await response.json();
        return movie; // <-- Returner data i stedet for at render
    } catch (error) {
        alert(error.message);
        console.log(error);
    }
}

function renderMovie(movie) {
    const app = document.getElementById("app");
    app.innerHTML = "";

    const movieApp = document.createElement("div");
    movieApp.classList.add("movie-app");

    const movieBox = document.createElement("div");
    movieBox.classList.add("movie-box");

    const title = document.createElement("h1");
    title.textContent = movie.title;

    const poster = document.createElement("img");
    poster.src = movie.posterImage;
    poster.alt = `Poster for ${movie.title}`;
    poster.style.maxWidth = "200px";

    const description = document.createElement("p");
    description.innerHTML = `<strong>Beskrivelse:</strong> ${movie.description}`;

    const category = document.createElement("p");
    category.innerHTML = `<strong>Kategori:</strong> ${movie.category}`;

    const duration = document.createElement("p");
    duration.innerHTML = `<strong>Varighed:</strong> ${movie.duration}`;

    const ageLimit = document.createElement("p");
    ageLimit.innerHTML = `<strong>Aldersgrænse:</strong> ${movie.ageLimit}+`;

    movieBox.append(title, poster, description, category, duration, ageLimit);
    movieApp.appendChild(movieBox);
    app.appendChild(movieApp);
}

export async function goToMoviePage(id) {
    const movie = await fetchMovie(id);
    if (movie) renderMovie(movie);
}
