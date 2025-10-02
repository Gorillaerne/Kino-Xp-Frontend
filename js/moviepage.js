
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id") || 1;


async function fetchMovie(id) {
    try {
        const response = await fetch(`http://localhost:8080/api/movies/${id}`);
        if (!response.ok) {
            throw new Error("Kunne ikke hente filmen");
        }
        const movie = await response.json();
        renderMovie(movie);

    } catch (error) {
        alert(error.message);
        console.log(error);
    }
}

    function renderMovie(movie){
        const app = document.getElementById("app");

        app.innerHTML = `
        <div class="movie-app">
        <div class="movie-box">
      <h1>${movie.title}</h1>
      <img src="${movie.posterImage}" alt="Poster for ${movie.title}" style="max-width:200px;">
      <p><strong>Beskrivelse:</strong> ${movie.description}</p>
      <p><strong>Kategori:</strong> ${movie.category}</p>
      <p><strong>Varighed:</strong> ${movie.duration}</p>
      <p><strong>Aldersgrænse:</strong> ${movie.ageLimit}+</p>
          </div>
       </div>
       `;
    }

    fetchMovie(movieId);
