import { displayEmployeePanel } from "./employeepanel.js";

export async function displayLoginForm(){
    document.getElementById("app").innerHTML = ""

const loginHolder = document.createElement("div")


const header = document.createElement("h1")
header.textContent = "Medarbejder Login"


const usernameInput = document.createElement("input")
usernameInput.type="text";
usernameInput.placeholder = "Brugernavn"


const passwordInput = document.createElement("input")
passwordInput.type="password";
passwordInput.placeholder = "Adgangskode"


const submitBtn = document.createElement("button")
submitBtn.textContent = "Login"
submitBtn.addEventListener("click", async function (){

const response = await fetch("http://localhost:8080/api/users/login",{
method: "POST",
 headers: {
                    "Content-Type": "application/json"
                },
body:JSON.stringify({
username : usernameInput.value,
password : passwordInput.value})
})

if(!response.ok){
    alert("forkert login")
}
const user = await response.json();
localStorage.setItem("user",JSON.stringify(user))
    console.log(localStorage.getItem("user"))
alert("bruger logget ind")
displayEmployeePanel()

})

loginHolder.appendChild(header)
loginHolder.appendChild(usernameInput)
loginHolder.appendChild(passwordInput)
loginHolder.appendChild(submitBtn)

document.getElementById("app").appendChild(loginHolder)

}



