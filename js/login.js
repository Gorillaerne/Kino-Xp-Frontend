import { displayEmployeePanel } from "./employeepanel.js";
import {loadStylesheet} from "./resuableFunctions.js";
import {renderPage} from "./landingpage.js";

export async function displayLoginForm() {
   loadStylesheet("/css/styles.css")
    const app = document.getElementById("app");
    app.innerHTML = "";

    if (localStorage.getItem("user")) {
        await displayEmployeePanel();
        return;
    }
    const loginHolder = document.createElement("div");
    loginHolder.classList.add("login-card");

    const headerButtonsDiv = document.createElement("div")
    headerButtonsDiv.classList.add("header-container")
    const backbutton = document.createElement("img")
    backbutton.src = "pictures/backbutton.png"
    backbutton.classList.add("back-button");
    backbutton.addEventListener("click", async function(){
        return await renderPage()
    })
    headerButtonsDiv.appendChild(backbutton)


app.appendChild(headerButtonsDiv)


    const header = document.createElement("h1");
    header.textContent = "Medarbejder Login";
    header.classList.add("login-header");

    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.placeholder = "Brugernavn";
    usernameInput.classList.add("login-input");

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.placeholder = "Adgangskode";
    passwordInput.classList.add("login-input");

    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Login";
    submitBtn.classList.add("login-button");

    submitBtn.addEventListener("click", async function () {
        const response = await fetch("http://localhost:8080/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value
            })
        });

        if (!response.ok) {
            alert("Forkert login");
            await displayLoginForm();
        } else {
            const user = await response.json();
            localStorage.setItem("user", JSON.stringify(user));
            alert("Bruger logget ind");
            await displayEmployeePanel();
        }
    });

    loginHolder.appendChild(header);
    loginHolder.appendChild(usernameInput);
    loginHolder.appendChild(passwordInput);
    loginHolder.appendChild(submitBtn);

    app.appendChild(loginHolder);
}
