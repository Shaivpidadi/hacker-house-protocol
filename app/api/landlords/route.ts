// app/api/landlords/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { hypergraph } from '@graphprotocol/hypergraph';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    const query: any = {
      landlord: {
        select: {
          id: true,
          name: true,
          walletAddress: true,
          verified: true,
          avatar: {
            select: {
              url: true
            }
          },
          properties: {
            select: {
              name: true,
              location: true,
              price: true,
              status: true,
              bookings: {
                select: {
                  checkIn: true,
                  checkOut: true,
                  status: true,
                  totalPrice: true
                }
              }
            }
          },
          reviews: {
            select: {
              rating: true,
              comment: true,
              property: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }
    };

    if (walletAddress) {
      query.landlord.where = { walletAddress };
    }

    const result = await hypergraph.query(query);
    
    return NextResponse.json({
      success: true,
      data: result.landlord || []
    });

  } catch (error) {
    console.error('Error fetching landlords:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch landlords' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      walletAddress, 
      avatarUrl 
    } = body;

    // create avatar image
    let avatarId = null;
    if (avatarUrl) {
      const imageResult = await hypergraph.mutate({
        createImage: {
          __args: {
            input: {
              url: avatarUrl
            }
          },
          id: true,
          url: true
        }
      });
      avatarId = imageResult.createImage.id;
    }

    // create landlord
    const landlordResult = await hypergraph.mutate({
      createLandlord: {
        __args: {
          input: {
            name,
            walletAddress,
            verified: false, // default to false, can be updated later
            avatar: avatarId
          }
        },
        id: true,
        name: true,
        walletAddress: true
      }
    });

    return NextResponse.json({
      success: true,
      data: landlordResult.createLandlord
    });

  } catch (error) {
    console.error('Error creating landlord:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create landlord' },
      { status: 500 }
    );
  }
}