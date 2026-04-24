(function () {
  const { seedSessionData } = window.HotelAppData;
  const { attachSearchFormHandler, formatCurrency, getCurrentSearch, getSearchResults, saveSelectedHotel } = window.HotelAppCommon;

  function renderResults(results, searchData) {
    const heading = document.getElementById("resultsHeading");
    const badge = document.getElementById("resultsCountBadge");
    const grid = document.getElementById("resultsGrid");

    const sortedResults = [...results].sort((a, b) => a.name.localeCompare(b.name));

    if (searchData.searchText) {
      heading.textContent = `Results for "${searchData.searchText}"`;
    } else {
      heading.textContent = "Search Results";
    }

    badge.textContent = `${sortedResults.length} hotel${sortedResults.length === 1 ? "" : "s"}`;

    if (!sortedResults.length) {
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
        ${sortedResults.map((hotel) => `
          <div class="col-12 col-sm-6 col-lg-3">
            ${window.HotelAppCommon.renderHotelCard(hotel, { isSearchPage: true })}
          </div>
        `).join("")}
      </div>
    `;

    grid.querySelectorAll(".hotel-result-button").forEach((button) => {
      button.addEventListener("click", function () {
        const selectedHotel = sortedResults.find((hotel) => hotel.id === button.dataset.hotelId);
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
