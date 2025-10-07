import {createHeader} from "./landingpage.js";


const app = document.getElementById("app")
let selectedSeats = [];
let totalPrice = 0;

export async function displaySeatReservation(showId){
   selectedSeats = [];
    totalPrice = 0;
app.innerHTML = "";
const header = createHeader();
app.appendChild(header)

    const displaySeatReservationDiv = document.createElement("div")
    displaySeatReservationDiv.classList.add("book-seat-page-container")




    const seatReservationComponentDiv = document.createElement("div")
    seatReservationComponentDiv.classList.add("test-1")
    const seatReservationComponentHeaderDiv = document.createElement("div")
    seatReservationComponentHeaderDiv.classList.add("seat-reservation-header")
    const screenImg = document.createElement("img")
    screenImg.src = "/pictures/screen.svg"
    seatReservationComponentHeaderDiv.appendChild(screenImg)
    const screenText = document.createElement("h2")
    screenText.textContent = "Lærred"
    seatReservationComponentHeaderDiv.appendChild(screenText)
seatReservationComponentDiv.appendChild(seatReservationComponentHeaderDiv)


    const seatReservationDiv = document.createElement("div")

    const response = await fetch("http://localhost:8080/api/shows/" + showId)
    if (!response.ok){
        alert("showet kunne ikke findes")
    }
    const showData = await response.json()

    const seatMap = new Map()
    //sorterer alle sæder i forhold til række
    for (let seat of showData.theatre.seatList){
        if (!seatMap.has(seat.row)) {
            seatMap.set(seat.row, []);
        }
        seatMap.get(seat.row).push(seat);
    }

    console.log(seatMap)

    //henter alle de bookede sæder til denne forestilling
    const bookedSeatsResponse = await fetch("http://localhost:8080/api/bookedseats/" + showId)
    if (!bookedSeatsResponse.ok){
        alert("noget gik galt med inlæsning af bookede sæder")
    }
    const bookedSeatsData = await bookedSeatsResponse.json()


    for (let seatList of seatMap.values()){
        const seatRow = document.createElement("div")
        seatRow.classList.add("seat-row");
        for (let seat of seatList) {
            const seatDiv = document.createElement("div");
            seatDiv.classList.add("seat");

            const seatImg = document.createElement("img");
            seatImg.src = "/pictures/Seat.svg";

            const clickHandler = () => handleSeatClick(seat, seatImg,selectedTicketDiv, reservationPriceText);

            seatDiv.addEventListener("click", clickHandler);

            // Mark booked seats
            for (let bookedSeat of bookedSeatsData) {
                if (bookedSeat.seat.id === seat.id) {
                    seatImg.src = "/pictures/SeatBooked.svg";
                    seatDiv.removeEventListener("click", clickHandler);
                    seatDiv.style.cursor = "not-allowed";
                    break;
                }
            }

            seatDiv.appendChild(seatImg);
            seatRow.appendChild(seatDiv);
        }


        seatReservationDiv.appendChild(seatRow)
    }



    //Smider hele sæde håndteringen ind i displaySeatReservationDiv
    seatReservationComponentDiv.appendChild(seatReservationDiv)
    displaySeatReservationDiv.appendChild(seatReservationComponentDiv)


    const showInfoDiv = document.createElement("div")
    showInfoDiv.classList.add("show-info-container")


    const seatsDescription = document.createElement("div");
    seatsDescription.classList.add("seats-description-container")

// Booked seat section
    const bookedImageDiv = document.createElement("div");
    bookedImageDiv.classList.add("seats-description")
    const bookedImage = document.createElement("img");
    bookedImage.src = "/pictures/SeatBooked.svg";
    bookedImageDiv.appendChild(bookedImage);
    const bookedImageText = document.createElement("h3");
    bookedImageText.textContent = "Udsolgt";
    bookedImageDiv.appendChild(bookedImageText);
    seatsDescription.appendChild(bookedImageDiv);

// Free seat section
    const freeImageDiv = document.createElement("div");
    freeImageDiv.classList.add("seats-description")
    const freeImage = document.createElement("img");
    freeImage.src = "/pictures/Seat.svg";
    freeImageDiv.appendChild(freeImage);
    const freeImageText = document.createElement("h3");
    freeImageText.textContent = "Ledig";
    freeImageDiv.appendChild(freeImageText);
    seatsDescription.appendChild(freeImageDiv);

// Your seat section
    const yourImageDiv = document.createElement("div");
    yourImageDiv.classList.add("seats-description")
    const yourImage = document.createElement("img");
    yourImage.src = "/pictures/SeatSelected.svg";
    yourImageDiv.appendChild(yourImage);
    const yourImageText = document.createElement("h3");
    yourImageText.textContent = "Din plads";
    yourImageDiv.appendChild(yourImageText);
    seatsDescription.appendChild(yourImageDiv);


// putter seatDescription ind i showInfoDiv
    showInfoDiv.appendChild(seatsDescription)

//laver div til at holde movie/show info
const movieShowDescription = document.createElement("div")
    movieShowDescription.classList.add("movie-show-description-container")

const movieDescriptionDiv = document.createElement("div")
    const movieTitle = document.createElement("h2")
    movieTitle.textContent = showData.movie.title
    movieDescriptionDiv.appendChild(movieTitle)
    const movieTime = document.createElement("a")
    movieTime.text = showData.movie.duration.substring(1,6).split(":")[0] + " T " + showData.movie.duration.substring(1,6).split(":")[1] + " Min"
    movieDescriptionDiv.appendChild(movieTime)
    const movieAgeReq = document.createElement("a")
    movieAgeReq.textContent = "Aldersgrænse: " + showData.movie.ageLimit
    movieDescriptionDiv.appendChild(movieAgeReq)
    //første halvdel af movieShowDescription færdig
    movieShowDescription.appendChild(movieDescriptionDiv)

    const showDescriptionDiv = document.createElement("div")

    const showTheatre = document.createElement("h2")
    showTheatre.textContent = showData.theatre.name
    showDescriptionDiv.appendChild(showTheatre)
    const showDate = document.createElement("a")
    const date = new Date(showData.showTime);
    showDate.textContent = date.toLocaleDateString("da-DK", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
    showDescriptionDiv.appendChild(showDate)
    const showTimePeriod = document.createElement("a")
// Movie length is a time string "HH:MM:SS"
    const lengthParts = showData.movie.duration.split(":");
    const lengthMinutes = parseInt(lengthParts[0]) * 60 + parseInt(lengthParts[1]); // hours → minutes + minutes

// Add movie length + 20 minutes
    const totalMinutes = lengthMinutes + 20;
    const endTime = new Date(date.getTime() + totalMinutes * 60000);

// Format times
    const options = { hour: "2-digit", minute: "2-digit" };
    const startTimeStr = date.toLocaleTimeString("da-DK", options);
    const endTimeStr = endTime.toLocaleTimeString("da-DK", options);

// Display interval
    showTimePeriod.textContent = `${startTimeStr} - ${endTimeStr}`;

    showDescriptionDiv.appendChild(showTimePeriod)


    movieShowDescription.appendChild(showDescriptionDiv)
    showInfoDiv.appendChild(movieShowDescription)


    const chosenTicketDiv = document.createElement("div")
    chosenTicketDiv.classList.add("reservation-description-container")

    // Title
    const chosenTicketTitleDiv = document.createElement("div")

    const chosenTicketTitle = document.createElement("h2")
    chosenTicketTitle.textContent = "Valgte billetter:"

    chosenTicketTitleDiv.appendChild(chosenTicketTitle)
    chosenTicketDiv.appendChild(chosenTicketTitleDiv)



    // Showing what tickets have been selected
    const selectedTicketDiv = document.createElement("div")
    selectedTicketDiv.classList.add("line-item")

    chosenTicketDiv.appendChild(selectedTicketDiv)



    // Ticket price
    const reservationPriceDiv = document.createElement("div")
    const reservationPriceText = document.createElement("h2")
    reservationPriceText.textContent = "Pris: " + totalPrice + " kr."

    reservationPriceDiv.appendChild(reservationPriceText)


    chosenTicketDiv.appendChild(reservationPriceDiv)



    // Buy tickets button
    const reservationButtonDiv = document.createElement("div")
    const reservationButton = document.createElement("button")
    reservationButton.classList.add("reservation-bnt")
    reservationButton.textContent = "Book biletter"
    reservationButton.addEventListener("click", async function (){
        if (selectedSeats.length<1){
            alert("du har ikke valgt nogle sæder")
        }
    })

    reservationButtonDiv.appendChild(reservationButton)
    chosenTicketDiv.appendChild(reservationButtonDiv)













    showInfoDiv.appendChild(chosenTicketDiv)

    displaySeatReservationDiv.appendChild(showInfoDiv)

    app.appendChild(displaySeatReservationDiv)
}


function handleSeatClick(seat, seatImg, selectedTicketDiv, reservationPriceText) {
    const isSelected = seatImg.dataset.selected === "true";

    if (isSelected) {
        // Deselect seat
        seatImg.src = "/pictures/Seat.svg";
        seatImg.dataset.selected = "false";

        // Remove seat from array
        selectedSeats = selectedSeats.filter(s => s.id !== seat.id);

        // Remove seat line from selectedTicketDiv
        const seatLine = document.getElementById(`seat-${seat.id}`);
        if (seatLine) seatLine.remove();

        // Decrease price
        totalPrice -= 150;
    } else {
        // Select seat
        seatImg.src = "/pictures/SeatSelected.svg";
        seatImg.dataset.selected = "true";

        // Add seat to array
        selectedSeats.push(seat);

        // Add seat line to selectedTicketDiv
        const seatLine = document.createElement("a");
        seatLine.id = `seat-${seat.id}`; // unique ID
        seatLine.textContent = `Sæde ${seat.seatNumber}. Række ${seat.row} - 150 kr.`;
        selectedTicketDiv.appendChild(seatLine);

        // Increase price
        totalPrice += 150;
    }

    // Update price display
    reservationPriceText.textContent = "Pris: " + totalPrice + " kr.";

    console.log("Selected seats:", selectedSeats);
}