(function () {
  const { seedSessionData } = window.HotelAppData;
  const { calculateNightCount, calculateTotalAmount, formatCurrency, getCurrentSearch, getSelectedHotel, saveSelectedHotel } = window.HotelAppCommon;

  let currentImageIndex = 0;
  let hotelImages = [];

  function buildSlides(items, chunkSize) {
    const slides = [];
    for (let index = 0; index < items.length; index += chunkSize) {
      slides.push(items.slice(index, index + chunkSize));
    }
    return slides;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function buildGuestIcons(guestCount) {
    const safeCount = Math.min(Math.max(Number(guestCount) || 1, 1), 4);
    const icon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3z"/>
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
      </svg>
    `;
    return Array.from({ length: safeCount }, function () {
      return icon;
    }).join("");
  }

  function renderMissingState() {
    document.getElementById("hotelDetailsContent").innerHTML = `
      <div class="empty-state p-4">
        <h2 class="h4">No hotel selected</h2>
        <p class="text-secondary">Please choose a hotel from the search results page first.</p>
        <a class="btn btn-primary" href="searchResults.html">Go to Search Results</a>
      </div>
    `;
  }

  function renderRoomSelection(hotel, searchData) {
    const section = document.getElementById("roomSelectionSection");
    const nightCount = calculateNightCount(searchData.checkInDate, searchData.checkOutDate);

    const roomRows = hotel.roomTypes.map((roomType, index) => {
      const totalPrice = Math.round(hotel.pricePerNight * roomType.multiplier * nightCount);
      const imageUrl = hotel.images[index % hotel.images.length];
      const guestIcons = buildGuestIcons(roomType.guestCount);

      let summaryCol = '';
      if (index === 0) {
        summaryCol = `
        <td style="vertical-align: middle; background-color:#ffffff;" rowspan="${hotel.roomTypes.length}" id="summaryCellContainer">
          <div id="cartSummary" class="cart-summary-card">
            <div style="width:100%;">
              <div style="margin-bottom: 10px;">
                <label class="summary-date-label">Check-in</label>
                <input type="date" id="summaryCheckIn" class="form-control form-control-sm" value="${searchData.checkInDate}" required>
              </div>
              <div>
                <label class="summary-date-label">Check-out</label>
                <input type="date" id="summaryCheckOut" class="form-control form-control-sm" value="${searchData.checkOutDate}" required>
              </div>
            </div>
            <div class="summary-rooms-label" id="cartHeading">0 Room(s) &bull; 0 Guest(s)</div>
            <div style="width:100%; text-align:center;">
              <div class="summary-price-label">Total Price</div>
              <div class="summary-total-price">₺ <span id="cartTotalPrice">0</span></div>
              <div class="summary-tax-note">All taxes included</div>
              <div id="bookingValidationError" class="booking-invalid-feedback mt-2">Please select valid check-in/out dates and at least one room.</div>
            </div>
            <button class="btn-book-now" id="finalBookBtn">Book Now</button>
          </div>
        </td>
        `;
      }

      return `
      <tr>
        <td>
          <img src="${imageUrl}" alt="${roomType.name}" class="booking-room-image lightbox-trigger" data-image-index="${index % hotel.images.length}">
          <div class="room-info">
            <h3>${roomType.name}</h3>
            <p>${28 + (index * 6)}m²</p>
            <div class="amenities">
              <div class="room-amenities">Air conditioning</div>
              <div class="room-amenities">TV</div>
              <div class="room-amenities">LCD TV</div>
              <div class="room-amenities">Wireless Internet</div>
            </div>
          </div>
        </td>
        <td>
          <div class="conditions">
            <div class="room-conditions">Breakfast included</div>
            <div class="room-conditions free-cancellation">FREE Cancellation</div>
          </div>
        </td>
        <td class="text-center">
          ${guestIcons}
          <p>${roomType.guestCount} guest(s)</p>
        </td>
        <td class="text-center price-display-cell" data-base-price="${Math.round(hotel.pricePerNight * roomType.multiplier)}">
          <p>${formatCurrency(Math.round(hotel.pricePerNight * roomType.multiplier))}</p>
        </td>
        <td class="text-center">
          <select class="form-select booking-room-count" data-base-price="${Math.round(hotel.pricePerNight * roomType.multiplier)}" data-price="${totalPrice}" id="room-count-${index}">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </td>
          ${summaryCol}
      </tr>
    `;
    }).join("");

    section.innerHTML = `
      <table class="table room-selection-table" style="background-color:#ffffff;">
          <tr>
            <th class="text-center room-reservation-th">Room Type</th>
            <th class="text-center room-reservation-th">Conditions</th>
            <th class="text-center room-reservation-th">Guests</th>
            <th class="text-center room-reservation-th">Price per Night</th>
            <th class="text-center room-reservation-th">Select Rooms</th>
            <th class="text-center room-reservation-th">Summary</th>
          </tr>
          ${roomRows}

      </table>
    `;

    section.classList.remove("d-none");

    const selects = section.querySelectorAll(".booking-room-count");
    const totalElem = document.getElementById("cartTotalPrice");
    const qtyElem = document.getElementById("cartHeading");
    const finalBookBtn = document.getElementById("finalBookBtn");
    const summaryCheckIn = document.getElementById("summaryCheckIn");
    const summaryCheckOut = document.getElementById("summaryCheckOut");

    function getNextDay(dateString) {
        const d = new Date(dateString);
        d.setDate(d.getDate() + 1);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function getTodayString() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    summaryCheckIn.min = getTodayString();
    summaryCheckOut.min = getNextDay(summaryCheckIn.value || getTodayString());

    function handleDatesChange() {
        const errorElem = document.getElementById("bookingValidationError");
        if (errorElem) errorElem.classList.remove("show");

        if (summaryCheckIn.value) {
            const nextDay = getNextDay(summaryCheckIn.value);
            summaryCheckOut.min = nextDay;
            
            if (summaryCheckOut.value && summaryCheckOut.value <= summaryCheckIn.value) {
                summaryCheckOut.value = nextDay;
            }
        }

        searchData.checkInDate = summaryCheckIn.value;
        searchData.checkOutDate = summaryCheckOut.value;

        const newNightCount = calculateNightCount(searchData.checkInDate, searchData.checkOutDate);



        selects.forEach(select => {
            const basePrice = parseInt(select.dataset.basePrice);
            select.dataset.price = basePrice * newNightCount;
        });

        updateTotal();
    }

    summaryCheckIn.addEventListener("change", handleDatesChange);
    summaryCheckOut.addEventListener("change", handleDatesChange);

    function updateTotal() {
        let sumPrice = 0;
        let sumRooms = 0;
        let totalGuests = 0;

        selects.forEach(select => {
            const count = parseInt(select.value);
            if (count > 0) {
                const price = parseInt(select.dataset.price);
                const guestCountRow = select.closest("tr").querySelector(".text-center p");
                const guestCount = guestCountRow ? parseInt(guestCountRow.innerText.split(" ")[0]) : 0;
                sumPrice += price * count;
                sumRooms += count;
                totalGuests += guestCount * count;
            }
        });

        const currentNights = calculateNightCount(summaryCheckIn.value, summaryCheckOut.value);
        qtyElem.innerHTML = `${sumRooms} Room(s) &bull; ${totalGuests} Guest(s) &bull; ${currentNights} night(s)`;
        totalElem.innerText = sumPrice.toLocaleString();
    }

    selects.forEach(select => {
        select.addEventListener("change", updateTotal);
    });

    finalBookBtn.addEventListener("click", function () {
        const errorElem = document.getElementById("bookingValidationError");
        errorElem.classList.remove("show");

        if (!summaryCheckIn.value || !summaryCheckOut.value) {
            errorElem.innerText = "Please select both check-in and check-out dates.";
            errorElem.classList.add("show");
            return;
        }

        let totalPrice = 0;
        const selectedRooms = Array.from(selects).map(select => {
            const count = parseInt(select.value);
            if (count > 0) {
                const price = parseInt(select.dataset.price);
                totalPrice += price * count;
                return {
                    roomType: select.closest("tr").querySelector(".room-info h3").innerText,
                    count,
                    guestCount: parseInt(select.closest("tr").querySelector(".text-center p").innerText.split(" ")[0])
                };
            }
            return null;
        }).filter(room => room !== null);

        if (selectedRooms.length === 0) {
            errorElem.innerText = "Please select at least one room to continue.";
            errorElem.classList.add("show");
            return;
        }

        const reservationData = {
            roomCount: selectedRooms.reduce((sum, room) => sum + room.count, 0),
            guestCount: selectedRooms.reduce((sum, room) => sum + (room.guestCount * room.count), 0),
            roomType: selectedRooms.map(room => room.roomType).join(", "),
            checkInDate: summaryCheckIn.value,
            checkOutDate: summaryCheckOut.value,
            totalPrice: totalPrice
        };

        hotel.reservationData = reservationData;
        sessionStorage.setItem("selectedHotel", JSON.stringify(hotel));
        window.location.href = "payment.html";
    });
  }

  function renderHotelDetails(hotel) {
    const searchData = hotel.searchData || getCurrentSearch();
    const detailsContainer = document.getElementById("hotelDetailsContent");
    const photoSlides = buildSlides(hotel.images, 4);
    const extraPhotos = hotel.images.length > 4 ? hotel.images.length - 4 : 0;
    const aboutParagraphs = [
      hotel.description,
      hotel.info,
      `Location: ${hotel.address}.`,
      `Reservation summary: ${searchData.checkInDate} to ${searchData.checkOutDate} for ${searchData.guestCount} guest(s).`
    ];

    detailsContainer.innerHTML = `
      <div class="bg-white border shadow-sm p-3 p-lg-4 hotel-header-container">
        <div class="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
          <div>
            <h2 class="fw-bolder mb-2 hotel-header-title">${hotel.name}</h2>
            <div class="d-flex align-items-center small mt-1 hotel-header-location">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="me-1 text-primary" viewBox="0 0 16 16">
                <path d="M8 0a5.53 5.53 0 0 0-5.5 5.5c0 3.3 5 9.77 5.25 10.07a.33.33 0 0 0 .5 0C8.5 15.27 13.5 8.8 13.5 5.5A5.53 5.53 0 0 0 8 0zm0 7.5a2 2 0 1 1 2-2 2 2 0 0 1-2 2z"/>
              </svg>
              <span>${hotel.city}, ${hotel.address}</span>
              <span class="mx-2 text-muted">-</span>
              <a href="#" class="text-decoration-none fw-bold text-primary">Show on Map</a>
            </div>
          </div>
          <div class="d-flex align-items-center gap-3 hotel-details-actions">
            <button class="btn btn-light rounded-circle shadow-sm border action-icon-btn" type="button" aria-label="Share hotel">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
            <button class="btn btn-light rounded-circle shadow-sm border action-icon-btn" type="button" aria-label="Save hotel">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <button id="showRoomSelectionButton" class="btn btn-primary px-4 py-2 ms-2 fw-bold" style="border-radius: 8px; font-size: 1rem;" type="button">Book now</button>
          </div>
        </div>

        <div id="hotelPhotosCarousel" class="carousel slide simple-carousel mb-4" data-bs-ride="false">
          <div class="carousel-inner overflow-visible">
            ${photoSlides.map((slideItems, slideIndex) => `
              <div class="carousel-item ${slideIndex === 0 ? "active" : ""}">
                <div class="row g-3">
                  ${slideItems.map((imageUrl, imageIndex) => {
                    const absoluteIndex = (slideIndex * 4) + imageIndex;
                    const showOverlay = slideIndex === 0 && imageIndex === slideItems.length - 1 && extraPhotos > 0;
                    return `
                      <div class="col-6 col-lg-3">
                        <div class="position-relative rounded-3 overflow-hidden">
                          <img src="${imageUrl}" class="hotel-strip-image d-block w-100 lightbox-trigger" data-image-index="${absoluteIndex}" alt="${escapeHtml(hotel.name)} photo ${absoluteIndex + 1}">
                          ${showOverlay ? `<div class="photo-count-badge">+${extraPhotos} photos</div>` : ""}
                        </div>
                      </div>
                    `;
                  }).join("")}
                </div>
              </div>
            `).join("")}
          </div>
          ${photoSlides.length > 1 ? `
            <button class="carousel-control-prev" type="button" data-bs-target="#hotelPhotosCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#hotelPhotosCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          ` : ""}
        </div>

        <div class="row g-3">
          <div class="col-lg-7">
            <div class="h-100 border border-primary-subtle rounded-4 bg-white p-4">
              <h3 class="h5 fw-bold mb-3">About the property</h3>
              ${aboutParagraphs.map((paragraph) => `
                <p class="mb-3 text-secondary">${paragraph}</p>
              `).join("")}
            </div>
          </div>
          <div class="col-lg-5">
            <div class="h-100 border border-primary-subtle rounded-4 bg-white p-4">
              <h3 class="h5 fw-bold mb-3">Hotel policies</h3>
              <div class="mb-3">
                <h4 class="h6 fw-bold mb-1">Check-in</h4>
                <p class="mb-0 text-secondary">${hotel.rules[0] || "After 14:00"}</p>
              </div>
              <div class="mb-3">
                <h4 class="h6 fw-bold mb-1">Check-out</h4>
                <p class="mb-0 text-secondary">${hotel.rules[1] || "Before 12:00"}</p>
              </div>
              <div class="mb-3">
                <h4 class="h6 fw-bold mb-1">Price</h4>
                <p class="mb-0 text-secondary">${formatCurrency(hotel.pricePerNight)} / night</p>
              </div>
              <div class="mb-3">
                <h4 class="h6 fw-bold mb-1">Reviews</h4>
                <p class="mb-0 text-secondary">${hotel.rating} / 10 from ${hotel.ratingCount} review(s)</p>
              </div>
              <div>
                <h4 class="h6 fw-bold mb-1">Additional rules</h4>
                <ul class="mb-0 ps-3 text-secondary">
                  ${hotel.rules.slice(2).map((rule) => `<li class="mb-1">${rule}</li>`).join("")}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("showRoomSelectionButton").addEventListener("click", function () {
      renderRoomSelection(hotel, searchData);
      document.getElementById("roomSelectionSection").scrollIntoView({ behavior: "smooth", block: "start" });
      attachLightboxListeners();
    });

    hotelImages = hotel.images;
    attachLightboxListeners();
    initLightboxControls();
  }

  function attachLightboxListeners() {
    document.querySelectorAll(".lightbox-trigger").forEach((img) => {
        img.addEventListener("click", function() {
            const index = parseInt(this.dataset.imageIndex);
            openLightbox(index);
        });
    });
  }

  function openLightbox(index) {
    currentImageIndex = index;
    const modal = new bootstrap.Modal(document.getElementById("imageLightboxModal"));
    updateLightboxUI();
    modal.show();
  }

  function updateLightboxUI() {
    const imgElem = document.getElementById("lightboxImage");
    const indexElem = document.getElementById("lightboxIndex");
    
    imgElem.src = hotelImages[currentImageIndex];
    indexElem.textContent = `${currentImageIndex + 1} / ${hotelImages.length}`;
  }

  function initLightboxControls() {
    document.getElementById("lightboxPrevBtn").addEventListener("click", function() {
        currentImageIndex = (currentImageIndex - 1 + hotelImages.length) % hotelImages.length;
        updateLightboxUI();
    });

    document.getElementById("lightboxNextBtn").addEventListener("click", function() {
        currentImageIndex = (currentImageIndex + 1) % hotelImages.length;
        updateLightboxUI();
    });

    // Keyboard navigation
    document.addEventListener("keydown", function(e) {
        const modal = document.getElementById("imageLightboxModal");
        if (!modal.classList.contains("show")) return;

        if (e.key === "ArrowLeft") {
            document.getElementById("lightboxPrevBtn").click();
        } else if (e.key === "ArrowRight") {
            document.getElementById("lightboxNextBtn").click();
        }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    seedSessionData();
    const selectedHotel = getSelectedHotel();

    if (!selectedHotel) {
      renderMissingState();
      return;
    }

    renderHotelDetails(selectedHotel);
  });
}());
