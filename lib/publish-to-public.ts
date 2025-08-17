import { preparePublish, publishOps, useHypergraphApp, useQuery } from '@graphprotocol/hypergraph-react';
import { Hacker, Property, Booking, Landlord, Event, Review, Image } from '@/app/schema';

// function to publish entities to public space
export function usePublishToPublicSpace() {
  const { getSmartSessionClient } = useHypergraphApp();

  return async (publicSpaceId: string) => {
    try {
      console.log('🚀 Starting to publish entities to public space...');
      
      const smartSessionClient = await getSmartSessionClient();
      if (!smartSessionClient) {
        throw new Error('Missing smartSessionClient - please authenticate first');
      }

      // get all entities from private space
      const { data: hackers } = useQuery(Hacker, { mode: 'private' });
      const { data: landlords } = useQuery(Landlord, { mode: 'private' });
      const { data: properties } = useQuery(Property, { mode: 'private' });
      const { data: bookings } = useQuery(Booking, { mode: 'private' });
      const { data: reviews } = useQuery(Review, { mode: 'private' });
      const { data: events } = useQuery(Event, { mode: 'private' });
      const { data: images } = useQuery(Image, { mode: 'private' });

      // prepare publish operations for all entities
      const allOps: any[] = [];

      // publish images first (since other entities reference them)
      for (const image of images || []) {
        const { ops } = preparePublish({
          entity: image,
          publicSpace: publicSpaceId,
        });
        allOps.push(...ops);
      }

      // publish hackers
      for (const hacker of hackers || []) {
        const { ops } = preparePublish({
          entity: hacker,
          publicSpace: publicSpaceId,
        });
        allOps.push(...ops);
      }

      // publish landlords
      for (const landlord of landlords || []) {
        const { ops } = preparePublish({
          entity: landlord,
          publicSpace: publicSpaceId,
        });
        allOps.push(...ops);
      }

      // publish properties
      for (const property of properties || []) {
        const { ops } = preparePublish({
          entity: property,
          publicSpace: publicSpaceId,
        });
        allOps.push(...ops);
      }

      // publish events
      for (const event of events || []) {
        const { ops } = preparePublish({
          entity: event,
          publicSpace: publicSpaceId,
        });
        allOps.push(...ops);
      }

      // publish bookings
      for (const booking of bookings || []) {
        const { ops } = preparePublish({
          entity: booking,
          publicSpace: publicSpaceId,
        });
        allOps.push(...ops);
      }

      // publish reviews
      for (const review of reviews || []) {
        const { ops } = preparePublish({
          entity: review,
          publicSpace: publicSpaceId,
        });
        allOps.push(...ops);
      }

      console.log(`📦 Prepared ${allOps.length} operations for publishing`);

      // publish all operations in one go
      const publishResult = await publishOps({
        ops: allOps,
        space: publicSpaceId,
        name: 'Publish Hackerhouse Data',
        walletClient: smartSessionClient,
      });

      console.log('✅ Successfully published all entities to public space!');
      console.log('📊 Published:', {
        images: images?.length || 0,
        hackers: hackers?.length || 0,
        landlords: landlords?.length || 0,
        properties: properties?.length || 0,
        events: events?.length || 0,
        bookings: bookings?.length || 0,
        reviews: reviews?.length || 0,
      });

      return { success: true, result: publishResult };
    } catch (error) {
      console.error('❌ Failed to publish to public space:', error);
      return { success: false, error };
    }
  };
}
