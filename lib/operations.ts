import { useCreateEntity } from '@graphprotocol/hypergraph-react';
import { Property, Booking, Hacker, Landlord, Event, Review, Image } from '@/app/schema';

// Helper functions for common operations

export function useCreatePropertyWithImage() {
  const createImage = useCreateEntity(Image);
  const createProperty = useCreateEntity(Property);

  return async (propertyData: {
    name: string;
    description: string;
    location: string;
    price: number;
    size: number;
    bedrooms: number;
    bathrooms: number;
    parking: number;
    amenities: string;
    wifi: boolean;
    features: string;
    status: string;
    type: string;
    deposit: number;
  }, imageUrl?: string) => {
    let imageId: string[] | undefined = undefined;
    
    if (imageUrl) {
      const imageResult = createImage({
        url: imageUrl
      });
      imageId = [imageResult.id];
    }

    return createProperty({
      ...propertyData,
      image: imageId
    });
  };
}

export function useCreateBookingWithHackers() {
  const createBooking = useCreateEntity(Booking);

  return async (bookingData: {
    checkIn: string;
    checkOut: string;
    status: string;
    totalPrice: number;
    deposit: number;
    guestCount: number;
    paymentStatus: string;
    paymentDate: string;
    paymentAmount: number;
    paymentCurrency: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
    cancelledAt: string;
    cancelledBy: string;
    cancelledReason: string;
    cancelledNotes: string;
  }, hackerIds: string[]) => {
    return createBooking({
      ...bookingData,
      hackers: hackerIds
    });
  };
}

export function useCreateHackerWithAvatar() {
  const createImage = useCreateEntity(Image);
  const createHacker = useCreateEntity(Hacker);

  return async (hackerData: {
    name: string;
    walletAddress: string;
    githubUrl: string;
    twitterUrl: string;
  }, avatarUrl?: string) => {
    let avatarId: string[] | undefined = undefined;
    
    if (avatarUrl) {
      const imageResult = createImage({
        url: avatarUrl
      });
      avatarId = [imageResult.id];
    }

    return createHacker({
      ...hackerData,
      avatar: avatarId
    });
  };
}

export function useCreateLandlordWithAvatar() {
  const createImage = useCreateEntity(Image);
  const createLandlord = useCreateEntity(Landlord);

  return async (landlordData: {
    name: string;
    walletAddress: string;
    verified: boolean;
  }, avatarUrl?: string) => {
    let avatarId: string[] | undefined = undefined;
    
    if (avatarUrl) {
      const imageResult = createImage({
        url: avatarUrl
      });
      avatarId = [imageResult.id];
    }

    return createLandlord({
      ...landlordData,
      avatar: avatarId
    });
  };
}

export function useCreateEventWithImage() {
  const createImage = useCreateEntity(Image);
  const createEvent = useCreateEntity(Event);

  return async (eventData: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    organizer: string;
  }, imageUrl?: string) => {
    let imageId: string[] | undefined = undefined;
    
    if (imageUrl) {
      const imageResult = createImage({
        url: imageUrl
      });
      imageId = [imageResult.id];
    }

    return createEvent({
      ...eventData,
      image: imageId
    });
  };
}
