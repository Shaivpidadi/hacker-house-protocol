// app/api/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { hypergraph } from '@graphprotocol/hypergraph';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'popular-properties', 'payment-analytics', 'occupancy-rates', etc.

    switch (type) {
      case 'popular-properties':
        return await getPopularProperties();
      case 'payment-analytics':
        return await getPaymentAnalytics();
      case 'occupancy-rates':
        return await getOccupancyRates();
      case 'seasonal-trends':
        return await getSeasonalTrends();
      case 'hacker-travel-patterns':
        return await getHackerTravelPatterns(searchParams.get('hackerWallet'));
      case 'landlord-performance':
        return await getLandlordPerformance(searchParams.get('landlordWallet'));
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid analytics type' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

async function getPopularProperties() {
  const result = await hypergraph.query({
    property: {
      select: {
        name: true,
        location: true,
        price: true,
        bookings: {
          select: {
            id: true,
            status: true,
            totalPrice: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      }
    }
  });

  // process data to calculate popularity metrics
  const properties = result.property || [];
  const popularProperties = properties.map(property => ({
    ...property,
    bookingCount: property.bookings?.length || 0,
    averageRating: property.reviews?.length > 0 
      ? property.reviews.reduce((acc, review) => acc + review.rating, 0) / property.reviews.length 
      : 0,
    totalRevenue: property.bookings?.reduce((acc, booking) => acc + (booking.totalPrice || 0), 0) || 0
  })).sort((a, b) => b.bookingCount - a.bookingCount);

  return NextResponse.json(
    { success: true, data: result },
    { 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    }
  );

async function getPaymentAnalytics() {
  const result = await hypergraph.query({
    bookingPayment: {
      select: {
        amount: true,
        securityDeposit: true,
        paymentStatus: true,
        paymentCurrency: true,
        paymentDate: true
      }
    }
  });

  const payments = result.bookingPayment || [];
  
  // calculate payment analytics
  const analytics = {
    totalPayments: payments.length,
    totalAmount: payments.reduce((acc, payment) => acc + (payment.amount || 0), 0),
    averageAmount: payments.length > 0 ? payments.reduce((acc, payment) => acc + (payment.amount || 0), 0) / payments.length : 0,
    paymentStatuses: payments.reduce((acc, payment) => {
      acc[payment.paymentStatus] = (acc[payment.paymentStatus] || 0) + 1;
      return acc;
    }, {}),
    currencies: payments.reduce((acc, payment) => {
      acc[payment.paymentCurrency] = (acc[payment.paymentCurrency] || 0) + 1;
      return acc;
    }, {})
  };

  return NextResponse.json(
    { success: true, data: result },
    { 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    }
  );

async function getOccupancyRates() {
  const result = await hypergraph.query({
    booking: {
      where: { status: 'completed' },
      select: {
        checkIn: true,
        checkOut: true,
        property: {
          select: {
            name: true,
            location: true
          }
        }
      }
    }
  });

  // calculate occupancy rates by property
  const bookings = result.booking || [];
  const occupancyData = bookings.reduce((acc, booking) => {
    const propertyName = booking.property?.name || 'Unknown';
    if (!acc[propertyName]) {
      acc[propertyName] = {
        propertyName,
        location: booking.property?.location,
        totalDays: 0,
        bookedDays: 0
      };
    }
    
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    acc[propertyName].bookedDays += days;
    return acc;
  }, {});

  return NextResponse.json(
    { success: true, data: result },
    { 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    }
  );

async function getSeasonalTrends() {
  const result = await hypergraph.query({
    booking: {
      where: { status: 'completed' },
      select: {
        checkIn: true,
        totalPrice: true,
        guestCount: true,
        property: {
          select: {
            location: true
          }
        }
      }
    }
  });

  const bookings = result.booking || [];
  
  // group by month
  const monthlyData = bookings.reduce((acc, booking) => {
    const date = new Date(booking.checkIn);
    const month = date.toISOString().slice(0, 7); // YYYY-MM format
    
    if (!acc[month]) {
      acc[month] = {
        month,
        totalBookings: 0,
        totalRevenue: 0,
        averageGuests: 0,
        locations: {}
      };
    }
    
    acc[month].totalBookings++;
    acc[month].totalRevenue += booking.totalPrice || 0;
    acc[month].averageGuests += booking.guestCount || 0;
    
    const location = booking.property?.location || 'Unknown';
    acc[month].locations[location] = (acc[month].locations[location] || 0) + 1;
    
    return acc;
  }, {});

  // calculate averages
  Object.keys(monthlyData).forEach(month => {
    monthlyData[month].averageGuests = monthlyData[month].averageGuests / monthlyData[month].totalBookings;
  });

  return NextResponse.json(
    { success: true, data: result },
    { 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    }
  );

async function getHackerTravelPatterns(hackerWallet: string) {
  if (!hackerWallet) {
    return NextResponse.json(
      { success: false, error: 'Hacker wallet address required' },
      { status: 400 }
    );
  }

  const result = await hypergraph.query({
    booking: {
      where: { 
        hackers: { where: { walletAddress: hackerWallet } },
        status: 'completed'
      },
      select: {
        checkIn: true,
        checkOut: true,
        totalPrice: true,
        property: {
          select: {
            location: true
          }
        }
      }
    }
  });

  const bookings = result.booking || [];
  
  // analyze travel patterns
  const travelData = {
    totalTrips: bookings.length,
    totalSpent: bookings.reduce((acc, booking) => acc + (booking.totalPrice || 0), 0),
    averageTripCost: bookings.length > 0 ? bookings.reduce((acc, booking) => acc + (booking.totalPrice || 0), 0) / bookings.length : 0,
    locations: bookings.reduce((acc, booking) => {
      const location = booking.property?.location || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {}),
    monthlySpending: bookings.reduce((acc, booking) => {
      const date = new Date(booking.checkIn);
      const month = date.toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + (booking.totalPrice || 0);
      return acc;
    }, {})
  };

  return NextResponse.json(
    { success: true, data: result },
    { 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    }
  );

async function getLandlordPerformance(landlordWallet: string) {
  if (!landlordWallet) {
    return NextResponse.json(
      { success: false, error: 'Landlord wallet address required' },
      { status: 400 }
    );
  }

  const result = await hypergraph.query({
    landlord: {
      where: { walletAddress: landlordWallet },
      select: {
        name: true,
        verified: true,
        properties: {
          select: {
            name: true,
            location: true,
            price: true,
            bookings: {
              select: {
                checkIn: true,
                checkOut: true,
                status: true,
                totalPrice: true,
                guestCount: true
              }
            },
            reviews: {
              select: {
                rating: true,
                comment: true
              }
            }
          }
        }
      }
    }
  });

  const landlord = result.landlord?.[0];
  if (!landlord) {
    return NextResponse.json(
      { success: false, error: 'Landlord not found' },
      { status: 404 }
    );
  }

  // calculate performance metrics
  const performance = {
    name: landlord.name,
    verified: landlord.verified,
    totalProperties: landlord.properties?.length || 0,
    totalBookings: landlord.properties?.reduce((acc, property) => 
      acc + (property.bookings?.length || 0), 0) || 0,
    totalRevenue: landlord.properties?.reduce((acc, property) => 
      acc + property.bookings?.reduce((sum, booking) => 
        sum + (booking.totalPrice || 0), 0) || 0, 0) || 0,
    averageRating: landlord.properties?.reduce((acc, property) => 
      acc + property.reviews?.reduce((sum, review) => 
        sum + review.rating, 0) || 0, 0) / 
      (landlord.properties?.reduce((acc, property) => 
        acc + (property.reviews?.length || 0), 0) || 1),
    properties: landlord.properties?.map(property => ({
      name: property.name,
      location: property.location,
      price: property.price,
      bookingCount: property.bookings?.length || 0,
      revenue: property.bookings?.reduce((acc, booking) => 
        acc + (booking.totalPrice || 0), 0) || 0,
      averageRating: property.reviews?.reduce((acc, review) => 
        acc + review.rating, 0) / (property.reviews?.length || 1) || 0
    })) || []
  };

  return NextResponse.json(
    { success: true, data: result },
    { 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    }
  );
}