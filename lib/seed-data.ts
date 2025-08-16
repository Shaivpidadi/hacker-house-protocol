import { useCreateEntity } from '@graphprotocol/hypergraph-react';
import { Hacker, Property, Booking, Landlord, Event, Review, Image } from '@/app/schema';

// Mock data generators
const generateMockData = () => {
  // Sample data arrays
  const cities = [
    'San Francisco', 'New York', 'Austin', 'Seattle', 'Boston', 'Los Angeles', 
    'Chicago', 'Denver', 'Portland', 'Miami', 'Atlanta', 'Dallas', 'Phoenix', 
    'Las Vegas', 'San Diego', 'Nashville', 'Charlotte', 'Orlando', 'Tampa', 'Houston'
  ];

  const propertyTypes = ['hackerhouse', 'apartment', 'house', 'loft', 'studio'];
  const amenities = ['wifi', 'kitchen', 'parking', 'gym', 'pool', 'workspace', 'coffee', 'laundry'];
  const paymentCurrencies = ['ETH', 'USDC', 'USDT', 'DAI'];
  const bookingStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  const reviewComments = [
    'Great location for hackathons!', 'Perfect workspace setup', 'Amazing community',
    'Clean and modern', 'Excellent wifi speed', 'Friendly landlord', 'Great amenities',
    'Convenient location', 'Affordable for hackers', 'Highly recommended'
  ];

  // Generate 50 hackers
  const hackers = Array.from({ length: 50 }, (_, i) => ({
    name: `Hacker${i + 1}`,
    walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
    githubUrl: `https://github.com/hacker${i + 1}`,
    twitterUrl: `https://twitter.com/hacker${i + 1}`,
    avatarUrl: `https://picsum.photos/200/200?random=${i + 100}`
  }));

  // Generate 20 landlords
  const landlords = Array.from({ length: 20 }, (_, i) => ({
    name: `Landlord${i + 1}`,
    walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
    verified: Math.random() > 0.3,
    avatarUrl: `https://picsum.photos/200/200?random=${i + 200}`
  }));

  // Generate 100 properties
  const properties = Array.from({ length: 100 }, (_, i) => ({
    name: `${cities[Math.floor(Math.random() * cities.length)]} Hacker House ${i + 1}`,
    description: `Modern hacker-friendly accommodation in ${cities[Math.floor(Math.random() * cities.length)]}. Perfect for hackathons, coding retreats, and tech meetups.`,
    location: cities[Math.floor(Math.random() * cities.length)],
    price: Math.floor(Math.random() * 200) + 50, // $50-$250 per night
    size: Math.floor(Math.random() * 2000) + 500, // 500-2500 sq ft
    bedrooms: Math.floor(Math.random() * 4) + 1, // 1-4 bedrooms
    bathrooms: Math.floor(Math.random() * 3) + 1, // 1-3 bathrooms
    parking: Math.floor(Math.random() * 3), // 0-2 parking spots
    amenities: amenities.slice(0, Math.floor(Math.random() * 5) + 3).join(', '),
    wifi: Math.random() > 0.1, // 90% have wifi
    features: 'High-speed internet, 24/7 access, Security system',
    status: Math.random() > 0.2 ? 'available' : 'booked',
    type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
    deposit: Math.floor(Math.random() * 500) + 200, // $200-$700 deposit
    imageUrl: `https://picsum.photos/400/300?random=${i + 300}`,
    landlordIndex: Math.floor(Math.random() * landlords.length)
  }));

  // Generate 200 bookings
  const bookings = Array.from({ length: 200 }, (_, i) => {
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + Math.floor(Math.random() * 365));
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + Math.floor(Math.random() * 14) + 1);
    
    return {
      checkIn: checkIn.toISOString().split('T')[0],
      checkOut: checkOut.toISOString().split('T')[0],
      status: bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)],
      totalPrice: Math.floor(Math.random() * 1000) + 200,
      deposit: Math.floor(Math.random() * 500) + 200,
      guestCount: Math.floor(Math.random() * 4) + 1,
      paymentStatus: Math.random() > 0.2 ? 'paid' : 'pending',
      paymentDate: new Date().toISOString(),
      paymentAmount: Math.floor(Math.random() * 1000) + 200,
      paymentCurrency: paymentCurrencies[Math.floor(Math.random() * paymentCurrencies.length)],
      notes: `Booking ${i + 1} - ${Math.random() > 0.5 ? 'Hackathon participant' : 'Tech meetup'}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cancelledAt: '', // Empty string instead of null
      cancelledBy: '', // Empty string instead of null
      cancelledReason: '', // Empty string instead of null
      cancelledNotes: '', // Empty string instead of null
      propertyIndex: Math.floor(Math.random() * properties.length),
      hackerIndices: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
        Math.floor(Math.random() * hackers.length)
      ),
      landlordIndex: Math.floor(Math.random() * landlords.length)
    };
  });

  // Generate 150 reviews
  const reviews = Array.from({ length: 150 }, (_, i) => ({
    rating: Math.floor(Math.random() * 5) + 1, // 1-5 stars
    comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
    createdAt: new Date().toISOString(),
    propertyIndex: Math.floor(Math.random() * properties.length),
    hackerIndex: Math.floor(Math.random() * hackers.length),
    landlordIndex: Math.floor(Math.random() * landlords.length)
  }));

  // Generate 30 events
  const events = Array.from({ length: 30 }, (_, i) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 365));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 7) + 1);
    
    return {
      name: `Hackathon ${i + 1}`,
      description: `Join us for an amazing hackathon experience!`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      organizer: `Organizer${i + 1}`,
      imageUrl: `https://picsum.photos/400/300?random=${i + 400}`
    };
  });

  return { hackers, landlords, properties, bookings, reviews, events };
};

