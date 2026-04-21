(function () {
  const uploadedSeed = window.UploadedHotelSeed || {};
  const DATASET_VERSION = "turkish-cities-english-ui-v7";
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
        { name: "Standard Room", multiplier: 1, guestCount: 2 },
        { name: "Deluxe Room", multiplier: 1.2, guestCount: 2 },
        { name: "Family Suite", multiplier: 1.45, guestCount: 4 }
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
        { name: "Economy Room", multiplier: 1, guestCount: 1 },
        { name: "Sea View Room", multiplier: 1.15, guestCount: 2 },
        { name: "Junior Suite", multiplier: 1.35, guestCount: 3 }
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
        { name: "Standard Room", multiplier: 1, guestCount: 2 },
        { name: "Superior Room", multiplier: 1.18, guestCount: 2 },
        { name: "Executive Suite", multiplier: 1.5, guestCount: 4 }
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
        { name: "Single Room", multiplier: 1, guestCount: 1 },
        { name: "Double Room", multiplier: 1.1, guestCount: 2 },
        { name: "Family Room", multiplier: 1.3, guestCount: 4 }
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
        { name: "Stone Room", multiplier: 1, guestCount: 2 },
        { name: "Cave Suite", multiplier: 1.22, guestCount: 2 },
        { name: "Panoramic Suite", multiplier: 1.48, guestCount: 4 }
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
        { name: "Classic Room", multiplier: 1, guestCount: 2 },
        { name: "Deluxe Cave Room", multiplier: 1.2, guestCount: 2 },
        { name: "Terrace Suite", multiplier: 1.4, guestCount: 3 }
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
        { name: "Standard Room", multiplier: 1, guestCount: 2 },
        { name: "Corner Room", multiplier: 1.14, guestCount: 2 },
        { name: "Suite", multiplier: 1.36, guestCount: 4 }
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
        { name: "Garden Room", multiplier: 1, guestCount: 2 },
        { name: "Sea View Room", multiplier: 1.18, guestCount: 2 },
        { name: "Family Suite", multiplier: 1.44, guestCount: 4 }
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
        { name: "Business Room", multiplier: 1, guestCount: 1 },
        { name: "Superior Room", multiplier: 1.17, guestCount: 2 },
        { name: "Executive Room", multiplier: 1.32, guestCount: 2 }
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
        { name: "Standard Room", multiplier: 1, guestCount: 2 },
        { name: "Lake View Room", multiplier: 1.16, guestCount: 2 },
        { name: "Family Suite", multiplier: 1.38, guestCount: 4 }
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
        { name: "Garden Room", multiplier: 1, guestCount: 2 },
        { name: "Pool View Room", multiplier: 1.14, guestCount: 2 },
        { name: "Junior Suite", multiplier: 1.34, guestCount: 3 }
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
        { name: "Single Room", multiplier: 1, guestCount: 1 },
        { name: "Double Room", multiplier: 1.08, guestCount: 2 },
        { name: "Triple Room", multiplier: 1.22, guestCount: 3 }
      ]
    },
    {
      id: "hotel-antalya-3",
      name: "Lara Royal Palace",
      city: "Antalya",
      address: "100 Lara Beach Road, Antalya, Turkey",
      description: "Luxurious resort offering wide pools, spa centers, and private beach access.",
      info: "Perfect for a lavish summer vacation with top-class amenities.",
      starCount: 5,
      rating: 9.3,
      ratingCount: 3120,
      pricePerNight: 245,
      mainImage: "https://picsum.photos/seed/lara-royal-main/1200/700",
      images: [
        "https://picsum.photos/seed/lara-royal-main/1200/700",
        "https://picsum.photos/seed/lara-royal-room/1200/700",
        "https://picsum.photos/seed/lara-royal-pool/1200/700"
      ],
      rules: [
        "Check-in starts at 14:00.",
        "Check-out is until 12:00.",
        "Free cancellation up to 48 hours before arrival.",
        "Pets are not allowed."
      ],
      roomTypes: [
        { name: "Standard Room", multiplier: 1, guestCount: 2 },
        { name: "Sea View Room", multiplier: 1.25, guestCount: 2 },
        { name: "King Suite", multiplier: 1.6, guestCount: 4 }
      ]
    },
    {
      id: "hotel-antalya-4",
      name: "Konyaalti Beach Stay",
      city: "Antalya",
      address: "22 Konyaalti Blvd, Antalya, Turkey",
      description: "Cozy beachfront hotel with great access to local cafes and parks.",
      info: "Ideal for easy-going travelers wanting quick access to the beach and city life.",
      starCount: 4,
      rating: 8.5,
      ratingCount: 980,
      pricePerNight: 120,
      mainImage: "https://picsum.photos/seed/konyaalti-beach-main/1200/700",
      images: [
        "https://picsum.photos/seed/konyaalti-beach-main/1200/700",
        "https://picsum.photos/seed/konyaalti-beach-room/1200/700",
        "https://picsum.photos/seed/konyaalti-beach-patio/1200/700"
      ],
      rules: [
        "Check-in starts at 14:00.",
        "Check-out is until 11:00.",
        "Free cancellation up to 24 hours before arrival.",
        "Pets are allowed on request."
      ],
      roomTypes: [
        { name: "Economy Room", multiplier: 1, guestCount: 1 },
        { name: "Double Room", multiplier: 1.1, guestCount: 2 },
        { name: "Family Room", multiplier: 1.35, guestCount: 4 }
      ]
    },
    {
      id: "hotel-istanbul-3",
      name: "Galata Tower View",
      city: "Istanbul",
      address: "15 Beyoglu District, Istanbul, Turkey",
      description: "Boutique hotel giving you a stunning view of the iconic Galata Tower from your balcony.",
      info: "Unbeatable location for exploring Istanbul's vibrant culture and nightlife.",
      starCount: 4,
      rating: 9.1,
      ratingCount: 1450,
      pricePerNight: 180,
      mainImage: "https://picsum.photos/seed/galata-tower-main/1200/700",
      images: [
        "https://picsum.photos/seed/galata-tower-main/1200/700",
        "https://picsum.photos/seed/galata-tower-room/1200/700",
        "https://picsum.photos/seed/galata-tower-balcony/1200/700"
      ],
      rules: [
        "Check-in starts at 15:00.",
        "Check-out is until 12:00.",
        "Free cancellation up to 72 hours before arrival.",
        "Pets are not allowed."
      ],
      roomTypes: [
        { name: "Classic Room", multiplier: 1, guestCount: 2 },
        { name: "Balcony Room", multiplier: 1.2, guestCount: 2 },
        { name: "Tower View Suite", multiplier: 1.45, guestCount: 3 }
      ]
    },
    {
      id: "hotel-istanbul-4",
      name: "Sultanahmet Palace",
      city: "Istanbul",
      address: "5 Fatih Square, Istanbul, Turkey",
      description: "Elegant accommodation near the Blue Mosque and Hagia Sophia.",
      info: "Step directly into history with luxurious rooms and traditional Turkish breakfasts.",
      starCount: 5,
      rating: 8.9,
      ratingCount: 2011,
      pricePerNight: 220,
      mainImage: "https://picsum.photos/seed/sultanahmet-palace-main/1200/700",
      images: [
        "https://picsum.photos/seed/sultanahmet-palace-main/1200/700",
        "https://picsum.photos/seed/sultanahmet-palace-room/1200/700",
        "https://picsum.photos/seed/sultanahmet-palace-dining/1200/700"
      ],
      rules: [
        "Check-in starts at 14:00.",
        "Check-out is until 11:30.",
        "Free cancellation up to 48 hours before arrival.",
        "Small pets are allowed."
      ],
      roomTypes: [
        { name: "Standard Room", multiplier: 1, guestCount: 2 },
        { name: "Deluxe Palace Room", multiplier: 1.3, guestCount: 2 },
        { name: "Royal Suite", multiplier: 1.55, guestCount: 4 }
      ]
    },
    {
      id: "hotel-izmir-3",
      name: "Karsiyaka Comfort",
      city: "Izmir",
      address: "42 Karsiyaka Coast, Izmir, Turkey",
      description: "A simple, affordable hotel located right on the bustling Karsiyaka shoreline.",
      info: "Perfect for budget travelers who want beautiful sunset views over the Aegean Sea.",
      starCount: 3,
      rating: 7.9,
      ratingCount: 540,
      pricePerNight: 85,
      mainImage: "https://picsum.photos/seed/karsiyaka-comfort-main/1200/700",
      images: [
        "https://picsum.photos/seed/karsiyaka-comfort-main/1200/700",
        "https://picsum.photos/seed/karsiyaka-comfort-room/1200/700",
        "https://picsum.photos/seed/karsiyaka-comfort-lobby/1200/700"
      ],
      rules: [
        "Check-in starts at 13:00.",
        "Check-out is until 11:00.",
        "Free cancellation up to 24 hours before arrival.",
        "Pets are allowed."
      ],
      roomTypes: [
        { name: "Single Room", multiplier: 1, guestCount: 1 },
        { name: "Double Room", multiplier: 1.1, guestCount: 2 },
        { name: "Triple Room", multiplier: 1.25, guestCount: 3 }
      ]
    },
    {
      id: "hotel-izmir-4",
      name: "Cesme Marina Boutique",
      city: "Izmir",
      address: "18 Marina Way, Cesme, Izmir, Turkey",
      description: "Chic boutique hotel located next to the famous Cesme Marina and Castle.",
      info: "A premium spot to enjoy seaside dining, shopping, and vibrant summer nights.",
      starCount: 4,
      rating: 8.8,
      ratingCount: 1120,
      pricePerNight: 165,
      mainImage: "https://picsum.photos/seed/cesme-marina-main/1200/700",
      images: [
        "https://picsum.photos/seed/cesme-marina-main/1200/700",
        "https://picsum.photos/seed/cesme-marina-room/1200/700",
        "https://picsum.photos/seed/cesme-marina-pool/1200/700"
      ],
      rules: [
        "Check-in starts at 14:00.",
        "Check-out is until 12:00.",
        "Free cancellation up to 72 hours before arrival.",
        "Pets are not allowed."
      ],
      roomTypes: [
        { name: "Standard Room", multiplier: 1, guestCount: 2 },
        { name: "Marina View Room", multiplier: 1.2, guestCount: 2 },
        { name: "Boutique Suite", multiplier: 1.4, guestCount: 4 }
      ]
    },
    {
      id: "hotel-antalya-5",
      name: "Olympos Pine Resort",
      city: "Antalya",
      address: "88 Olympos Valley, Antalya, Turkey",
      description: "A peaceful retreat surrounded by pine forests at the edge of the Mediterranean.",
      info: "Great for nature lovers looking for a mix of sea, sun, and green landscapes.",
      starCount: 4,
      rating: 8.7,
      ratingCount: 654,
      pricePerNight: 140,
      mainImage: "https://picsum.photos/seed/olympos-pine-main/1200/700",
      images: [
        "https://picsum.photos/seed/olympos-pine-main/1200/700",
        "https://picsum.photos/seed/olympos-pine-room/1200/700",
        "https://picsum.photos/seed/olympos-pine-nature/1200/700"
      ],
      rules: [
        "Check-in starts at 14:00.",
        "Check-out is until 11:30.",
        "Free cancellation up to 48 hours before arrival.",
        "Pets are allowed."
      ],
      roomTypes: [
        { name: "Forest Room", multiplier: 1, guestCount: 2 },
        { name: "Bungalow", multiplier: 1.3, guestCount: 3 },
        { name: "Villa", multiplier: 1.6, guestCount: 5 }
      ]
    },
    {
      id: "hotel-antalya-6",
      name: "Belek Golf Spa Hotel",
      city: "Antalya",
      address: "12 Belek Tourism Center, Antalya, Turkey",
      description: "All-inclusive golf resort offering massive pools, a championship golf course, and spa.",
      info: "Luxury and exclusivity combined, tailored for golfers and families needing maximum relaxation.",
      starCount: 5,
      rating: 9.6,
      ratingCount: 4230,
      pricePerNight: 350,
      mainImage: "https://picsum.photos/seed/belek-golf-main/1200/700",
      images: [
        "https://picsum.photos/seed/belek-golf-main/1200/700",
        "https://picsum.photos/seed/belek-golf-room/1200/700",
        "https://picsum.photos/seed/belek-golf-course/1200/700"
      ],
      rules: [
        "Check-in starts at 15:00.",
        "Check-out is until 12:00.",
        "Non-refundable after booking.",
        "Pets are not allowed."
      ],
      roomTypes: [
        { name: "Golf View Room", multiplier: 1, guestCount: 2 },
        { name: "Spa Suite", multiplier: 1.4, guestCount: 2 },
        { name: "Presidential Suite", multiplier: 2.1, guestCount: 4 }
      ]
    },
    {
      id: "hotel-istanbul-5",
      name: "Bosphorus Grand Hotel",
      city: "Istanbul",
      address: "1 Ortakoy Seaside, Istanbul, Turkey",
      description: "Experience the ultimate Istanbul luxury directly on the shores of the Bosphorus strait.",
      info: "Unrivaled dining and views right next to the famous Ortakoy Mosque.",
      starCount: 5,
      rating: 9.4,
      ratingCount: 3105,
      pricePerNight: 410,
      mainImage: "https://picsum.photos/seed/bosphorus-grand-main/1200/700",
      images: [
        "https://picsum.photos/seed/bosphorus-grand-main/1200/700",
        "https://picsum.photos/seed/bosphorus-grand-room/1200/700",
        "https://picsum.photos/seed/bosphorus-grand-view/1200/700"
      ],
      rules: [
        "Check-in starts at 15:00.",
        "Check-out is until 12:00.",
        "Free cancellation up to 72 hours before arrival.",
        "Pets are allowed on request."
      ],
      roomTypes: [
        { name: "City View Room", multiplier: 1, guestCount: 2 },
        { name: "Bosphorus View Room", multiplier: 1.4, guestCount: 2 },
        { name: "Corner Suite", multiplier: 1.8, guestCount: 3 }
      ]
    },
    {
      id: "hotel-istanbul-6",
      name: "Karakoy Trendy Lodge",
      city: "Istanbul",
      address: "24 Karakoy Port Area, Istanbul, Turkey",
      description: "Modern, artsy lodge situated in the heart of Istanbul's most energetic cafe district.",
      info: "A youthful atmosphere perfect for digital nomads and weekend city explorers.",
      starCount: 4,
      rating: 8.6,
      ratingCount: 890,
      pricePerNight: 135,
      mainImage: "https://picsum.photos/seed/karakoy-trendy-main/1200/700",
      images: [
        "https://picsum.photos/seed/karakoy-trendy-main/1200/700",
        "https://picsum.photos/seed/karakoy-trendy-room/1200/700",
        "https://picsum.photos/seed/karakoy-trendy-lounge/1200/700"
      ],
      rules: [
        "Check-in starts at 14:00.",
        "Check-out is until 11:00.",
        "Free cancellation up to 24 hours before arrival.",
        "Pets are not allowed."
      ],
      roomTypes: [
        { name: "Bunk Bed Room", multiplier: 1, guestCount: 1 },
        { name: "Standard Double", multiplier: 1.2, guestCount: 2 },
        { name: "Loft Suite", multiplier: 1.6, guestCount: 4 }
      ]
    },
    {
      id: "hotel-izmir-5",
      name: "Alacati Windmill Boutique",
      city: "Izmir",
      address: "14 Degirmen Sokak, Alacati, Izmir, Turkey",
      description: "Authentic stone house boutique hotel featuring a peaceful garden and pool.",
      info: "Located perfectly for windsurfers and lovers of Alacati's famous narrow stone streets.",
      starCount: 4,
      rating: 9.3,
      ratingCount: 742,
      pricePerNight: 190,
      mainImage: "https://picsum.photos/seed/alacati-windmill-main/1200/700",
      images: [
        "https://picsum.photos/seed/alacati-windmill-main/1200/700",
        "https://picsum.photos/seed/alacati-windmill-room/1200/700",
        "https://picsum.photos/seed/alacati-windmill-garden/1200/700"
      ],
      rules: [
        "Check-in starts at 14:00.",
        "Check-out is until 12:00.",
        "Free cancellation up to 72 hours before arrival.",
        "Pets are allowed."
      ],
      roomTypes: [
        { name: "Classic Stone Room", multiplier: 1, guestCount: 2 },
        { name: "Garden View Room", multiplier: 1.25, guestCount: 2 },
        { name: "Honeymoon Suite", multiplier: 1.6, guestCount: 2 }
      ]
    },
    {
      id: "hotel-izmir-6",
      name: "Swissotel Grand Efes Izmir",
      city: "Izmir",
      address: "Gaziosmanpasa Bulvari No 1, Alsancak, Izmir, Turkey",
      description: "Luxury hotel set in beautiful landscaped gardens overlooking the Aegean Sea.",
      info: "Exceptional dining and spa facilities right in the commercial heart of Izmir.",
      starCount: 5,
      rating: 9.0,
      ratingCount: 2435,
      pricePerNight: 280,
      mainImage: "https://picsum.photos/seed/swissotel-efes-main/1200/700",
      images: [
        "https://picsum.photos/seed/swissotel-efes-main/1200/700",
        "https://picsum.photos/seed/swissotel-efes-room/1200/700",
        "https://picsum.photos/seed/swissotel-efes-spa/1200/700"
      ],
      rules: [
        "Check-in starts at 15:00.",
        "Check-out is until 12:00.",
        "Free cancellation up to 24 hours before arrival.",
        "Pets are not allowed."
      ],
      roomTypes: [
        { name: "Advantage Room", multiplier: 1, guestCount: 2 },
        { name: "Sea View Room", multiplier: 1.3, guestCount: 2 },
        { name: "Executive Suite", multiplier: 1.8, guestCount: 4 }
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

  const hotels = fallbackHotels.map(h => ({
    ...h,
    pricePerNight: Math.round((h.pricePerNight || 140) * TRY_RATE)
  }));
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

