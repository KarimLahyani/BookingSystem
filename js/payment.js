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

  function handleSubmit(selectedHotel, iti) {
    const form = document.getElementById("paymentForm");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      form.classList.add("was-validated");

      // Validate Expiry Date
      const expiryInput = form.expiryDate;
      const expiryValue = expiryInput.value;
      const isExpired = (value) => {
        if (!value || !value.includes("/")) return true;
        const [m, y] = value.split("/").map(Number);
        const now = new Date();
        const curM = now.getMonth() + 1;
        const curY = now.getFullYear() % 100;
        if (y < curY) return true;
        if (y === curY && m < curM) return true;
        return false;
      };

      if (isExpired(expiryValue)) {
          expiryInput.setCustomValidity("Card is expired.");
      } else {
          expiryInput.setCustomValidity("");
      }

      if (!form.checkValidity() || !iti.isValidNumber()) {
        if (!iti.isValidNumber()) {
            form.phone.classList.add("is-invalid");
        }
        return;
      }

      form.phone.classList.remove("is-invalid");

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
          "phone": iti.getNumber()
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
      window.alert("Booking completed successfully.");
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

    const paymentForm = document.getElementById("paymentForm");
    const phoneInput = document.querySelector("#phone");
    const iti = window.intlTelInput(phoneInput, {
      initialCountry: "tr",
      separateDialCode: true,
      utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });

    handleSubmit(selectedHotel, iti);

    // Restrict input to numbers only for specific fields
    const numberFields = ["cardNumber", "cvc"];
    numberFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      field.addEventListener("input", function (event) {
        this.value = this.value.replace(/\D/g, "");
      });
    });

    // Limit input length for phone and CVC fields
    phoneInput.addEventListener("input", function () {
      if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
      }
    });

    const cvcInput = document.querySelector("#cvc");
    if (cvcInput) {
        cvcInput.addEventListener("input", function () {
          if (this.value.length > 3) {
            this.value = this.value.slice(0, 3);
          }
        });
    }

    // Initialize datepicker for expiration date
    const expiryDateInput = document.querySelector("#expiryDate");
    $(expiryDateInput).datepicker({
      format: "mm/yy",
      startView: "months",
      minViewMode: "months",
      autoclose: true,
    }).on("changeDate change", function() {
        this.setCustomValidity("");
    });
  });
}());
