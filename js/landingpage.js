import {displayLoginForm} from "./login.js";
import {loadStylesheet} from "./resuableFunctions.js";
const app = document.getElementById("app");

export async function renderPage() {

    loadStylesheet("/css/landingpageStyle.css")

    let movies;

    try {
        const response = await fetch("http://localhost:8080/api/movies");
        if (!response.ok) {
            throw new Error("Kunne ikke hente filmene");
        }
        movies = await response.json();
    } catch (err) {
        app.innerHTML = `<p>${err.message}</p>`;
        return;
    }

    // Clear app content
    app.innerHTML = "";

    // Append components
    app.appendChild(createHeader());
    app.appendChild(createHeroSection());
    app.appendChild(createMoviesSection(movies));
    app.appendChild(createFooter());
}


function createHeader() {
    const header = document.createElement("header");
    header.className = "site-header";

    const logo = document.createElement("div");
    logo.className = "logo";
    logo.textContent = "KinoXP";

    const nav = document.createElement("nav");
    const ul = document.createElement("ul");

    // Helper to create nav item
    function createNavItem(text, href = "#", onClick = null) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = href;
        a.textContent = text;
        if (onClick) {
            a.addEventListener("click", onClick);
        }
        li.appendChild(a);
        return li;
    }

    ul.appendChild(createNavItem("Biografer"));
    ul.appendChild(createNavItem("Om os"));

    // Login nav item with a click handler
    const loginNavItem = createNavItem("Login", "#", async (e) => {
        e.preventDefault();
        // Call your imported displayLoginForm here
        await displayLoginForm();
    });

    ul.appendChild(loginNavItem);

    nav.appendChild(ul);
    header.appendChild(logo);
    header.appendChild(nav);

    return header;
}

function createHeroSection() {
    const section = document.createElement("section");
    section.className = "hero";

    const heroText = document.createElement("div");
    heroText.className = "hero-text";

    const h1 = document.createElement("h1");
    h1.textContent = "En biograf oplevelse du aldrig glemmer";

    const p = document.createElement("p");
    p.textContent = "Kom i KinoXP og bliv forkælet";

    const button = document.createElement("button");
    button.className = "cta";
    button.textContent = "Book billet";
    button.addEventListener("click", function (){
        alert("Ikke lavet endnu")
    })

    heroText.append(h1, p, button);

    const heroImg = document.createElement("div");
    heroImg.className = "hero-img";

    const img = document.createElement("img");
    img.src = "/pictures/bio.png";
    img.alt = "Biograf sal";

    heroImg.appendChild(img);

    section.append(heroText, heroImg);

    return section;
}

function createMoviesSection(movies) {
    const section = document.createElement("section");
    section.className = "movies";

    const h2 = document.createElement("h2");
    h2.textContent = "Film";

    const grid = document.createElement("div");
    grid.className = "movie-grid";

    movies.forEach(movie => {
        const card = document.createElement("div");
        card.className = "movie-card";

        const img = document.createElement("img");
        img.src = movie.posterImage;
        img.alt = `Poster for ${movie.title}`;

        const title = document.createElement("h3");
        title.textContent = movie.title;

        const button = document.createElement("button");
        button.textContent = "Se tider";
        button.addEventListener("click", () => {
            alert("Tilføj funktion")
        });

        card.append(img, title, button);
        grid.appendChild(card);
    });

    section.append(h2, grid);
    return section;
}

function createFooter() {
    const footer = document.createElement("footer");
    footer.className = "site-footer";

    const logo = document.createElement("div");
    logo.className = "footer-logo";
    logo.textContent = "KinoXP";

    const p = document.createElement("p");
    p.textContent = "Vi ejer selvfølgelig rettighederne til alle vores film";

    footer.append(logo, p);
    return footer;
}


