import { useCreateEntity } from '@graphprotocol/hypergraph-react';
import { Property, Booking, Hacker, Landlord, Event, Review, Image } from '@/app/schema';

// Helper functions for common operations

export function useCreatePropertyWithImage() {
  const createImage = useCreateEntity(Image);
  const createProperty = useCreateEntity(Property);

  return async (propertyData: any, imageUrl?: string) => {
    let imageId = null;
    
    if (imageUrl) {
      const imageResult = await createImage.mutate({
        url: imageUrl
      });
      imageId = imageResult.id;
    }

    return await createProperty.mutate({
      ...propertyData,
      image: imageId
    });
  };
}

export function useCreateBookingWithHackers() {
  const createBooking = useCreateEntity(Booking);

  return async (bookingData: any, hackerIds: string[]) => {
    return await createBooking.mutate({
      ...bookingData,
      hackers: hackerIds
    });
  };
}

export function useCreateHackerWithAvatar() {
  const createImage = useCreateEntity(Image);
  const createHacker = useCreateEntity(Hacker);

  return async (hackerData: any, avatarUrl?: string) => {
    let avatarId = null;
    
    if (avatarUrl) {
      const imageResult = await createImage.mutate({
        url: avatarUrl
      });
      avatarId = imageResult.id;
    }

    return await createHacker.mutate({
      ...hackerData,
      avatar: avatarId
    });
  };
}

export function useCreateLandlordWithAvatar() {
  const createImage = useCreateEntity(Image);
  const createLandlord = useCreateEntity(Landlord);

  return async (landlordData: any, avatarUrl?: string) => {
    let avatarId = null;
    
    if (avatarUrl) {
      const imageResult = await createImage.mutate({
        url: avatarUrl
      });
      avatarId = imageResult.id;
    }

    return await createLandlord.mutate({
      ...landlordData,
      avatar: avatarId
    });
  };
}

export function useCreateEventWithImage() {
  const createImage = useCreateEntity(Image);
  const createEvent = useCreateEntity(Event);

  return async (eventData: any, imageUrl?: string) => {
    let imageId = null;
    
    if (imageUrl) {
      const imageResult = await createImage.mutate({
        url: imageUrl
      });
      imageId = imageResult.id;
    }

    return await createEvent.mutate({
      ...eventData,
      image: imageId
    });
  };
}
