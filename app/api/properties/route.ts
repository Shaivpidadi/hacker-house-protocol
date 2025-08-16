// app/api/properties/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { hypergraph } from '@graphprotocol/hypergraph';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'available';
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');
    const wifi = searchParams.get('wifi');

    // build query based on filters
    const query: any = {
      property: {
        where: { status },
        select: {
          id: true,
          name: true,
          description: true,
          location: true,
          price: true,
          bedrooms: true,
          bathrooms: true,
          wifi: true,
          amenities: true,
          features: true,
          deposit: true,
          image: {
            select: {
              url: true
            }
          },
          reviews: {
            select: {
              rating: true
            }
          }
        }
      }
    };

    // add filters
    if (location) {
      query.property.where.location = { contains: location };
    }
    if (minPrice || maxPrice) {
      query.property.where.price = {};
      if (minPrice) query.property.where.price.gte = parseFloat(minPrice);
      if (maxPrice) query.property.where.price.lte = parseFloat(maxPrice);
    }
    if (bedrooms) {
      query.property.where.bedrooms = { gte: parseInt(bedrooms) };
    }
    if (wifi) {
      query.property.where.wifi = wifi === 'true';
    }

    const result = await hypergraph.query(query);
    
    return NextResponse.json({
      success: true,
      data: result.property || []
    });

  } catch (error) {
    console.error('Error fetching properties:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Request body is required' },
        { status: 400 }
      );
    }

    const { 
      name, 
      description = '',
      location, 
      price, 
      bedrooms = 1,
      bathrooms = 1,
      parking = 0,
      amenities = '',
      wifi = true,
      features = '',
      deposit = 0,
      landlordWalletAddress,
      imageUrl 
    } = body;

    // Validate required fields
    if (!name || !location || !price || !landlordWalletAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, location, price, landlordWalletAddress' },
        { status: 400 }
      );
    }

    // create image first
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

    // create property
    const propertyResult = await hypergraph.mutate({
      createProperty: {
        __args: {
          input: {
            name,
            description,
            location,
            price,
            bedrooms,
            bathrooms,
            parking,
            amenities,
            wifi,
            features,
            status: 'available',
            type: 'hackerhouse',
            deposit,
            image: imageId,
            landlord: landlordWalletAddress
          }
        },
        id: true,
        name: true,
        location: true,
        price: true
      }
    });

    return NextResponse.json({
      success: true,
      data: propertyResult.createProperty
    });

  } catch (error) {
    console.error('Error creating property:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}