// Seeding function
export function useSeedDatabase() {
  const createImage = useCreateEntity(Image);
  const createHacker = useCreateEntity(Hacker);
  const createLandlord = useCreateEntity(Landlord);
  const createProperty = useCreateEntity(Property);
  const createBooking = useCreateEntity(Booking);
  const createReview = useCreateEntity(Review);
  const createEvent = useCreateEntity(Event);

  return async () => {
    try {
      console.log('🌱 Starting database seeding...');
      console.log('🔍 Hypergraph entities available:', {
        createImage: typeof createImage,
        createHacker: typeof createHacker,
        createLandlord: typeof createLandlord,
        createProperty: typeof createProperty,
        createBooking: typeof createBooking,
        createReview: typeof createReview,
        createEvent: typeof createEvent
      });
      
      const { hackers, landlords, properties, bookings, reviews, events } = generateMockData();

      // Test creation with detailed logging
      console.log('📝 Creating test image...');
      const testImage = createImage({ url: 'https://picsum.photos/200/200?random=999' });
      console.log('🖼️ Test image created:', testImage);
      console.log('🆔 Image ID:', testImage.id);
      console.log('🔗 Image URL:', testImage.url);
      console.log('📊 Full image object:', JSON.stringify(testImage, null, 2));
      
      console.log('📝 Creating test hacker...');
      const testHacker = createHacker({
        name: "TestHacker",
        walletAddress: "0x1234567890abcdef",
        githubUrl: "https://github.com/testhacker",
        twitterUrl: "https://twitter.com/testhacker",
        avatar: [testImage.id]
      });
      console.log('👨‍💻 Test hacker created:', testHacker);
      console.log(' Hacker ID:', testHacker.id);
      console.log(' Full hacker object:', JSON.stringify(testHacker, null, 2));
      
      // Create images first
      const imageIds: string[] = [];
      for (const hacker of hackers) {
        const image = createImage({ url: hacker.avatarUrl });
        imageIds.push(image.id);
      }
      for (const landlord of landlords) {
        const image = createImage({ url: landlord.avatarUrl });
        imageIds.push(image.id);
      }
      for (const property of properties) {
        const image = createImage({ url: property.imageUrl });
        imageIds.push(image.id);
      }
      for (const event of events) {
        const image = createImage({ url: event.imageUrl });
        imageIds.push(image.id);
      }

      // Create hackers
      const hackerIds: string[] = [];
      for (let i = 0; i < hackers.length; i++) {
        const hacker = createHacker({
          name: hackers[i].name,
          walletAddress: hackers[i].walletAddress,
          githubUrl: hackers[i].githubUrl,
          twitterUrl: hackers[i].twitterUrl,
          avatar: [imageIds[i]]
        });
        hackerIds.push(hacker.id);
      }

      // Create landlords
      const landlordIds: string[] = [];
      for (let i = 0; i < landlords.length; i++) {
        const landlord = createLandlord({
          name: landlords[i].name,
          walletAddress: landlords[i].walletAddress,
          verified: landlords[i].verified,
          avatar: [imageIds[hackers.length + i]]
        });
        landlordIds.push(landlord.id);
      }

      // Create properties
      const propertyIds: string[] = [];
      for (let i = 0; i < properties.length; i++) {
        const property = createProperty({
          name: properties[i].name,
          description: properties[i].description,
          location: properties[i].location,
          price: properties[i].price,
          size: properties[i].size,
          bedrooms: properties[i].bedrooms,
          bathrooms: properties[i].bathrooms,
          parking: properties[i].parking,
          amenities: properties[i].amenities,
          wifi: properties[i].wifi,
          features: properties[i].features,
          status: properties[i].status,
          type: properties[i].type,
          deposit: properties[i].deposit,
          image: [imageIds[hackers.length + landlords.length + i]]
        });
        propertyIds.push(property.id);
      }

      // Create events
      const eventIds: string[] = [];
      for (let i = 0; i < events.length; i++) {
        const event = createEvent({
          name: events[i].name,
          description: events[i].description,
          startDate: events[i].startDate,
          endDate: events[i].endDate,
          organizer: events[i].organizer,
          image: [imageIds[hackers.length + landlords.length + properties.length + i]]
        });
        eventIds.push(event.id);
      }

      // Create bookings
      for (const booking of bookings) {
        createBooking({
          checkIn: booking.checkIn,
          checkOut: booking.checkOut,
          status: booking.status,
          totalPrice: booking.totalPrice,
          deposit: booking.deposit,
          guestCount: booking.guestCount,
          paymentStatus: booking.paymentStatus,
          paymentDate: booking.paymentDate,
          paymentAmount: booking.paymentAmount,
          paymentCurrency: booking.paymentCurrency,
          notes: booking.notes,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
          cancelledAt: booking.cancelledAt,
          cancelledBy: booking.cancelledBy,
          cancelledReason: booking.cancelledReason,
          cancelledNotes: booking.cancelledNotes,
          property: [propertyIds[booking.propertyIndex]],
          hackers: booking.hackerIndices.map(index => hackerIds[index]),
          landlord: [landlordIds[booking.landlordIndex]]
        });
      }

      // Create reviews
      for (const review of reviews) {
        createReview({
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt
        });
      }

      console.log('✅ Database seeding completed!');
      console.log(` Created: ${hackers.length} hackers, ${landlords.length} landlords, ${properties.length} properties, ${bookings.length} bookings, ${reviews.length} reviews, ${events.length} events`);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      console.error('🔍 Error details:', error);
      console.error('📋 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      return { success: false, error };
    }
  };
}
