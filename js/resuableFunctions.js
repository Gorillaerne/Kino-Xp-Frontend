
import {displayUpcomingShows} from "./UpcomingShows.js";
import {API_BASE_URL} from "./config.js";

const app = document.getElementById("app")

export function loadStylesheet(href) {
    // Remove existing page-specific stylesheet if any
    const oldLink = document.getElementById("page-specific-style");
    if (oldLink) oldLink.remove();

    // Create new link element
    const link = document.createElement("link");
    link.id = "page-specific-style";
    link.rel = "stylesheet";
    link.href = href;

    document.head.appendChild(link);
}


export async function chooseCinemaOverlay(movieId) {
    let data;

    if (movieId){
        const response = await fetch(API_BASE_URL +"/api/cinemas/displaying/" + movieId)
        data = await response.json()
    }else {
        const response = await fetch(API_BASE_URL +"/api/cinemas")
        data = await response.json()
    }


    // Overlay background
    const overlay = document.createElement("div")
    overlay.classList.add("overlay")

    // Popup container
    const popup = document.createElement("div")
    popup.classList.add("popup")

    const heading = document.createElement("h1")
    heading.classList.add("popup-title")
    heading.textContent = "Vælg biograf"
    popup.appendChild(heading)

    const cinemaSelector = document.createElement("select")
    cinemaSelector.classList.add("popup-select")

    for (let bio of data) {
        const option = document.createElement("option")
        option.textContent = bio.name
        option.value = bio.id
        cinemaSelector.appendChild(option)
    }
    popup.appendChild(cinemaSelector)

    const submitBtn = document.createElement("button")
    submitBtn.classList.add("popup-button")
    submitBtn.textContent = "Vælg"
    submitBtn.addEventListener("click", async function () {
        if (movieId) {
            return await displayUpcomingShows(movieId, cinemaSelector.value)
        } else {
            return await displayUpcomingShows(null, cinemaSelector.value)
        }
    })
    popup.appendChild(submitBtn)

    overlay.appendChild(popup)


    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            app.removeChild(overlay);
        }
    });
    return overlay;
}




