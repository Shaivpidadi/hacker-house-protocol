// app/api/hackers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { hypergraph } from '@graphprotocol/hypergraph';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    const query: any = {
      hacker: {
        select: {
          id: true,
          name: true,
          walletAddress: true,
          githubUrl: true,
          twitterUrl: true,
          avatar: {
            select: {
              url: true
            }
          },
          bookings: {
            select: {
              checkIn: true,
              checkOut: true,
              status: true,
              property: {
                select: {
                  name: true,
                  location: true
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
      query.hacker.where = { walletAddress };
    }

    const result = await hypergraph.query(query);
    
    return NextResponse.json({
      success: true,
      data: result.hacker || []
    });

  } catch (error) {
    console.error('Error fetching hackers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hackers' },
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
      githubUrl, 
      twitterUrl, 
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

    // create hacker
    const hackerResult = await hypergraph.mutate({
      createHacker: {
        __args: {
          input: {
            name,
            walletAddress,
            githubUrl,
            twitterUrl,
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
      data: hackerResult.createHacker
    });

  } catch (error) {
    console.error('Error creating hacker:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create hacker' },
      { status: 500 }
    );
  }
}