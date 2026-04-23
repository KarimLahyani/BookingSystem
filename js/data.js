(function () {
  const STORAGE_KEYS = {
    hotels: "hotelList",
    deals: "dealsList",
    popularSearches: "popularSearches",
    currentSearch: "currentSearch",
    searchResults: "searchResults",
    selectedHotel: "selectedHotel",
    reservations: "reservations",
    datasetVersion: "datasetVersion"
  };

  const DATASET_VERSION = "real-collected-data-v3";

  function buildPopularSearches(hotelList) {
    if (!hotelList || !hotelList.length) return [];
    const cityGroups = {};

    hotelList.forEach(function (hotel) {
      const cityName = hotel.city || "Unknown";
      if (!cityGroups[cityName]) {
        cityGroups[cityName] = [];
      }
      cityGroups[cityName].push(hotel);
    });

    return Object.keys(cityGroups)
      .map(function (city) {
        const hotelsInCity = cityGroups[city];
        const prices = hotelsInCity.map(function (hotel) {
          return hotel.pricePerNight;
        });
        const average = Math.round(prices.reduce(function (sum, value) {
          return sum + value;
        }, 0) / prices.length);

        return {
          title: city,
          details: `${hotelsInCity.length} hotels, average price TL ${average.toLocaleString("en-US")}, from TL ${Math.min(...prices).toLocaleString("en-US")} to TL ${Math.max(...prices).toLocaleString("en-US")}.`,
          imageUrl: hotelsInCity[0].mainImage
        };
      })
      .slice(0, 10);
  }

  function buildDeals(hotelList) {
    if (!hotelList || !hotelList.length) return [];
    return hotelList.slice(0, 10).map(hotel => ({
      title: `Special Deal: ${hotel.name}`,
      details: `${hotel.description ? hotel.description.substring(0, 100) : "Enjoy a comfortable stay at this top-rated hotel."}...`,
      chip: "Best Value",
      badge: "Limited Offer",
      imageUrl: hotel.mainImage,
      hotelId: hotel.id
    }));
  }

  function getRawHotels() {
    if (window.UploadedHotelSeed && window.UploadedHotelSeed.hotels) {
      return window.UploadedHotelSeed.hotels;
    }
    return [];
  }

  function readList(key) {
    return JSON.parse(sessionStorage.getItem(key) || "[]");
  }

  function setIfMissing(key, value) {
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  }

  function seedSessionData() {
    const existingVersion = sessionStorage.getItem(STORAGE_KEYS.datasetVersion);
    const hotels = getRawHotels();
    const deals = buildDeals(hotels);
    const popularSearches = buildPopularSearches(hotels);

    if (existingVersion !== DATASET_VERSION) {
      console.log("HotelApp: Seeding version", DATASET_VERSION);
      sessionStorage.setItem(STORAGE_KEYS.deals, JSON.stringify(deals));
      sessionStorage.setItem(STORAGE_KEYS.popularSearches, JSON.stringify(popularSearches));
      sessionStorage.removeItem(STORAGE_KEYS.currentSearch);
      sessionStorage.removeItem(STORAGE_KEYS.searchResults);
      sessionStorage.removeItem(STORAGE_KEYS.selectedHotel);
      sessionStorage.setItem(STORAGE_KEYS.datasetVersion, DATASET_VERSION);
    }

    setIfMissing(STORAGE_KEYS.reservations, []);
  }

  function getDefaultSearchState() {
    return {
      searchText: "",
      checkInDate: "",
      checkOutDate: "",
      guestCount: "",
      roomCount: ""
    };
  }

  window.HotelAppData = {
    STORAGE_KEYS,
    seedSessionData,
    getHotels: getRawHotels,
    getDeals: function () {
      return readList(STORAGE_KEYS.deals);
    },
    getPopularSearches: function () {
      return readList(STORAGE_KEYS.popularSearches);
    },
    getReservations: function () {
      return readList(STORAGE_KEYS.reservations);
    },
    getDefaultSearchState
  };
}());
