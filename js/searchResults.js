(function () {
  const { seedSessionData } = window.HotelAppData;
  const { attachSearchFormHandler, formatCurrency, getCurrentSearch, getSearchResults, saveSelectedHotel } = window.HotelAppCommon;

  function renderResults(results, searchData) {
    const heading = document.getElementById("resultsHeading");
    const badge = document.getElementById("resultsCountBadge");
    const grid = document.getElementById("resultsGrid");

    if (searchData.searchText) {
      heading.textContent = `Results for "${searchData.searchText}"`;
    } else {
      heading.textContent = "Search Results";
    }

    badge.textContent = `${results.length} hotel${results.length === 1 ? "" : "s"}`;

    if (!results.length) {
      grid.innerHTML = `
        <div class="empty-state p-4">
          <h3 class="h5">No hotels found</h3>
          <p class="mb-0 text-secondary">Try another city, hotel name or keyword in the search bar above.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = `
      <div class="row g-4">
        ${results.map((hotel) => `
          <div class="col-12 col-sm-6 col-lg-3">
            <button class="card hotel-card clickable-card shadow-sm border-0 text-start w-100 hotel-result-button p-0 overflow-hidden" type="button" data-hotel-id="${hotel.id}">
              <img src="${hotel.mainImage}" class="card-img-top" alt="${hotel.name}">
              <div class="card-body">
                <h3 class="h5 card-title">${hotel.name}</h3>
                <p class="mb-1 text-secondary">${hotel.city}</p>
                <p class="mb-1 small text-secondary">${hotel.address}</p>
                <p class="mb-1">Stars: ${hotel.starCount} | Rating: ${hotel.rating}</p>
                <p class="mb-0 fw-semibold">${formatCurrency(hotel.pricePerNight)} / night</p>
              </div>
            </button>
          </div>
        `).join("")}
      </div>
    `;

    grid.querySelectorAll(".hotel-result-button").forEach((button) => {
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

  document.addEventListener("DOMContentLoaded", function () {
    seedSessionData();
    const form = document.getElementById("searchForm");

    attachSearchFormHandler(form, function (results, searchData) {
      renderResults(results, searchData);
    });

    const currentSearch = getCurrentSearch();
    const existingResults = getSearchResults();
    const initialResults = currentSearch.searchText ? existingResults : [];
    renderResults(initialResults, currentSearch);
  });
}());
