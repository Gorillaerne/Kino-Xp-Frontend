import { displayLoginForm } from "./login.js"
import { displayCreateNewShowForm } from "./newShowComponent.js"
const app = document.getElementById("app")

export async function displayEmployeePanel(){
    app.innerHTML = ""
    if(!localStorage.getItem("user")){
await displayLoginForm()
    }
    const user = JSON.parse(localStorage.getItem("user"))


const employeePanelDiv = document.createElement("div")

    const employeePanelHeader = document.createElement("h1")
    employeePanelHeader.textContent = "Velkommen " + user.username
    employeePanelDiv.appendChild(employeePanelHeader)


    const employeePanelComponentDiv = document.createElement("div")

    const newShowComponent = document.createElement("div")

    const newShowComponentHeader = document.createElement("h1")
    newShowComponentHeader.textContent = "Opret Ny forestilling"
    newShowComponent.appendChild(newShowComponentHeader)
    newShowComponentHeader.addEventListener("click", await function (){
        alert("skal tilføjes til programmet")
        displayCreateNewShowForm()
    })
    employeePanelComponentDiv.appendChild(newShowComponent)


    //tilføjer alle komponenter til den store div
employeePanelDiv.appendChild(employeePanelComponentDiv)
    app.appendChild(employeePanelDiv)
}