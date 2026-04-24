(function () {
  const { STORAGE_KEYS } = window.HotelAppData;

  function getJson(key, fallbackValue) {
    const rawValue = sessionStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallbackValue;
  }

  function setJson(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  function getTodayString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getCurrentSearch() {
    return getJson(STORAGE_KEYS.currentSearch, window.HotelAppData.getDefaultSearchState());
  }

  function saveCurrentSearch(searchData) {
    setJson(STORAGE_KEYS.currentSearch, searchData);
  }

  function getSearchResults() {
    return getJson(STORAGE_KEYS.searchResults, []);
  }

  function saveSearchResults(results) {
    setJson(STORAGE_KEYS.searchResults, results);
  }

  function getSelectedHotel() {
    return getJson(STORAGE_KEYS.selectedHotel, null);
  }

  function saveSelectedHotel(hotel) {
    setJson(STORAGE_KEYS.selectedHotel, hotel);
  }

  function clearSelectedHotel() {
    sessionStorage.removeItem(STORAGE_KEYS.selectedHotel);
  }

  function getReservations() {
    return getJson(STORAGE_KEYS.reservations, []);
  }

  function saveReservations(reservations) {
    setJson(STORAGE_KEYS.reservations, reservations);
  }

  function calculateNightCount(checkInDate, checkOutDate) {
    if (!checkInDate || !checkOutDate) return 0;
    const oneDay = 1000 * 60 * 60 * 24;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    if (isNaN(start) || isNaN(end)) return 0;
    const difference = Math.round((end - start) / oneDay);
    return difference > 0 ? difference : 0;
  }

  function buildSlides(items, chunkSize) {
    const slides = [];
    for (let index = 0; index < items.length; index += chunkSize) {
      slides.push(items.slice(index, index + chunkSize));
    }
    return slides;
  }

  function renderHotelCard(hotel, options = {}) {
    const { isSearchPage = false, className = "" } = options;
    const priceText = formatCurrency(hotel.pricePerNight);
    
    if (isSearchPage) {
      return `
        <button class="card hotel-card clickable-card shadow-sm border-0 text-start w-100 hotel-result-button p-0 overflow-hidden ${className}" type="button" data-hotel-id="${hotel.id}">
          <img src="${hotel.mainImage}" class="card-img-top" alt="${hotel.name}">
          <div class="card-body">
            <h3 class="h5 card-title">${hotel.name}</h3>
            <p class="mb-1 text-secondary">${hotel.city}</p>
            <p class="mb-1 small text-secondary">${hotel.address}</p>
            <p class="mb-1 small text-muted">Stars: ${hotel.starCount} | Rating: ${hotel.rating}</p>
            <p class="mb-0 fw-semibold text-primary">${priceText} / night</p>
          </div>
        </button>
      `;
    }
    
    return `
      <button class="card hotel-card clickable-card shadow-sm border-0 h-100 text-start w-100 hotel-preview-button p-0 overflow-hidden ${className}" type="button" data-hotel-id="${hotel.id}">
        <img src="${hotel.mainImage}" class="card-img-top" alt="${hotel.name}">
        <div class="card-body">
          <h3 class="h6 card-title mb-1">${hotel.name}</h3>
          <p class="mb-1 text-secondary small">${hotel.city}</p>
          <p class="mb-0 fw-semibold text-primary small">${priceText} / night</p>
        </div>
      </button>
    `;
  }

  function searchHotels(searchText) {
    const searchValue = searchText.trim().toLowerCase();
    return window.HotelAppData
      .getHotels()
      .filter((hotel) => {
        const fields = [hotel.name, hotel.city, hotel.description, hotel.info, hotel.address];
        return fields.some((field) => String(field).toLowerCase().includes(searchValue));
      })
      .sort((firstHotel, secondHotel) => firstHotel.name.localeCompare(secondHotel.name));
  }

  function getRoomTypeDetails(hotel, roomTypeName) {
    return hotel.roomTypes.find((roomType) => roomType.name === roomTypeName) || hotel.roomTypes[0];
  }

  function calculateTotalAmount(hotel, reservationData) {
    const selectedRoom = getRoomTypeDetails(hotel, reservationData.roomType);
    const roomCount = Number(reservationData.roomCount);
    const nights = calculateNightCount(reservationData.checkInDate, reservationData.checkOutDate);
    return Math.round(hotel.pricePerNight * selectedRoom.multiplier * roomCount * nights);
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0
    }).format(amount);
  }

  function setSearchDateConstraints(form) {
    const checkInInput = form.querySelector("[name='checkInDate']");
    const checkOutInput = form.querySelector("[name='checkOutDate']");
    const today = getTodayString();
    checkInInput.min = today;
    checkOutInput.min = today;

    checkInInput.addEventListener("change", function () {
      checkOutInput.min = checkInInput.value || today;
      if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
        checkOutInput.value = "";
      }
    });
  }

  function populateSearchForm(form, searchData) {
    form.querySelector("[name='searchText']").value = searchData.searchText || "";
    form.querySelector("[name='checkInDate']").value = searchData.checkInDate || "";
    form.querySelector("[name='checkOutDate']").value = searchData.checkOutDate || "";
    form.querySelector("[name='guestCount']").value = searchData.guestCount || "";
    form.querySelector("[name='roomCount']").value = searchData.roomCount || "";
  }

  function readSearchForm(form) {
    return {
      searchText: form.querySelector("[name='searchText']").value.trim(),
      checkInDate: form.querySelector("[name='checkInDate']").value,
      checkOutDate: form.querySelector("[name='checkOutDate']").value,
      guestCount: form.querySelector("[name='guestCount']").value,
      roomCount: form.querySelector("[name='roomCount']").value
    };
  }

  function validateSearchForm(form) {
    const checkInInput = form.querySelector("[name='checkInDate']");
    const checkOutInput = form.querySelector("[name='checkOutDate']");
    const globalError = form.querySelector("#searchGlobalError");

    if (globalError) globalError.classList.add("d-none");
    checkOutInput.setCustomValidity("");

    if (checkInInput.value && checkOutInput.value && checkOutInput.value <= checkInInput.value) {
      checkOutInput.setCustomValidity("Check-out date must be after check-in.");
    }

    form.classList.add("was-validated");
    const isValid = form.checkValidity();
    
    if (!isValid && globalError) {
      globalError.classList.remove("d-none");
    }

    return isValid;
  }

  function attachSearchFormHandler(form, onSearchCompleted) {
    setSearchDateConstraints(form);
    populateSearchForm(form, getCurrentSearch());

    const input = form.querySelector("[name='searchText']");
    const clearBtn = form.querySelector(".clear-search-btn");

    if (input && clearBtn) {
      const toggleClearBtn = () => {
        clearBtn.classList.toggle("show", input.value.length > 0);
      };

      input.addEventListener("input", toggleClearBtn);
      toggleClearBtn();

      clearBtn.addEventListener("click", function() {
        input.value = "";
        toggleClearBtn();
        input.focus();
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!validateSearchForm(form)) {
        return;
      }

      const searchData = readSearchForm(form);
      const results = searchHotels(searchData.searchText);

      saveCurrentSearch(searchData);
      saveSearchResults(results);
      clearSelectedHotel();
      onSearchCompleted(results, searchData);
    });
  }

  window.HotelAppCommon = {
    buildSlides,
    searchHotels,
    getJson,
    setJson,
    getCurrentSearch,
    saveCurrentSearch,
    getSearchResults,
    saveSearchResults,
    getSelectedHotel,
    saveSelectedHotel,
    clearSelectedHotel,
    getReservations,
    saveReservations,
    calculateNightCount,
    calculateTotalAmount,
    formatCurrency,
    renderHotelCard,
    setSearchDateConstraints,
    populateSearchForm,
    readSearchForm,
    validateSearchForm,
    attachSearchFormHandler
  };
}());
