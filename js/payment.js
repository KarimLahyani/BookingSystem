(function () {
  const { seedSessionData } = window.HotelAppData;
  const { calculateNightCount, calculateTotalAmount, formatCurrency, getReservations, getSelectedHotel, saveReservations } = window.HotelAppCommon;

  function renderMissingState(message) {
    document.querySelector(".container").innerHTML = `
      <div class="empty-state p-4">
        <h2 class="h4">Booking information missing</h2>
        <p class="text-secondary">${message}</p>
        <a class="btn btn-primary" href="searchResults.html">Go to Search Results</a>
      </div>
    `;
  }

  function renderSummary(selectedHotel) {
    const reservationData = selectedHotel.reservationData;
    const totalAmount = reservationData.totalPrice || calculateTotalAmount(selectedHotel, reservationData);
    const nightCount = calculateNightCount(reservationData.checkInDate, reservationData.checkOutDate);

    document.getElementById("bookingSummary").innerHTML = `
      <h3 class="h5">${selectedHotel.name}</h3>
      <p class="text-secondary">${selectedHotel.address}</p>
      <hr>
      <p class="mb-1"><strong>Room Type:</strong> ${reservationData.roomType}</p>
      <p class="mb-1"><strong>Room Count:</strong> ${reservationData.roomCount}</p>
      <p class="mb-1"><strong>Guest Count:</strong> ${reservationData.guestCount}</p>
      <p class="mb-1"><strong>Check-in:</strong> ${reservationData.checkInDate}</p>
      <p class="mb-1"><strong>Check-out:</strong> ${reservationData.checkOutDate}</p>
      <p class="mb-1"><strong>Nights:</strong> ${nightCount}</p>
      <p class="mb-0 fw-semibold"><strong>Total Amount:</strong> ${formatCurrency(totalAmount)}</p>
    `;
  }

  function isCardExpired(value) {
    if (!value || !value.includes("/")) return true;
    const parts = value.split("/");
    if (parts.length !== 2) return true;
    const m = parseInt(parts[0], 10);
    const y = parseInt(parts[1], 10);
    if (isNaN(m) || isNaN(y) || m < 1 || m > 12) return true;
    const now = new Date();
    const curYear = now.getFullYear() % 100;
    const curMonth = now.getMonth() + 1;
    if (y < curYear) return true;
    if (y === curYear && m < curMonth) return true;
    return false;
  }

  function handleSubmit(selectedHotel) {
    const form = document.getElementById("paymentForm");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const expiryInput = form.expiryDate;
      if (isCardExpired(expiryInput.value)) {
        expiryInput.setCustomValidity("Card expiry date is invalid or expired.");
      } else {
        expiryInput.setCustomValidity("");
      }

      form.classList.add("was-validated");

      if (!form.checkValidity()) {
        return;
      }

      const reservationData = selectedHotel.reservationData;
      const totalAmount = reservationData.totalPrice || calculateTotalAmount(selectedHotel, reservationData);
      const reservations = getReservations();

      const reservation = {
        "hotel": {
          "name": selectedHotel.name,
          "address": selectedHotel.address
        },
        "reservationData": {
          "roomCount": Number(reservationData.roomCount),
          "guestCount": Number(reservationData.guestCount),
          "roomType": reservationData.roomType,
          "checkInDate": reservationData.checkInDate,
          "checkOutDate": reservationData.checkOutDate
        },
        "guestData": {
          "firstName": form.firstName.value.trim(),
          "lastName": form.lastName.value.trim(),
          "email": form.email.value.trim(),
          "phone": form.phone.value.trim()
        },
        "paymentInformation": {
          "cardInfo": {
            "cardNumber": form.cardNumber.value.trim(),
            "cardHolder": form.cardName.value.trim(),
            "expiryDate": form.expiryDate.value.trim(),
            "cvv": form.cvc.value.trim()
          },
          "paymentMethod": form.querySelector('input[name="paymentMethod"]:checked').value,
          "totalAmount": totalAmount
        }
      };

      reservations.push(reservation);
      saveReservations(reservations);

      form.reset();
      form.classList.remove("was-validated");
      window.alert("Booking completed successfully! Your reservation has been saved.");
    });
  }

  function enforceNumericInput(fieldId, maxLength) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "");
      if (maxLength && this.value.length > maxLength) {
        this.value = this.value.slice(0, maxLength);
      }
    });
  }

  function formatExpiryInput(input) {
    input.addEventListener("input", function () {
      let raw = this.value.replace(/\D/g, "");
      if (raw.length > 4) raw = raw.slice(0, 4);
      if (raw.length >= 3) {
        this.value = raw.slice(0, 2) + "/" + raw.slice(2);
      } else {
        this.value = raw;
      }
      this.setCustomValidity("");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    seedSessionData();
    const selectedHotel = getSelectedHotel();

    if (!selectedHotel) {
      renderMissingState("Please select a hotel before opening the payment page.");
      return;
    }

    if (!selectedHotel.reservationData) {
      renderMissingState("Please select a room and room count on the hotel details page first.");
      return;
    }

    renderSummary(selectedHotel);
    handleSubmit(selectedHotel);

    enforceNumericInput("cardNumber", 16);
    enforceNumericInput("cvc", 3);

    const expiryInput = document.getElementById("expiryDate");
    if (expiryInput) {
      formatExpiryInput(expiryInput);
    }
  });
}());
