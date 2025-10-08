import {createHeader, createFooter} from "./landingpage";
import {loadStylesheet} from "./resuableFunctions";




export function displayBiografer(){

    loadStylesheet("/css/landingpageStyle.css")

    const app = document.getElementById("app");
    app.innerHTML = "";


    app.appendChild(createHeader());



    app.appendChild(createFooter());
}

