import fs from 'fs';

// hacker profiles with realistic names and wallet addresses
const hackers = [
  { name: "Alex Chen", wallet: "0x1111111111111111111111111111111111111111", github: "alexchen", twitter: "alexchen" },
  { name: "Sarah Kim", wallet: "0x2222222222222222222222222222222222222222", github: "sarahkim", twitter: "sarahkim" },
  { name: "Marcus Johnson", wallet: "0x3333333333333333333333333333333333333333", github: "marcusjohnson", twitter: "marcusjohnson" },
  { name: "Elena Rodriguez", wallet: "0x4444444444444444444444444444444444444444", github: "elenarodriguez", twitter: "elenarodriguez" },
  { name: "David Wang", wallet: "0x7777777777777777777777777777777777777777", github: "davidwang", twitter: "davidwang" },
  { name: "Lisa Chen", wallet: "0x8888888888888888888888888888888888888888", github: "lisachen", twitter: "lisachen" },
  { name: "Tom Anderson", wallet: "0x9999999999999999999999999999999999999999", github: "tomanderson", twitter: "tomanderson" },
  { name: "Rachel Green", wallet: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", github: "rachelgreen", twitter: "rachelgreen" },
  { name: "Mike Johnson", wallet: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", github: "mikejohnson", twitter: "mikejohnson" },
  { name: "Sam Wilson", wallet: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", github: "samwilson", twitter: "samwilson" },
  { name: "Jennifer Lee", wallet: "0xffffffffffffffffffffffffffffffffffffffff", github: "jenniferlee", twitter: "jenniferlee" },
  { name: "Carlos Mendez", wallet: "0x1010101010101010101010101010101010101010", github: "carlosmendez", twitter: "carlosmendez" },
  { name: "Amanda Foster", wallet: "0x2020202020202020202020202020202020202020", github: "amandafoster", twitter: "amandafoster" },
  { name: "Chris Brown", wallet: "0x3030303030303030303030303030303030303030", github: "chrisbrown", twitter: "chrisbrown" },
  { name: "Nicole White", wallet: "0x4040404040404040404040404040404040404040", github: "nicolewhite", twitter: "nicolewhite" },
  { name: "Ryan Davis", wallet: "0x5050505050505050505050505050505050505050", github: "ryandavis", twitter: "ryandavis" },
  { name: "Sophie Martin", wallet: "0x6060606060606060606060606060606060606060", github: "sophiemartin", twitter: "sophiemartin" },
  { name: "Kevin Zhang", wallet: "0x7070707070707070707070707070707070707070", github: "kevinzhang", twitter: "kevinzhang" },
  { name: "Emma Thompson", wallet: "0x8080808080808080808080808080808080808080", github: "emmathompson", twitter: "emmathompson" },
  { name: "Daniel Park", wallet: "0x9090909090909090909090909090909090909090", github: "danielpark", twitter: "danielpark" }
];

// cities with properties and landlords
const cities = [
  {
    name: "Barcelona, Spain",
    properties: [
      { name: "Barcelona Tech Loft", type: "Loft", price: 200, size: 1500, bedrooms: 3, amenities: "High-speed WiFi, Workspace, Kitchen, Balcony" },
      { name: "Gothic Quarter Studio", type: "Studio", price: 180, size: 800, bedrooms: 1, amenities: "Historic building, WiFi, Kitchen, Terrace" },
      { name: "Eixample Developer Hub", type: "Apartment", price: 250, size: 1200, bedrooms: 2, amenities: "Modern design, WiFi, Workspace, Balcony" }
    ],
    landlords: [
      { name: "Carlos Rodriguez", wallet: "0x1234567890abcdef1234567890abcdef12345678", verified: true },
      { name: "Isabella Martinez", wallet: "0x2345678901bcdef12345678901bcdef123456789", verified: true },
      { name: "Miguel Fernandez", wallet: "0x3456789012cdef123456789012cdef1234567890", verified: false }
    ]
  },
  {
    name: "Buenos Aires, Argentina",
    properties: [
      { name: "Palermo Crypto House", type: "House", price: 300, size: 1800, bedrooms: 3, amenities: "Garden, WiFi, Kitchen, Workspace" },
      { name: "San Telmo Developer Apartment", type: "Apartment", price: 350, size: 1200, bedrooms: 2, amenities: "Dedicated workspace, WiFi, Kitchen, Balcony" },
      { name: "Recoleta Tech Loft", type: "Loft", price: 280, size: 1400, bedrooms: 2, amenities: "Modern loft, WiFi, Kitchen, City view" }
    ],
    landlords: [
      { name: "Maria Gonzalez", wallet: "0x5555555555555555555555555555555555555555", verified: true },
      { name: "Diego Martinez", wallet: "0xcccccccccccccccccccccccccccccccccccccccc", verified: false },
      { name: "Valentina Lopez", wallet: "0xdddddddddddddddddddddddddddddddddddddddddd", verified: true }
    ]
  },
  {
    name: "Lisbon, Portugal",
    properties: [
      { name: "Lisbon Digital Nomad Hub", type: "Co-living", price: 250, size: 2000, bedrooms: 4, amenities: "Co-working space, WiFi, Kitchen, Rooftop terrace" },
      { name: "Alfama Tech Studio", type: "Studio", price: 200, size: 900, bedrooms: 1, amenities: "Historic district, WiFi, Kitchen, Ocean view" },
      { name: "Bairro Alto Developer Loft", type: "Loft", price: 220, size: 1100, bedrooms: 2, amenities: "Nightlife district, WiFi, Kitchen, Balcony" }
    ],
    landlords: [
      { name: "João Silva", wallet: "0x6666666666666666666666666666666666666666", verified: true },
      { name: "Ana Costa", wallet: "0x7777777777777777777777777777777777777777", verified: true },
      { name: "Pedro Santos", wallet: "0x8888888888888888888888888888888888888888", verified: false }
    ]
  },
  {
    name: "Madrid, Spain",
    properties: [
      { name: "Madrid Tech Studio", type: "Studio", price: 225, size: 1000, bedrooms: 2, amenities: "Workspace, WiFi, Kitchen, Terrace" },
      { name: "Salamanca Innovation Hub", type: "Apartment", price: 275, size: 1300, bedrooms: 2, amenities: "Luxury district, WiFi, Kitchen, Balcony" },
      { name: "Chueca Crypto Loft", type: "Loft", price: 240, size: 1200, bedrooms: 2, amenities: "LGBTQ+ district, WiFi, Kitchen, City view" }
    ],
    landlords: [
      { name: "Ana Garcia", wallet: "0xdddddddddddddddddddddddddddddddddddddddddd", verified: true },
      { name: "Luis Rodriguez", wallet: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", verified: true },
      { name: "Carmen Lopez", wallet: "0xffffffffffffffffffffffffffffffffffffffff", verified: false }
    ]
  },
  {
    name: "Berlin, Germany",
    properties: [
      { name: "Kreuzberg Hacker House", type: "House", price: 320, size: 1600, bedrooms: 3, amenities: "Alternative district, WiFi, Kitchen, Garden" },
      { name: "Mitte Tech Loft", type: "Loft", price: 280, size: 1400, bedrooms: 2, amenities: "City center, WiFi, Kitchen, Balcony" },
      { name: "Neukölln Developer Studio", type: "Studio", price: 200, size: 900, bedrooms: 1, amenities: "Upcoming district, WiFi, Kitchen, Terrace" }
    ],
    landlords: [
      { name: "Hans Mueller", wallet: "0x1111111111111111111111111111111111111112", verified: true },
      { name: "Anna Schmidt", wallet: "0x2222222222222222222222222222222222222223", verified: true },
      { name: "Klaus Weber", wallet: "0x3333333333333333333333333333333333333334", verified: false }
    ]
  },
  {
    name: "Amsterdam, Netherlands",
    properties: [
      { name: "Jordaan Tech House", type: "House", price: 350, size: 1700, bedrooms: 3, amenities: "Historic district, WiFi, Kitchen, Canal view" },
      { name: "De Pijp Developer Loft", type: "Loft", price: 260, size: 1300, bedrooms: 2, amenities: "Trendy district, WiFi, Kitchen, Balcony" },
      { name: "Oost Innovation Studio", type: "Studio", price: 220, size: 950, bedrooms: 1, amenities: "Upcoming area, WiFi, Kitchen, Terrace" }
    ],
    landlords: [
      { name: "Jan van der Berg", wallet: "0x4444444444444444444444444444444444444445", verified: true },
      { name: "Lisa de Vries", wallet: "0x5555555555555555555555555555555555555556", verified: true },
      { name: "Pieter Bakker", wallet: "0x6666666666666666666666666666666666666667", verified: false }
    ]
  },
  {
    name: "Porto, Portugal",
    properties: [
      { name: "Ribeira Tech Loft", type: "Loft", price: 200, size: 1100, bedrooms: 2, amenities: "Riverside district, WiFi, Kitchen, River view" },
      { name: "Miragaia Developer House", type: "House", price: 280, size: 1500, bedrooms: 3, amenities: "Historic district, WiFi, Kitchen, Garden" },
      { name: "Cedofeita Innovation Studio", type: "Studio", price: 180, size: 850, bedrooms: 1, amenities: "Student district, WiFi, Kitchen, Balcony" }
    ],
    landlords: [
      { name: "Tiago Silva", wallet: "0x7777777777777777777777777777777777777778", verified: true },
      { name: "Maria Santos", wallet: "0x8888888888888888888888888888888888888889", verified: true },
      { name: "Antonio Costa", wallet: "0x9999999999999999999999999999999999999990", verified: false }
    ]
  },
  {
    name: "Valencia, Spain",
    properties: [
      { name: "Ciutat Vella Tech House", type: "House", price: 240, size: 1200, bedrooms: 2, amenities: "Old town, WiFi, Kitchen, City view" },
      { name: "Ruzafa Developer Loft", type: "Loft", price: 200, size: 1000, bedrooms: 2, amenities: "Hipster district, WiFi, Kitchen, Balcony" },
      { name: "Eixample Innovation Studio", type: "Studio", price: 180, size: 900, bedrooms: 1, amenities: "Modern district, WiFi, Kitchen, Terrace" }
    ],
    landlords: [
      { name: "Javier Garcia", wallet: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab", verified: true },
      { name: "Carmen Rodriguez", wallet: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc", verified: true },
      { name: "Miguel Lopez", wallet: "0xcccccccccccccccccccccccccccccccccccccccd", verified: false }
    ]
  },
  {
    name: "Córdoba, Argentina",
    properties: [
      { name: "Nueva Córdoba Tech House", type: "House", price: 220, size: 1100, bedrooms: 2, amenities: "Student district, WiFi, Kitchen, Garden" },
      { name: "Centro Developer Loft", type: "Loft", price: 200, size: 1000, bedrooms: 2, amenities: "City center, WiFi, Kitchen, Balcony" },
      { name: "Alberdi Innovation Studio", type: "Studio", price: 160, size: 800, bedrooms: 1, amenities: "Historic district, WiFi, Kitchen, Terrace" }
    ],
    landlords: [
      { name: "Roberto Martinez", wallet: "0xddddddddddddddddddddddddddddddddddddddddde", verified: true },
      { name: "Silvia Gonzalez", wallet: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeef", verified: true },
      { name: "Carlos Fernandez", wallet: "0xffffffffffffffffffffffffffffffffffffffff0", verified: false }
    ]
  },
  {
    name: "Mendoza, Argentina",
    properties: [
      { name: "Godoy Cruz Tech House", type: "House", price: 200, size: 1000, bedrooms: 2, amenities: "Wine district, WiFi, Kitchen, Mountain view" },
      { name: "Ciudad Developer Loft", type: "Loft", price: 180, size: 900, bedrooms: 2, amenities: "City center, WiFi, Kitchen, Balcony" },
      { name: "Chacras Innovation Studio", type: "Studio", price: 150, size: 750, bedrooms: 1, amenities: "Suburban area, WiFi, Kitchen, Garden view" }
    ],
    landlords: [
      { name: "Alejandro Perez", wallet: "0x1010101010101010101010101010101010101011", verified: true },
      { name: "Valeria Rodriguez", wallet: "0x2020202020202020202020202020202020202021", verified: true },
      { name: "Fernando Silva", wallet: "0x3030303030303030303030303030303030303031", verified: false }
    ]
  }
];

// hacker teams that travel together
const hackerTeams = [
  ["Alex Chen", "Sarah Kim", "Marcus Johnson", "Elena Rodriguez"],
  ["David Wang", "Lisa Chen", "Tom Anderson", "Rachel Green"],
  ["Mike Johnson", "Sam Wilson", "Jennifer Lee", "Carlos Mendez"],
  ["Amanda Foster", "Chris Brown", "Nicole White", "Ryan Davis"],
  ["Sophie Martin", "Kevin Zhang", "Emma Thompson", "Daniel Park"],
  ["Alex Chen", "David Wang", "Mike Johnson"], // cross-team connections
  ["Sarah Kim", "Lisa Chen", "Amanda Foster"],
  ["Marcus Johnson", "Tom Anderson", "Chris Brown"],
  ["Elena Rodriguez", "Rachel Green", "Sophie Martin"],
  ["Sam Wilson", "Jennifer Lee", "Kevin Zhang"]
];

// events and conferences
const events = [
  "ETH Barcelona hackathon",
  "Buenos Aires crypto meetup", 
  "Lisbon Web3 Summit",
  "Madrid blockchain conference",
  "Berlin DeFi hackathon",
  "Amsterdam crypto festival",
  "Porto developer meetup",
  "Valencia tech conference",
  "Córdoba blockchain summit",
  "Mendoza crypto retreat",
  "Barcelona developer workshop",
  "Buenos Aires DeFi meetup",
  "Lisbon NFT conference",
  "Madrid Web3 hackathon",
  "Berlin crypto meetup",
  "Amsterdam blockchain summit",
  "Porto DeFi workshop",
  "Valencia developer conference",
  "Córdoba tech meetup",
  "Mendoza blockchain workshop"
];

function generateBooking(index) {
  const city = cities[index % cities.length];
  const property = city.properties[index % city.properties.length];
  const landlord = city.landlords[index % city.landlords.length];
  
  // select a hacker team
  const team = hackerTeams[index % hackerTeams.length];
  const guestCount = team.length;
  
  // generate dates
  const startMonth = Math.floor(index / 10) + 1;
  const startDay = (index % 28) + 1;
  const duration = Math.floor(Math.random() * 7) + 3; // 3-10 days
  
  const checkIn = `2024-${startMonth.toString().padStart(2, '0')}-${startDay.toString().padStart(2, '0')}`;
  const checkOut = `2024-${startMonth.toString().padStart(2, '0')}-${Math.min(startDay + duration, 28).toString().padStart(2, '0')}`;
  
  const totalPrice = property.price * duration;
  const deposit = Math.floor(totalPrice * 0.2);
  
  const event = events[index % events.length];
  
  // create hacker data
  const hackerNames = team.join(", ");
  const hackerWalletAddresses = team.map(h => hackers.find(ha => ha.name === h)?.wallet || "0x0000000000000000000000000000000000000000").join(",");
  const hackerGithubUrls = team.map(h => `https://github.com/${hackers.find(ha => ha.name === h)?.github || "unknown"}`).join(",");
  const hackerTwitterUrls = team.map(h => `https://twitter.com/${hackers.find(ha => ha.name === h)?.twitter || "unknown"}`).join(",");
  const hackerAvatarUrls = team.map(h => `https://example.com/${hackers.find(ha => ha.name === h)?.github || "unknown"}-avatar.jpg`).join(",");
  
  return {
    checkIn,
    checkOut,
    status: "confirmed",
    totalPrice,
    deposit,
    guestCount,
    paymentStatus: "paid",
    paymentDate: checkIn,
    paymentAmount: totalPrice,
    paymentCurrency: "USD",
    notes: `${event} - team collaboration`,
    propertyName: property.name,
    propertyDescription: `${property.type} in ${city.name}, perfect for developers and crypto enthusiasts`,
    propertyLocation: city.name,
    propertyPrice: property.price,
    propertySize: property.size,
    propertyBedrooms: property.bedrooms,
    propertyBathrooms: Math.ceil(property.bedrooms / 2),
    propertyParking: Math.ceil(property.bedrooms / 2),
    propertyAmenities: property.amenities,
    propertyWifi: true,
    propertyFeatures: "Modern design, City view, Air conditioning",
    propertyStatus: "available",
    propertyType: property.type,
    propertyDeposit: property.price,
    propertyImageUrl: `https://example.com/${property.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    landlordName: landlord.name,
    landlordWalletAddress: landlord.wallet,
    landlordVerified: landlord.verified,
    landlordAvatarUrl: `https://example.com/${landlord.name.toLowerCase().replace(/\s+/g, '-')}-avatar.jpg`,
    hackerNames,
    hackerWalletAddresses,
    hackerGithubUrls,
    hackerTwitterUrls,
    hackerAvatarUrls
  };
}

// generate 100 bookings
const bookings = [];
for (let i = 0; i < 100; i++) {
  bookings.push(generateBooking(i));
}

// write to file
fs.writeFileSync('massive-hacker-network.json', JSON.stringify(bookings, null, 2));

console.log(`Generated ${bookings.length} bookings with ${hackers.length} hackers traveling across ${cities.length} cities!`);
console.log('File saved as: massive-hacker-network.json');
