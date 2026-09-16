// ================= ROOM DATA =================

const roomPrices = {
    Standard: 1500,
    Deluxe: 2500,
    Suite: 4000
};

const roomNumbers = {
    Standard: [101, 102],
    Deluxe: [201, 202],
    Suite: [301, 302]
};


// ================= LOAD BOOKINGS =================

let bookings = JSON.parse(localStorage.getItem("hotelBookings")) || [];


// ================= PAGE LOAD =================

document.addEventListener("DOMContentLoaded", function () {

    displayBookings();

    updateTotal();

    setMinimumDates();

    document
        .getElementById("roomCategory")
        .addEventListener("change", updateTotal);

    document
        .getElementById("nights")
        .addEventListener("input", updateTotal);

    document
        .getElementById("bookingForm")
        .addEventListener("submit", makeBooking);
});


// ================= SCROLL TO ROOMS =================

function scrollToRooms() {

    document
        .getElementById("rooms")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ================= SELECT ROOM =================

function selectRoom(category, price) {

    document.getElementById("roomCategory").value = category;

    document.getElementById("nights").value = 1;

    updateTotal();

    document
        .getElementById("booking")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ================= UPDATE TOTAL =================

function updateTotal() {

    const category =
        document.getElementById("roomCategory").value;

    const nights =
        parseInt(
            document.getElementById("nights").value
        ) || 1;

    const price =
        roomPrices[category] || 1500;

    const total =
        price * nights;

    document.getElementById("totalAmount").textContent =
        "₹" + total.toLocaleString("en-IN");
}


// ================= DATE SETTINGS =================

function setMinimumDates() {

    const today = new Date()
        .toISOString()
        .split("T")[0];

    document.getElementById("checkIn").min = today;

    document.getElementById("checkOut").min = today;


    document
        .getElementById("checkIn")
        .addEventListener("change", function () {

            document.getElementById("checkOut").min =
                this.value;
        });
}


// ================= MAKE BOOKING =================

function makeBooking(event) {

    event.preventDefault();


    const name =
        document.getElementById("customerName")
            .value.trim();

    const phone =
        document.getElementById("phone")
            .value.trim();

    const category =
        document.getElementById("roomCategory")
            .value;

    const nights =
        parseInt(
            document.getElementById("nights").value
        );

    const checkIn =
        document.getElementById("checkIn")
            .value;

    const checkOut =
        document.getElementById("checkOut")
            .value;

    const paymentMethod =
        document.getElementById("paymentMethod")
            .value;


    // ================= VALIDATION =================

    if (name.length < 2) {

        alert("Please enter a valid customer name.");

        return;
    }


    if (!/^[0-9]{10}$/.test(phone)) {

        alert(
            "Please enter a valid 10-digit phone number."
        );

        return;
    }


    if (!category) {

        alert("Please select a room category.");

        return;
    }


    if (!nights || nights <= 0) {

        alert("Number of nights must be at least 1.");

        return;
    }


    if (!checkIn || !checkOut) {

        alert("Please select check-in and check-out dates.");

        return;
    }


    if (new Date(checkOut) <= new Date(checkIn)) {

        alert(
            "Check-out date must be after check-in date."
        );

        return;
    }


    if (!paymentMethod) {

        alert("Please select a payment method.");

        return;
    }


    // ================= FIND AVAILABLE ROOM =================

    const availableRoom =
        findAvailableRoom(category);

    if (!availableRoom) {

        alert(
            "Sorry! No rooms are currently available in this category."
        );

        return;
    }


    // ================= CALCULATE PAYMENT =================

    const price =
        roomPrices[category];

    const total =
        price * nights;


    // ================= PAYMENT SIMULATION =================

    const paymentSuccessful =
        simulatePayment(
            paymentMethod,
            total
        );

    if (!paymentSuccessful) {

        return;
    }


    // ================= BOOKING ID =================

    const bookingId =
        generateBookingId();


    // ================= CREATE BOOKING =================

    const booking = {

        bookingId: bookingId,

        customerName: name,

        phone: phone,

        roomNumber: availableRoom,

        category: category,

        pricePerNight: price,

        checkIn: checkIn,

        checkOut: checkOut,

        nights: nights,

        totalAmount: total,

        paymentMethod: paymentMethod,

        paymentStatus: "Paid",

        reservationStatus: "Confirmed",

        bookingDate: new Date().toLocaleString("en-IN")

    };


    // ================= SAVE BOOKING =================

    bookings.push(booking);

    localStorage.setItem(
        "hotelBookings",
        JSON.stringify(bookings)
    );


    // ================= SHOW SUCCESS =================

    showSuccessModal(booking);


    // ================= RESET FORM =================

    document
        .getElementById("bookingForm")
        .reset();

    document.getElementById("nights").value = 1;

    updateTotal();

    displayBookings();
}


// ================= FIND AVAILABLE ROOM =================

function findAvailableRoom(category) {

    const rooms =
        roomNumbers[category];

    for (let room of rooms) {

        const roomBooked =
            bookings.some(function (booking) {

                return (
                    booking.roomNumber === room &&
                    booking.reservationStatus === "Confirmed"
                );

            });

        if (!roomBooked) {

            return room;
        }
    }

    return null;
}


// ================= PAYMENT SIMULATION =================

function simulatePayment(method, amount) {

    alert(
        "Payment Simulation\n\n" +
        "Method: " + method +
        "\nAmount: ₹" +
        amount.toLocaleString("en-IN") +
        "\n\nPayment successful!"
    );

    return true;
}


// ================= GENERATE BOOKING ID =================

function generateBookingId() {

    return "GS" +
        Date.now()
            .toString()
            .slice(-6);
}


// ================= SUCCESS MODAL =================

function showSuccessModal(booking) {

    const modal =
        document.getElementById("successModal");

    const result =
        document.getElementById("bookingResult");


    result.innerHTML = `

        <p>
            <strong>Booking ID:</strong>
            ${booking.bookingId}
        </p>

        <p>
            <strong>Room:</strong>
            ${booking.roomNumber}
            (${booking.category})
        </p>

        <p>
            <strong>Check-in:</strong>
            ${formatDate(booking.checkIn)}
        </p>

        <p>
            <strong>Check-out:</strong>
            ${formatDate(booking.checkOut)}
        </p>

        <p>
            <strong>Total:</strong>
            ₹${booking.totalAmount.toLocaleString("en-IN")}
        </p>

        <p>
            <strong>Payment:</strong>
            ${booking.paymentStatus}
        </p>

    `;


    modal.style.display = "flex";
}


// ================= CLOSE MODAL =================

function closeModal() {

    document
        .getElementById("successModal")
        .style.display = "none";


    document
        .getElementById("bookings")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ================= DISPLAY BOOKINGS =================

function displayBookings() {

    const container =
        document.getElementById("bookingsList");


    if (bookings.length === 0) {

        container.innerHTML = `

            <div class="empty-bookings">

                <div class="empty-icon">
                    📋
                </div>

                <h3>No Bookings Yet</h3>

                <p>
                    Your reservations will appear here.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML = "";


    bookings
        .slice()
        .reverse()
        .forEach(function (booking) {

            const card =
                document.createElement("div");

            card.className =
                "booking-card";


            const cancelled =
                booking.reservationStatus === "Cancelled";


            card.innerHTML = `

                <h3>
                    🎫 Booking ${booking.bookingId}
                </h3>

                <p>
                    <strong>Customer:</strong>
                    ${booking.customerName}
                </p>

                <p>
                    <strong>Room:</strong>
                    ${booking.roomNumber}
                    — ${booking.category}
                </p>

                <p>
                    <strong>Stay:</strong>
                    ${formatDate(booking.checkIn)}
                    → ${formatDate(booking.checkOut)}
                </p>

                <p>
                    <strong>Nights:</strong>
                    ${booking.nights}
                </p>

                <p>
                    <strong>Total:</strong>
                    ₹${booking.totalAmount.toLocaleString("en-IN")}
                </p>

                <p>
                    <strong>Payment:</strong>
                    ${booking.paymentStatus}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${booking.reservationStatus}
                </p>

                ${
                    cancelled
                    ? ""
                    : `
                        <button
                            class="cancel-btn"
                            onclick="cancelBooking('${booking.bookingId}')">

                            Cancel Reservation

                        </button>
                    `
                }

            `;


            container.appendChild(card);

        });
}


// ================= CANCEL BOOKING =================

function cancelBooking(bookingId) {

    const booking =
        bookings.find(function (item) {

            return item.bookingId === bookingId;

        });


    if (!booking) {

        alert("Booking not found.");

        return;
    }


    if (
        booking.reservationStatus ===
        "Cancelled"
    ) {

        alert(
            "This reservation is already cancelled."
        );

        return;
    }


    const confirmation =
        confirm(
            "Are you sure you want to cancel booking " +
            bookingId +
            "?"
        );


    if (!confirmation) {

        return;
    }


    booking.reservationStatus =
        "Cancelled";


    localStorage.setItem(
        "hotelBookings",
        JSON.stringify(bookings)
    );


    alert(
        "Reservation cancelled successfully!"
    );


    displayBookings();
}


// ================= FORMAT DATE =================

function formatDate(dateString) {

    const date =
        new Date(dateString + "T00:00:00");


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}


// ================= CLOSE MODAL WHEN CLICKING OUTSIDE =================

window.addEventListener("click", function (event) {

    const modal =
        document.getElementById("successModal");


    if (event.target === modal) {

        modal.style.display = "none";
    }
});