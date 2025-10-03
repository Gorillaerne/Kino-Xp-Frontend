

async function fetchMovies() {
    try {
        const response = await fetch("http://localhost:8080/api/movies");
        if (!response.ok) throw new Error("Kunne ikke hente filmene");
        const movies = await response.json();
        renderPage(movies);
    } catch (err) {
        document.getElementById("app").innerHTML = `<p>${err.message}</p>`;
    }
}

function renderPage(movies) {
    const app = document.getElementById("app");

    app.innerHTML = `
    <header class="site-header">
      <div class="logo">KinoXP</div>
      <nav>
        <ul>
          <li><a href="#">Biografer</a></li>
          <li><a href="#">Om os</a></li>
          <li><a href="#">Login</a></li>
        </ul>
      </nav>
    </header>

    <section class="hero">
      <div class="hero-text">
        <h1>En biograf oplevelse du aldrig glemmer</h1>
        <p>Kom i KinoXP og bliv forkælet</p>
        <button class="cta">Book billet</button>
      </div>
      <div class="hero-img">
        <img src="/pictures/bio.png" alt="Biograf sal">
      </div>
    </section>

    <section class="movies">
      <h2>Film</h2>
      <div class="movie-grid">
        ${movies.map(movie => `
          <div class="movie-card">
            <img src="${movie.posterImage}" alt="Poster for ${movie.title}">
            <h3>${movie.title}</h3>
            <button onclick="window.location.href='movie.html?id=${movie.id}'">
              Se tider
            </button>
          </div>
        `).join("")}
      </div>
    </section>

    <footer class="site-footer">
      <div class="footer-logo">KinoXP</div>
      <p>Vi ejer selvfølgelig rettighederne til alle vores film</p>
    </footer>
  `;
}

fetchMovies();
