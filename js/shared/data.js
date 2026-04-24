(function () {
  const STORAGE_KEYS = {
    hotels: "hotelList",
    deals: "dealsList",
    popularSearches: "popularSearches",
    currentSearch: "currentSearch",
    searchResults: "searchResults",
    selectedHotel: "selectedHotel",
    reservations: "reservations"
  };

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
      .slice(0, 12);
  }

  function buildDeals() {
    return [
      {
        title: "Romantic Escape",
        details: "Luxury suite, candlelit dinner, and late checkout for the perfect couple's retreat.",
        chip: "Romantic",
        badge: "Hot Deal",
        imageUrl: "images/romantic.png",
        hotelId: "tr-01"
      },
      {
        title: "Family Fun Adventure",
        details: "Free kids' club, water park access, and spacious family rooms with all-inclusive meals.",
        chip: "Family",
        badge: "Bestseller",
        imageUrl: "images/family.png",
        hotelId: "tr-08"
      },
      {
        title: "Wellness & Spa Retreat",
        details: "Unlimited spa access, yoga sessions, and organic breakfast to rejuvenate your soul.",
        chip: "Wellness",
        badge: "Top Rated",
        imageUrl: "images/spa.png",
        hotelId: "tr-07"
      },
      {
        title: "City Explorer Bundle",
        details: "Prime city location, free metro pass, and guided walking tour included in your stay.",
        chip: "Urban",
        badge: "New",
        imageUrl: "images/city.png",
        hotelId: "tr-06"
      }
    ];
  }

  function getRawHotels() {
    if (window.UploadedHotelSeed && window.UploadedHotelSeed.hotels) {
      const hotels = window.UploadedHotelSeed.hotels;
      const apiKey = (window.HotelAppConfig && window.HotelAppConfig.googleMapsApiKey) || "";

      if (!apiKey) return hotels;

      hotels.forEach(hotel => {
        if (hotel.mainImage && hotel.mainImage.includes("googleapis.com") && !hotel.mainImage.includes("&key=")) {
          hotel.mainImage += `&key=${apiKey}`;
        }
        if (hotel.images) {
          hotel.images = hotel.images.map(img => {
            if (img.includes("googleapis.com") && !img.includes("&key=")) {
              return img + `&key=${apiKey}`;
            }
            return img;
          });
        }
      });

      return hotels;
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
    const hotels = getRawHotels();
    const deals = buildDeals();
    const popularSearches = buildPopularSearches(hotels);

    sessionStorage.setItem(STORAGE_KEYS.deals, JSON.stringify(deals));
    sessionStorage.setItem(STORAGE_KEYS.popularSearches, JSON.stringify(popularSearches));
    
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
