// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { hypergraph } from '@graphprotocol/hypergraph';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hackerWallet = searchParams.get('hackerWallet');
    const landlordWallet = searchParams.get('landlordWallet');
    const propertyId = searchParams.get('propertyId');
    const status = searchParams.get('status');

    const query: any = {
      booking: {
        select: {
          id: true,
          checkIn: true,
          checkOut: true,
          status: true,
          totalPrice: true,
          deposit: true,
          guestCount: true,
          paymentStatus: true,
          notes: true,
          createdAt: true,
          property: {
            select: {
              name: true,
              location: true,
              image: {
                select: {
                  url: true
                }
              }
            }
          },
          hackers: {
            select: {
              name: true,
              walletAddress: true,
              avatar: {
                select: {
                  url: true
                }
              }
            }
          },
          landlord: {
            select: {
              name: true,
              walletAddress: true
            }
          }
        }
      }
    };

    // add filters
    if (hackerWallet) {
      query.booking.where = {
        hackers: { where: { walletAddress: hackerWallet } }
      };
    }
    if (landlordWallet) {
      query.booking.where = {
        landlord: { where: { walletAddress: landlordWallet } }
      };
    }
    if (propertyId) {
      query.booking.where = {
        property: { where: { id: propertyId } }
      };
    }
    if (status) {
      query.booking.where = { status };
    }

    const result = await hypergraph.query(query);
    
    return NextResponse.json({
      success: true,
      data: result.booking || []
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      propertyId,
      hackerWallets, // array of hacker wallet addresses
      landlordWallet,
      checkIn,
      checkOut,
      totalPrice,
      deposit,
      guestCount,
      notes
    } = body;

    // Validate required fields
    if (!propertyId || !hackerWallets || !landlordWallet || !checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // create booking with hackers included
    const bookingResult = await hypergraph.mutate({
      createBooking: {
        __args: {
          input: {
            property: propertyId,
            landlord: landlordWallet,
            hackers: hackerWallets, // This should work if hackers are wallet addresses
            checkIn,
            checkOut,
            status: 'pending',
            totalPrice,
            deposit,
            guestCount,
            paymentStatus: 'pending',
            notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        },
        id: true,
        checkIn: true,
        checkOut: true,
        status: true,
        totalPrice: true
      }
    });

    return NextResponse.json({
      success: true,
      data: bookingResult.createBooking
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}