// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { hypergraph } from '@graphprotocol/hypergraph';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get('upcoming') === 'true';
    const organizer = searchParams.get('organizer');

    const query: any = {
      event: {
        select: {
          id: true,
          name: true,
          description: true,
          startDate: true,
          endDate: true,
          organizer: true,
          image: {
            select: {
              url: true
            }
          },
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
                  totalPrice: true
                }
              }
            }
          }
        }
      }
    };

    if (upcoming) {
      query.event.where = { startDate: { gte: new Date().toISOString() } };
    }
    if (organizer) {
      query.event.where = { organizer };
    }

    const result = await hypergraph.query(query);
    
    return NextResponse.json({
      success: true,
      data: result.event || []
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      description, 
      startDate, 
      endDate, 
      organizer, 
      imageUrl 
    } = body;

    // create event image
    let imageId = null;
    if (imageUrl) {
      const imageResult = await hypergraph.mutate({
        createImage: {
          __args: {
            input: {
              url: imageUrl
            }
          },
          id: true,
          url: true
        }
      });
      imageId = imageResult.createImage.id;
    }

    // create event
    const eventResult = await hypergraph.mutate({
      createEvent: {
        __args: {
          input: {
            name,
            description,
            startDate,
            endDate,
            organizer,
            image: imageId
          }
        },
        id: true,
        name: true,
        startDate: true,
        endDate: true
      }
    });

    return NextResponse.json({
      success: true,
      data: eventResult.createEvent
    });

  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}