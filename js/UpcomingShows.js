import {createHeader} from "./landingpage.js";


const app = document.getElementById("app")
export async function displayUpcomingShows(movieId, cinemaId){
    app.innerHTML = "";

app.appendChild(createHeader())



}