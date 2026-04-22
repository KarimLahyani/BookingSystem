(function () {
  const { STORAGE_KEYS, getDeals, getPopularSearches, getDefaultSearchState, seedSessionData } = window.HotelAppData;
  const { attachSearchFormHandler, buildSlides, formatCurrency, getCurrentSearch, getSearchResults, saveCurrentSearch, saveSearchResults, saveSelectedHotel, searchHotels } = window.HotelAppCommon;

  function renderDealsSection() {
    const heading = document.getElementById("dynamicSectionHeading");
    const subheading = document.getElementById("dynamicSectionSubheading");
    const link = document.getElementById("seeMoreDealsLink");
    const container = document.getElementById("dynamicSectionContent");
    const deals = getDeals();

    heading.textContent = "Deals and Discounts";
    link.classList.add("d-none");

    container.innerHTML = renderCardCarousel("dealsCarousel", deals, function (deal) {
      return `
        <div class="card offer-card h-100 border-0 rounded-4 shadow-sm overflow-hidden">
          <img src="${deal.imageUrl}" class="card-img-top" alt="${deal.title}">
          <div class="card-body d-flex flex-column">
            <div class="d-flex flex-wrap gap-2 mb-2">
              <span class="deal-chip deal-chip-green">${deal.chip}</span>
              <span class="deal-chip deal-chip-red">${deal.badge}</span>
            </div>
            <h3 class="card-title h6 fw-bold mb-2">${deal.title}</h3>
            <p class="small text-secondary mb-3 flex-grow-1">${deal.details}</p>
            <button class="btn btn-link link-primary text-decoration-none text-uppercase fw-semibold small p-0 align-self-start" type="button">Learn more</button>
          </div>
        </div>
      `;
    });
  }

  function renderSearchPreview(results, searchData) {
    const heading = document.getElementById("dynamicSectionHeading");
    const subheading = document.getElementById("dynamicSectionSubheading");
    const link = document.getElementById("seeMoreDealsLink");
    const container = document.getElementById("dynamicSectionContent");

    heading.textContent = `Results for "${searchData.searchText}"`;
    subheading.textContent = `${results.length} hotel(s) found`;
    link.classList.remove("d-none");

    if (!results.length) {
      container.innerHTML = `
        <div class="empty-state p-4">
          <h3 class="h5">No hotels found</h3>
          <p class="mb-0 text-secondary">Try another city, hotel name or keyword in the search field.</p>
        </div>
      `;
      return;
    }

    const slides = buildSlides(results, 5);
    const indicatorsMarkup = slides.map((_, index) => `
      <button type="button" data-bs-target="#searchPreviewCarousel" data-bs-slide-to="${index}" class="${index === 0 ? "active" : ""}" aria-label="Slide ${index + 1}"></button>
    `).join("");

    const slidesMarkup = slides.map((slideItems, slideIndex) => `
      <div class="carousel-item ${slideIndex === 0 ? "active" : ""}">
        <div class="row g-3">
          ${slideItems.map((hotel) => `
            <div class="col-12 col-sm-6 col-lg">
              <button class="card hotel-card clickable-card shadow-sm border-0 h-100 text-start w-100 search-preview-button p-0 overflow-hidden" type="button" data-hotel-id="${hotel.id}">
                <img src="${hotel.mainImage}" class="card-img-top" alt="${hotel.name}">
                <div class="card-body">
                  <h3 class="h6 card-title">${hotel.name}</h3>
                  <p class="mb-1 text-secondary small">${hotel.city}</p>
                  <p class="mb-0 fw-semibold">${formatCurrency(hotel.pricePerNight)} / night</p>
                </div>
              </button>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("");

    container.innerHTML = `
      <div id="searchPreviewCarousel" class="carousel slide simple-carousel" data-bs-ride="false">
        <div class="carousel-indicators">${indicatorsMarkup}</div>
        <div class="carousel-inner py-4">${slidesMarkup}</div>
        <button class="carousel-control-prev" type="button" data-bs-target="#searchPreviewCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#searchPreviewCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    `;

    container.querySelectorAll(".search-preview-button").forEach((button) => {
      button.addEventListener("click", function () {
        const selectedHotel = results.find((hotel) => hotel.id === button.dataset.hotelId);
        const searchForm = document.getElementById("searchForm");
        const freshSearchData = searchForm ? window.HotelAppCommon.readSearchForm(searchForm) : searchData;
        
        saveSelectedHotel({
          ...selectedHotel,
          searchData: freshSearchData
        });
        window.location.href = "hotelDetails.html";
      });
    });
  }

  function renderCardCarousel(carouselId, items, renderCard) {
    const slides = buildSlides(items, 4);
    const indicatorsMarkup = slides.length > 1 ? `
      <div class="carousel-indicators">
        ${slides.map((_, index) => `
          <button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${index}" class="${index === 0 ? "active" : ""}" aria-label="Slide ${index + 1}"></button>
        `).join("")}
      </div>
    ` : "";

    const controlsMarkup = slides.length > 1 ? `
      <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    ` : "";

    return `
      <div id="${carouselId}" class="carousel slide simple-carousel" data-bs-ride="false">
        ${indicatorsMarkup}
        <div class="carousel-inner pb-4">
          ${slides.map((slideItems, slideIndex) => `
            <div class="carousel-item ${slideIndex === 0 ? "active" : ""}">
              <div class="row g-3">
                ${slideItems.map((item) => `
                  <div class="col-12 col-sm-6 col-lg-3">
                    ${renderCard(item)}
                  </div>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
        ${controlsMarkup}
      </div>
    `;
  }

  function renderPopularSearches() {
    const carouselWrapper = document.getElementById("popularSearchesCarouselWrapper");
    const items = getPopularSearches();
    carouselWrapper.innerHTML = renderCardCarousel("popularCarousel", items, function (item) {
      return `
        <button class="card popular-card clickable-card text-start w-100 h-100 border rounded-4 shadow-sm overflow-hidden popular-search-button p-0" type="button" data-title="${item.title}">
          <img src="${item.imageUrl}" class="card-img-top" alt="${item.title}">
          <div class="card-body d-flex flex-column">
            <h3 class="card-title h6 fw-bold mb-2">${item.title}</h3>
            <p class="small text-secondary mb-0 flex-grow-1">${item.details}</p>
          </div>
        </button>
      `;
    });

    carouselWrapper.querySelectorAll(".popular-search-button").forEach((button) => {
      button.addEventListener("click", function () {
        const searchData = {
          ...getDefaultSearchState(),
          ...getCurrentSearch(),
          searchText: button.dataset.title
        };
        const results = searchHotels(searchData.searchText);
        saveCurrentSearch(searchData);
        saveSearchResults(results);
        window.location.href = "searchResults.html";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    seedSessionData();

    const currentSearch = getCurrentSearch();
    const defaultSearchState = getDefaultSearchState();
    
    // If no search state exists, use default
    if (!currentSearch || !currentSearch.searchText) {
        saveCurrentSearch(defaultSearchState);
    }

    renderPopularSearches();
    renderDealsSection();

    attachSearchFormHandler(document.getElementById("searchForm"), function (results, searchData) {
      renderSearchPreview(results, searchData);
    });
  });
}());
