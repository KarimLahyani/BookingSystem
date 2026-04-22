(function () {
  const uploadedSeed = window.UploadedHotelSeed || {};
  const DATASET_VERSION = "turkish-cities-english-ui-v3";
  const TRY_RATE = 32;
  const TURKISH_CITY_PLANS = [
    { city: "Antalya", area: "Lara" },
    { city: "Mugla", area: "Bodrum" },
    { city: "Cappadocia", area: "Goreme" },
    { city: "Istanbul", area: "Besiktas" },
    { city: "Izmir", area: "Alsancak" },
    { city: "Trabzon", area: "Uzungol" },
    { city: "Ankara", area: "Cankaya" },
    { city: "Bursa", area: "Nilufer" },
    { city: "Fethiye", area: "Oludeniz" },
    { city: "Alacati", area: "Cesme" },
    { city: "Mardin", area: "Artuklu" },
    { city: "Gaziantep", area: "Sehitkamil" }
  ];

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

  const fallbackHotels = [
    {
      id: "hotel-antalya-1",
      name: "Azure Coast Hotel",
      city: "Antalya",
      address: "12 Lara Beach Road, Antalya, Turkey",
      description: "Beachfront hotel with modern rooms, a large pool and easy access to the city center.",
      info: "Ideal for family holidays near Lara Beach with breakfast included.",
      starCount: 5,
      rating: 8.9,
      ratingCount: 2140,
      pricePerNight: 185,
      mainImage: "https://picsum.photos/seed/azure-coast-main/1200/700",
      images: [
        "https://picsum.photos/seed/azure-coast-main/1200/700",
        "https://picsum.photos/seed/azure-coast-room/1200/700",
        "https://picsum.photos/seed/azure-coast-pool/1200/700"
      ],
      rules: [
        "Check-in starts at 14:00.",
        "Check-out is until 12:00.",
        "Free cancellation up to 48 hours before arrival.",
        "Pets are not allowed."
      ],
      roomTypes: [
        { name: "Standard Room", multiplier: 1 },
        { name: "Deluxe Room", multiplier: 1.2 },
        { name: "Family Suite", multiplier: 1.45 }
      ]
    },
    {
      id: "hotel-antalya-2",
      name: "Sunset Marina Resort",
      city: "Antalya",
      address: "48 Old Harbor Avenue, Antalya, Turkey",
      description: "Comfortable marina resort close to restaurants and historic attractions.",
      info: "Good choice for couples who want sea views and walkable nightlife.",
      starCount: 4,
      rating: 8.5,
      ratingCount: 1512,
      pricePerNight: 142,
      mainImage: "https://picsum.photos/seed/sunset-marina-main/1200/700",
      images: [
        "https://picsum.photos/seed/sunset-marina-main/1200/700",
        "https://picsum.photos/seed/sunset-marina-lobby/1200/700",
        "https://picsum.photos/seed/sunset-marina-view/1200/700"
      ],
      rules: [
        "Check-in starts at 14:00.",
        "Check-out is until 11:00.",
        "Free cancellation up to 24 hours before arrival.",
        "Pets are not allowed."
      ],
      roomTypes: [
        { name: "Economy Room", multiplier: 1 },
        { name: "Sea View Room", multiplier: 1.15 },
        { name: "Junior Suite", multiplier: 1.35 }
      ]
    },
    {
      id: "hotel-istanbul-1",
      name: "Golden Bosphorus Stay",
      city: "Istanbul",
      address: "35 Besiktas Square, Istanbul, Turkey",
      description: "City hotel with quick access to ferries, cafes and central business districts.",
      info: "A simple and central option near the Bosphorus.",
      starCount: 4,
      rating: 8.7,
      ratingCount: 1930,
      pricePerNight: 165,
      mainImage: "https://picsum.photos/seed/golden-bosphorus-main/1200/700",
      images: [
        "https://picsum.photos/seed/golden-bosphorus-main/1200/700",
        "https://picsum.photos/seed/golden-bosphorus-room/1200/700",
        "https://picsum.photos/seed/golden-bosphorus-restaurant/1200/700"
      ],
      rules: [
        "Check-in starts at 15:00.",
        "Check-out is until 12:00.",
        "Free cancellation up to 72 hours before arrival.",
        "Small pets are allowed on request."
      ],
      roomTypes: [
        { name: "Standard Room", multiplier: 1 },
        { name: "Superior Room", multiplier: 1.18 },
        { name: "Executive Suite", multiplier: 1.5 }
      ]
    },
    {
      id: "hotel-istanbul-2",
      name: "Old Town Comfort Hotel",
      city: "Istanbul",
      address: "87 Sultanahmet Street, Istanbul, Turkey",
      description: "Historic district stay close to major landmarks and tram connections.",
      info: "Popular with visitors looking for museums, mosques and old city walks.",
      starCount: 3,
      rating: 8.1,
      ratingCount: 1298,
      pricePerNight: 118,
      mainImage: "https://picsum.photos/seed/old-town-comfort-main/1200/700",
      images: [
        "https://picsum.photos/seed/old-town-comfort-main/1200/700",
        "https://picsum.photos/seed/old-town-comfort-room/1200/700",
        "https://picsum.photos/seed/old-town-comfort-courtyard/1200/700"
      ],
      rules: [
        "Check-in starts at 14:00.",
        "Check-out is until 11:30.",
        "Free cancellation up to 24 hours before arrival.",
        "Pets are not allowed."
      ],
      roomTypes: [
        { name: "Single Room", multiplier: 1 },
        { name: "Double Room", multiplier: 1.1 },
        { name: "Family Room", multiplier: 1.3 }
      ]
    },
    {
      id: "hotel-cappadocia-1",
      name: "Moon Valley Cave Suites",
      city: "Cappadocia",
      address: "6 Goreme Hillside, Nevsehir, Turkey",
      description: "Cave-style suites with sunrise balloon views and a quiet terrace.",
      info: "A scenic stay for travelers who want local atmosphere and valley views.",
      starCount: 5,
      rating: 9.2,
      ratingCount: 1688,
      pricePerNight: 205,
      mainImage: "https://picsum.photos/seed/moon-valley-main/1200/700",
      images: [
        "https://picsum.photos/seed/moon-valley-main/1200/700",
        "https://picsum.photos/seed/moon-valley-suite/1200/700",
        "https://picsum.photos/seed/moon-valley-terrace/1200/700"
      ],
      rules: [
        "Check-in starts at 14:00.",
        "Check-out is until 11:00.",
        "Free cancellation up to 72 hours before arrival.",
        "Pets are not allowed."
      ],
      roomTypes: [
        { name: "Stone Room", multiplier: 1 },
        { name: "Cave Suite", multiplier: 1.22 },
        { name: "Panoramic Suite", multiplier: 1.48 }
      ]
    },
    {
      id: "hotel-cappadocia-2",
      name: "Sky Lantern Inn",
      city: "Cappadocia",
      address: "19 Uchisar Viewpoint, Nevsehir, Turkey",
      description: "Boutique inn with open-air breakfast and fast access to local tours.",
      info: "Best for couples and small groups visiting the fairy chimneys.",
      starCount: 4,
      rating: 8.8,
      ratingCount: 1045,
      pricePerNight: 149,
      mainImage: "https://picsum.photos/seed/sky-lantern-main/1200/700",
      images: [
        "https://picsum.photos/seed/sky-lantern-main/1200/700",
        "https://picsum.photos/seed/sky-lantern-room/1200/700",
        "https://picsum.photos/seed/sky-lantern-breakfast/1200/700"
      ],
      rules: [
        "Check-in starts at 14:00.",
        "Check-out is until 11:00.",
        "Free cancellation up to 48 hours before arrival.",
        "Pets are allowed on request."
      ],
      roomTypes: [
        { name: "Classic Room", multiplier: 1 },
        { name: "Deluxe Cave Room", multiplier: 1.2 },
        { name: "Terrace Suite", multiplier: 1.4 }
      ]
    },
    {
      id: "hotel-izmir-1",
      name: "Blue Harbor Izmir",
      city: "Izmir",
      address: "25 Kordon Avenue, Izmir, Turkey",
      description: "Seaside property with bright rooms and simple business facilities.",
      info: "Close to the waterfront and convenient for city breaks.",
      starCount: 4,
      rating: 8.4,
      ratingCount: 987,
      pricePerNight: 132,
      mainImage: "https://picsum.photos/seed/blue-harbor-main/1200/700",
      images: [
        "https://picsum.photos/seed/blue-harbor-main/1200/700",
        "https://picsum.photos/seed/blue-harbor-room/1200/700",
        "https://picsum.photos/seed/blue-harbor-lounge/1200/700"
      ],
      rules: [
        "Check-in starts at 14:00.",
        "Check-out is until 12:00.",
        "Free cancellation up to 24 hours before arrival.",
        "Pets are not allowed."
      ],
      roomTypes: [
        { name: "Standard Room", multiplier: 1 },
        { name: "Corner Room", multiplier: 1.14 },
        { name: "Suite", multiplier: 1.36 }
      ]
    },
    {
      id: "hotel-bodrum-1",
      name: "Aegean Breeze Resort",
      city: "Bodrum",
      address: "51 Yalikavak Coast, Bodrum, Turkey",
      description: "Relaxed resort with beach shuttle, pool deck and family rooms.",
      info: "Good destination for summer trips and beach-focused stays.",
      starCount: 5,
      rating: 8.9,
      ratingCount: 1765,
      pricePerNight: 210,
      mainImage: "https://picsum.photos/seed/aegean-breeze-main/1200/700",
      images: [
        "https://picsum.photos/seed/aegean-breeze-main/1200/700",
        "https://picsum.photos/seed/aegean-breeze-room/1200/700",
        "https://picsum.photos/seed/aegean-breeze-pool/1200/700"
      ],
      rules: [
        "Check-in starts at 15:00.",
        "Check-out is until 12:00.",
        "Free cancellation up to 72 hours before arrival.",
        "Pets are not allowed."
      ],
      roomTypes: [
        { name: "Garden Room", multiplier: 1 },
        { name: "Sea View Room", multiplier: 1.18 },
        { name: "Family Suite", multiplier: 1.44 }
      ]
    },
    {
      id: "hotel-ankara-1",
      name: "Capital View Suites",
      city: "Ankara",
      address: "14 Cankaya Boulevard, Ankara, Turkey",
      description: "Clean and practical city hotel close to ministries and shopping areas.",
      info: "Works well for business travel and short weekend visits.",
      starCount: 4,
      rating: 8.3,
      ratingCount: 1104,
      pricePerNight: 126,
      mainImage: "https://picsum.photos/seed/capital-view-main/1200/700",
      images: [
        "https://picsum.photos/seed/capital-view-main/1200/700",
        "https://picsum.photos/seed/capital-view-room/1200/700",
        "https://picsum.photos/seed/capital-view-lobby/1200/700"
      ],
      rules: [
        "Check-in starts at 14:00.",
        "Check-out is until 12:00.",
        "Free cancellation up to 24 hours before arrival.",
        "Pets are not allowed."
      ],
      roomTypes: [
        { name: "Business Room", multiplier: 1 },
        { name: "Superior Room", multiplier: 1.17 },
        { name: "Executive Room", multiplier: 1.32 }
      ]
    },
    {
      id: "hotel-trabzon-1",
      name: "Green Hills Lodge",
      city: "Trabzon",
      address: "72 Uzungol Road, Trabzon, Turkey",
      description: "Nature-focused lodge with mountain views and quiet family accommodation.",
      info: "A calm option for travelers planning a Black Sea getaway.",
      starCount: 4,
      rating: 8.6,
      ratingCount: 844,
      pricePerNight: 138,
      mainImage: "https://picsum.photos/seed/green-hills-main/1200/700",
      images: [
        "https://picsum.photos/seed/green-hills-main/1200/700",
        "https://picsum.photos/seed/green-hills-room/1200/700",
        "https://picsum.photos/seed/green-hills-balcony/1200/700"
      ],
      rules: [
        "Check-in starts at 14:00.",
        "Check-out is until 11:00.",
        "Free cancellation up to 48 hours before arrival.",
        "Pets are allowed on request."
      ],
      roomTypes: [
        { name: "Standard Room", multiplier: 1 },
        { name: "Lake View Room", multiplier: 1.16 },
        { name: "Family Suite", multiplier: 1.38 }
      ]
    },
    {
      id: "hotel-fethiye-1",
      name: "Turquoise Bay Retreat",
      city: "Fethiye",
      address: "41 Oludeniz Road, Fethiye, Turkey",
      description: "Simple coastal retreat near the beach, paragliding area and restaurants.",
      info: "A popular destination for summer bookings and sea activities.",
      starCount: 4,
      rating: 8.7,
      ratingCount: 1382,
      pricePerNight: 154,
      mainImage: "https://picsum.photos/seed/turquoise-bay-main/1200/700",
      images: [
        "https://picsum.photos/seed/turquoise-bay-main/1200/700",
        "https://picsum.photos/seed/turquoise-bay-room/1200/700",
        "https://picsum.photos/seed/turquoise-bay-pool/1200/700"
      ],
      rules: [
        "Check-in starts at 14:00.",
        "Check-out is until 12:00.",
        "Free cancellation up to 48 hours before arrival.",
        "Pets are not allowed."
      ],
      roomTypes: [
        { name: "Garden Room", multiplier: 1 },
        { name: "Pool View Room", multiplier: 1.14 },
        { name: "Junior Suite", multiplier: 1.34 }
      ]
    },
    {
      id: "hotel-izmir-2",
      name: "Pearl Konak Hotel",
      city: "Izmir",
      address: "8 Konak Square, Izmir, Turkey",
      description: "Comfortable downtown hotel close to transport, shopping and local food spots.",
      info: "Good budget-friendly option for exploring the city center.",
      starCount: 3,
      rating: 8.0,
      ratingCount: 912,
      pricePerNight: 109,
      mainImage: "https://picsum.photos/seed/pearl-konak-main/1200/700",
      images: [
        "https://picsum.photos/seed/pearl-konak-main/1200/700",
        "https://picsum.photos/seed/pearl-konak-room/1200/700",
        "https://picsum.photos/seed/pearl-konak-breakfast/1200/700"
      ],
      rules: [
        "Check-in starts at 14:00.",
        "Check-out is until 11:30.",
        "Free cancellation up to 24 hours before arrival.",
        "Pets are not allowed."
      ],
      roomTypes: [
        { name: "Single Room", multiplier: 1 },
        { name: "Double Room", multiplier: 1.08 },
        { name: "Triple Room", multiplier: 1.22 }
      ]
    }
  ];

  const deals = [
    {
      title: "Hot Deals in Antalya",
      details: "Up to 35% lower prices on Lara and Konyaalti hotels for early summer reservations.",
      chip: "Family Friendly",
      badge: "35% off",
      imageUrl: "https://picsum.photos/seed/deal-summer/1200/700"
    },
    {
      title: "Istanbul City Escape",
      details: "Popular city hotels with breakfast included and flexible cancellation options.",
      chip: "City Escape",
      badge: "Breakfast included",
      imageUrl: "https://picsum.photos/seed/deal-city/1200/700"
    },
    {
      title: "Mugla Coast Offers",
      details: "Simple seaside stays in Bodrum and Fethiye with discounted weekly prices.",
      chip: "Coastal Stay",
      badge: "Weekly offer",
      imageUrl: "https://picsum.photos/seed/deal-family/1200/700"
    },
    {
      title: "Cappadocia Weekend",
      details: "Cave-style rooms and boutique hotels with free cancellation for short trips.",
      chip: "Weekend Trip",
      badge: "Free cancellation",
      imageUrl: "https://picsum.photos/seed/deal-weekend/1200/700"
    }
  ];

  const fallbackPopularSearches = [
    {
      title: "Antalya",
      details: "2 hotels, average price TL 5,248, beach and marina locations.",
      imageUrl: "https://picsum.photos/seed/popular-antalya/1200/700"
    },
    {
      title: "Istanbul",
      details: "2 hotels, average price TL 4,544, old town and Bosphorus options.",
      imageUrl: "https://picsum.photos/seed/popular-istanbul/1200/700"
    },
    {
      title: "Cappadocia",
      details: "2 hotels, average price TL 5,664, cave stays and valley views.",
      imageUrl: "https://picsum.photos/seed/popular-cappadocia/1200/700"
    },
    {
      title: "Izmir",
      details: "2 hotels, average price TL 3,872, coastal and downtown choices.",
      imageUrl: "https://picsum.photos/seed/popular-izmir/1200/700"
    }
  ];

  function buildGenericDescription(hotelName, city) {
    return `${hotelName} offers a simple stay in ${city} with comfortable rooms, practical facilities and easy access to popular areas.`;
  }

  function buildGenericInfo(starCount, city, ratingCount) {
    return `${starCount}-star hotel in ${city} with ${ratingCount} review(s), breakfast options and a convenient location.`;
  }

  function localizeHotels(sourceHotels) {
    return sourceHotels.map(function (hotel, index) {
      const cityPlan = TURKISH_CITY_PLANS[index % TURKISH_CITY_PLANS.length];
      const localizedPrice = Math.round((hotel.pricePerNight || 140) * TRY_RATE);

      return {
        ...hotel,
        city: cityPlan.city,
        address: `${cityPlan.area}, ${cityPlan.city}, Turkey`,
        description: buildGenericDescription(hotel.name, cityPlan.city),
        info: buildGenericInfo(hotel.starCount || 4, cityPlan.city, hotel.ratingCount || 0),
        pricePerNight: localizedPrice
      };
    });
  }

  function buildPopularSearches(hotelList) {
    const cityGroups = {};

    hotelList.forEach(function (hotel) {
      if (!cityGroups[hotel.city]) {
        cityGroups[hotel.city] = [];
      }
      cityGroups[hotel.city].push(hotel);
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
      .slice(0, 6);
  }

  const hotels = uploadedSeed.hotels && uploadedSeed.hotels.length
    ? localizeHotels(uploadedSeed.hotels)
    : localizeHotels(fallbackHotels);
  const popularSearches = buildPopularSearches(hotels).length
    ? buildPopularSearches(hotels)
    : fallbackPopularSearches;

  function setIfMissing(key, value) {
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  }

  function seedSessionData() {
    const existingVersion = sessionStorage.getItem(STORAGE_KEYS.datasetVersion);

    if (existingVersion !== DATASET_VERSION) {
      sessionStorage.setItem(STORAGE_KEYS.hotels, JSON.stringify(hotels));
      sessionStorage.setItem(STORAGE_KEYS.deals, JSON.stringify(deals));
      sessionStorage.setItem(STORAGE_KEYS.popularSearches, JSON.stringify(popularSearches));
      sessionStorage.removeItem(STORAGE_KEYS.currentSearch);
      sessionStorage.removeItem(STORAGE_KEYS.searchResults);
      sessionStorage.removeItem(STORAGE_KEYS.selectedHotel);
      sessionStorage.setItem(STORAGE_KEYS.datasetVersion, DATASET_VERSION);
    }

    setIfMissing(STORAGE_KEYS.reservations, []);
  }

  function readList(key) {
    return JSON.parse(sessionStorage.getItem(key) || "[]");
  }

  function formatLocalDate(dateValue) {
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, "0");
    const day = String(dateValue.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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
    getHotels: function () {
      return readList(STORAGE_KEYS.hotels);
    },
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

