import { Booking, Property, Hacker, Landlord, Image } from '@/schema';
import { useCreateEntity, useSpaces } from '@graphprotocol/hypergraph-react';
import { useState } from 'react';

interface BookingFormData {
  // booking details
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
  
  // property details
  propertyName: string;
  propertyDescription: string;
  propertyLocation: string;
  propertyPrice: number;
  propertySize: number;
  propertyBedrooms: number;
  propertyBathrooms: number;
  propertyParking: number;
  propertyAmenities: string;
  propertyWifi: boolean;
  propertyFeatures: string;
  propertyStatus: string;
  propertyType: string;
  propertyDeposit: number;
  propertyImageUrl: string;
  
  // landlord details
  landlordName: string;
  landlordWalletAddress: string;
  landlordVerified: boolean;
  landlordAvatarUrl: string;
  
  // hacker details (comma-separated for multiple hackers)
  hackerNames: string;
  hackerWalletAddresses: string;
  hackerGithubUrls: string;
  hackerTwitterUrls: string;
  hackerAvatarUrls: string;
  
  // event details
  eventName: string;
  eventDescription: string;
  eventStartDate: string;
  eventEndDate: string;
  eventOrganizer: string;
  eventImageUrl: string;
}

export function PublishBooking() {
  const { data: spaces } = useSpaces({ mode: 'public' });
  const createBooking = useCreateEntity(Booking);
  const createProperty = useCreateEntity(Property);
  const createHacker = useCreateEntity(Hacker);
  const createLandlord = useCreateEntity(Landlord);
  const createImage = useCreateEntity(Image);
  
  // get the first available space (you might want to let users choose)
  const publicSpace = spaces?.[0];
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState<BookingFormData>({
    // booking details
    checkIn: '',
    checkOut: '',
    status: 'confirmed',
    totalPrice: 0,
    deposit: 0,
    guestCount: 1,
    paymentStatus: 'paid',
    paymentDate: '',
    paymentAmount: 0,
    paymentCurrency: 'USD',
    notes: '',
    
    // property details
    propertyName: '',
    propertyDescription: '',
    propertyLocation: '',
    propertyPrice: 0,
    propertySize: 0,
    propertyBedrooms: 1,
    propertyBathrooms: 1,
    propertyParking: 0,
    propertyAmenities: '',
    propertyWifi: false,
    propertyFeatures: '',
    propertyStatus: 'available',
    propertyType: 'apartment',
    propertyDeposit: 0,
    propertyImageUrl: '',
    
    // landlord details
    landlordName: '',
    landlordWalletAddress: '',
    landlordVerified: false,
    landlordAvatarUrl: '',
    
    // hacker details
    hackerNames: '',
    hackerWalletAddresses: '',
    hackerGithubUrls: '',
    hackerTwitterUrls: '',
    hackerAvatarUrls: '',
    
    // event details
    eventName: '',
    eventDescription: '',
    eventStartDate: '',
    eventEndDate: '',
    eventOrganizer: '',
    eventImageUrl: ''
  });

  // show loading while spaces are being fetched
  if (!spaces) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof BookingFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!publicSpace) {
      setMessage({ type: 'error', text: 'No public space available for publishing' });
      return;
    }
    
    setIsPublishing(true);
    setMessage(null);

    try {
      // create property image if provided
      let propertyImageEntity = null;
      if (formData.propertyImageUrl) {
        propertyImageEntity = await createImage({ url: formData.propertyImageUrl });
      }

      // create property entity
      const propertyData = {
        name: formData.propertyName,
        description: formData.propertyDescription,
        location: formData.propertyLocation,
        price: formData.propertyPrice,
        size: formData.propertySize,
        bedrooms: formData.propertyBedrooms,
        bathrooms: formData.propertyBathrooms,
        parking: formData.propertyParking,
        amenities: formData.propertyAmenities,
        wifi: formData.propertyWifi,
        features: formData.propertyFeatures,
        status: formData.propertyStatus,
        type: formData.propertyType,
        deposit: formData.propertyDeposit,
        ...(propertyImageEntity && { image: [propertyImageEntity.id] })
      };
      const property = await createProperty(propertyData);

      // create landlord image if provided
      let landlordImageEntity = null;
      if (formData.landlordAvatarUrl) {
        landlordImageEntity = await createImage({ url: formData.landlordAvatarUrl });
      }

      // create landlord entity
      const landlordData = {
        name: formData.landlordName,
        walletAddress: formData.landlordWalletAddress,
        verified: formData.landlordVerified,
        ...(landlordImageEntity && { avatar: [landlordImageEntity.id] })
      };
      const landlord = await createLandlord(landlordData);

      // create hacker entities (support multiple hackers)
      const hackerNames = formData.hackerNames.split(',').map(s => s.trim()).filter(s => s);
      const hackerWalletAddresses = formData.hackerWalletAddresses.split(',').map(s => s.trim()).filter(s => s);
      const hackerGithubUrls = formData.hackerGithubUrls.split(',').map(s => s.trim()).filter(s => s);
      const hackerTwitterUrls = formData.hackerTwitterUrls.split(',').map(s => s.trim()).filter(s => s);
      const hackerAvatarUrls = formData.hackerAvatarUrls.split(',').map(s => s.trim()).filter(s => s);

      const hackers = [];
      for (let i = 0; i < hackerNames.length; i++) {
        let hackerImageEntity = null;
        if (hackerAvatarUrls[i]) {
          hackerImageEntity = await createImage({ url: hackerAvatarUrls[i] });
        }

        const hackerData = {
          name: hackerNames[i],
          walletAddress: hackerWalletAddresses[i] || '',
          githubUrl: hackerGithubUrls[i] || '',
          twitterUrl: hackerTwitterUrls[i] || '',
          ...(hackerImageEntity && { avatar: [hackerImageEntity.id] })
        };
        const hacker = await createHacker(hackerData);
        hackers.push(hacker);
      }



      // create booking entity with all relationships
      const bookingData = {
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        status: formData.status,
        totalPrice: formData.totalPrice,
        deposit: formData.deposit,
        guestCount: formData.guestCount,
        paymentStatus: formData.paymentStatus,
        paymentDate: formData.paymentDate,
        paymentAmount: formData.paymentAmount,
        paymentCurrency: formData.paymentCurrency,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        property: [property.id],
        hackers: hackers.map(h => h.id),
        landlord: [landlord.id],
        cancelledAt: '',
        cancelledBy: '',
        cancelledReason: '',
        cancelledNotes: ''
      };
      const booking = await createBooking(bookingData);

      setMessage({ 
        type: 'success', 
        text: `Booking published successfully! Created ${hackers.length} hackers, 1 property, 1 landlord, 1 event, and 1 booking. Booking ID: ${booking.id}` 
      });

      // reset form
      setFormData({
        checkIn: '',
        checkOut: '',
        status: 'confirmed',
        totalPrice: 0,
        deposit: 0,
        guestCount: 1,
        paymentStatus: 'paid',
        paymentDate: '',
        paymentAmount: 0,
        paymentCurrency: 'USD',
        notes: '',
        propertyName: '',
        propertyDescription: '',
        propertyLocation: '',
        propertyPrice: 0,
        propertySize: 0,
        propertyBedrooms: 1,
        propertyBathrooms: 1,
        propertyParking: 0,
        propertyAmenities: '',
        propertyWifi: false,
        propertyFeatures: '',
        propertyStatus: 'available',
        propertyType: 'apartment',
        propertyDeposit: 0,
        propertyImageUrl: '',
        landlordName: '',
        landlordWalletAddress: '',
        landlordVerified: false,
        landlordAvatarUrl: '',
        hackerNames: '',
        hackerWalletAddresses: '',
        hackerGithubUrls: '',
        hackerTwitterUrls: '',
        hackerAvatarUrls: '',
        eventName: '',
        eventDescription: '',
        eventStartDate: '',
        eventEndDate: '',
        eventOrganizer: '',
        eventImageUrl: ''
      });

    } catch (error) {
      console.error('Error publishing booking:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to publish booking: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Publish Booking to Knowledge Graph
        </h2>
        <p className="text-gray-600">
          Add a complete booking with all related entities (property, hackers, landlord, event) to your public knowledge graph.
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Booking Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Booking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date *</label>
              <input
                type="date"
                required
                value={formData.checkIn}
                onChange={(e) => handleInputChange('checkIn', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date *</label>
              <input
                type="date"
                required
                value={formData.checkOut}
                onChange={(e) => handleInputChange('checkOut', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Price (USD) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.totalPrice}
                onChange={(e) => handleInputChange('totalPrice', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deposit (USD)</label>
              <input
                type="number"
                min="0"
                value={formData.deposit}
                onChange={(e) => handleInputChange('deposit', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Guest Count</label>
              <input
                type="number"
                min="1"
                value={formData.guestCount}
                onChange={(e) => handleInputChange('guestCount', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount (USD)</label>
              <input
                type="number"
                min="0"
                value={formData.paymentAmount}
                onChange={(e) => handleInputChange('paymentAmount', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Additional notes about the booking..."
            />
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Property Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Name *</label>
              <input
                type="text"
                required
                value={formData.propertyName}
                onChange={(e) => handleInputChange('propertyName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter property name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                required
                value={formData.propertyLocation}
                onChange={(e) => handleInputChange('propertyLocation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="City, Country"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.propertyPrice}
                onChange={(e) => handleInputChange('propertyPrice', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size (sq ft)</label>
              <input
                type="number"
                min="0"
                value={formData.propertySize}
                onChange={(e) => handleInputChange('propertySize', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
              <input
                type="number"
                min="0"
                value={formData.propertyBedrooms}
                onChange={(e) => handleInputChange('propertyBedrooms', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
              <input
                type="number"
                min="0"
                value={formData.propertyBathrooms}
                onChange={(e) => handleInputChange('propertyBathrooms', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                value={formData.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="studio">Studio</option>
                <option value="loft">Loft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <input
                type="text"
                value={formData.propertyAmenities}
                onChange={(e) => handleInputChange('propertyAmenities', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Gym, Pool, Garden, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Image URL</label>
              <input
                type="url"
                value={formData.propertyImageUrl}
                onChange={(e) => handleInputChange('propertyImageUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Description</label>
            <textarea
              value={formData.propertyDescription}
              onChange={(e) => handleInputChange('propertyDescription', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Describe the property..."
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
            <input
              type="text"
              value={formData.propertyFeatures}
              onChange={(e) => handleInputChange('propertyFeatures', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Air conditioning, Heating, etc."
            />
          </div>
          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="propertyWifi"
              checked={formData.propertyWifi}
              onChange={(e) => handleInputChange('propertyWifi', e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="propertyWifi" className="ml-2 block text-sm text-gray-700">
              WiFi Available
            </label>
          </div>
        </div>

        {/* Landlord Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Landlord Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Landlord Name *</label>
              <input
                type="text"
                required
                value={formData.landlordName}
                onChange={(e) => handleInputChange('landlordName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter landlord name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address *</label>
              <input
                type="text"
                required
                value={formData.landlordWalletAddress}
                onChange={(e) => handleInputChange('landlordWalletAddress', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="0x..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Landlord Avatar URL</label>
              <input
                type="url"
                value={formData.landlordAvatarUrl}
                onChange={(e) => handleInputChange('landlordAvatarUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="landlordVerified"
                checked={formData.landlordVerified}
                onChange={(e) => handleInputChange('landlordVerified', e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="landlordVerified" className="ml-2 block text-sm text-gray-700">
                Verified Landlord
              </label>
            </div>
          </div>
        </div>

        {/* Hacker Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Hacker Details (Multiple hackers supported)</h3>
          <p className="text-sm text-gray-600 mb-4">Enter multiple values separated by commas. Leave empty if not applicable.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hacker Names *</label>
              <input
                type="text"
                required
                value={formData.hackerNames}
                onChange={(e) => handleInputChange('hackerNames', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="John Doe, Jane Smith, Bob Johnson"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Addresses</label>
              <input
                type="text"
                value={formData.hackerWalletAddresses}
                onChange={(e) => handleInputChange('hackerWalletAddresses', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="0x123..., 0x456..., 0x789..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URLs</label>
              <input
                type="text"
                value={formData.hackerGithubUrls}
                onChange={(e) => handleInputChange('hackerGithubUrls', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://github.com/johndoe, https://github.com/janesmith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twitter/X URLs</label>
              <input
                type="text"
                value={formData.hackerTwitterUrls}
                onChange={(e) => handleInputChange('hackerTwitterUrls', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://twitter.com/johndoe, https://twitter.com/janesmith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URLs</label>
              <input
                type="text"
                value={formData.hackerAvatarUrls}
                onChange={(e) => handleInputChange('hackerAvatarUrls', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://example.com/avatar1.jpg, https://example.com/avatar2.jpg"
              />
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Event Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Name *</label>
              <input
                type="text"
                required
                value={formData.eventName}
                onChange={(e) => handleInputChange('eventName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter event name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organizer *</label>
              <input
                type="text"
                required
                value={formData.eventOrganizer}
                onChange={(e) => handleInputChange('eventOrganizer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Event organizer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.eventStartDate}
                onChange={(e) => handleInputChange('eventStartDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={formData.eventEndDate}
                onChange={(e) => handleInputChange('eventEndDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Image URL</label>
              <input
                type="url"
                value={formData.eventImageUrl}
                onChange={(e) => handleInputChange('eventImageUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="https://example.com/event-image.jpg"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Description</label>
            <textarea
              value={formData.eventDescription}
              onChange={(e) => handleInputChange('eventDescription', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Describe the event..."
            />
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isPublishing}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 focus:ring-4 focus:ring-purple-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Publishing Booking...
              </div>
            ) : (
              'Publish Complete Booking'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
