import { Booking, Property, Hacker, Landlord, Image } from '@/schema';
import { useCreateEntity } from '@graphprotocol/hypergraph-react';
import { useState } from 'react';

interface BookingData {
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
  
  // hacker details (comma-separated)
  hackerNames: string;
  hackerWalletAddresses: string;
  hackerGithubUrls: string;
  hackerTwitterUrls: string;
  hackerAvatarUrls: string;
}

export function BulkUpload() {
  const createBooking = useCreateEntity(Booking);
  const createProperty = useCreateEntity(Property);
  const createHacker = useCreateEntity(Hacker);
  const createLandlord = useCreateEntity(Landlord);
  const createImage = useCreateEntity(Image);
  
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);
    setUploadProgress(null);

    try {
      const text = await file.text();
      let bookings: BookingData[];

      if (file.name.endsWith('.json')) {
        bookings = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        bookings = parseCSV(text);
      } else {
        throw new Error('Unsupported file format. Please use .json or .csv files.');
      }

      setUploadProgress({ current: 0, total: bookings.length });

      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < bookings.length; i++) {
        try {
          const bookingData = bookings[i];
          
          // create property image if provided
          let propertyImageEntity = null;
          if (bookingData.propertyImageUrl) {
            propertyImageEntity = await createImage({ url: bookingData.propertyImageUrl });
          }

          // create property entity
          const propertyData = {
            name: bookingData.propertyName,
            description: bookingData.propertyDescription,
            location: bookingData.propertyLocation,
            price: bookingData.propertyPrice,
            size: bookingData.propertySize,
            bedrooms: bookingData.propertyBedrooms,
            bathrooms: bookingData.propertyBathrooms,
            parking: bookingData.propertyParking,
            amenities: bookingData.propertyAmenities,
            wifi: bookingData.propertyWifi,
            features: bookingData.propertyFeatures,
            status: bookingData.propertyStatus,
            type: bookingData.propertyType,
            deposit: bookingData.propertyDeposit,
            ...(propertyImageEntity && { image: [propertyImageEntity.id] })
          };
          const property = await createProperty(propertyData);

          // create landlord image if provided
          let landlordImageEntity = null;
          if (bookingData.landlordAvatarUrl) {
            landlordImageEntity = await createImage({ url: bookingData.landlordAvatarUrl });
          }

          // create landlord entity
          const landlordData = {
            name: bookingData.landlordName,
            walletAddress: bookingData.landlordWalletAddress,
            verified: bookingData.landlordVerified,
            ...(landlordImageEntity && { avatar: [landlordImageEntity.id] })
          };
          const landlord = await createLandlord(landlordData);

          // create hacker entities
          const hackerNames = bookingData.hackerNames.split(',').map(s => s.trim()).filter(s => s);
          const hackerWalletAddresses = bookingData.hackerWalletAddresses.split(',').map(s => s.trim()).filter(s => s);
          const hackerGithubUrls = bookingData.hackerGithubUrls.split(',').map(s => s.trim()).filter(s => s);
          const hackerTwitterUrls = bookingData.hackerTwitterUrls.split(',').map(s => s.trim()).filter(s => s);
          const hackerAvatarUrls = bookingData.hackerAvatarUrls.split(',').map(s => s.trim()).filter(s => s);

          const hackers = [];
          for (let j = 0; j < hackerNames.length; j++) {
            let hackerImageEntity = null;
            if (hackerAvatarUrls[j]) {
              hackerImageEntity = await createImage({ url: hackerAvatarUrls[j] });
            }

            const hackerData = {
              name: hackerNames[j],
              walletAddress: hackerWalletAddresses[j] || '',
              githubUrl: hackerGithubUrls[j] || '',
              twitterUrl: hackerTwitterUrls[j] || '',
              ...(hackerImageEntity && { avatar: [hackerImageEntity.id] })
            };
            const hacker = await createHacker(hackerData);
            hackers.push(hacker);
          }

          // create booking entity
          const bookingDataFinal = {
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            status: bookingData.status,
            totalPrice: bookingData.totalPrice,
            deposit: bookingData.deposit,
            guestCount: bookingData.guestCount,
            paymentStatus: bookingData.paymentStatus,
            paymentDate: bookingData.paymentDate,
            paymentAmount: bookingData.paymentAmount,
            paymentCurrency: bookingData.paymentCurrency,
            notes: bookingData.notes,
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
          await createBooking(bookingDataFinal);

          successCount++;
        } catch (error) {
          console.error(`Error processing booking ${i + 1}:`, error);
          errorCount++;
        }

        setUploadProgress({ current: i + 1, total: bookings.length });
      }

      setMessage({ 
        type: 'success', 
        text: `Bulk upload completed! Successfully created ${successCount} bookings. ${errorCount} failed.` 
      });

    } catch (error) {
      console.error('Error processing file:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const parseCSV = (csvText: string): BookingData[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const bookings: BookingData[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(v => v.trim());
      const booking: Record<string, unknown> = {};
      
      headers.forEach((header, index) => {
        let value: unknown = values[index] || '';
        
        // convert boolean strings
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        // convert numbers
        else if (!isNaN(Number(value)) && value !== '') value = Number(value);
        
        booking[header] = value;
      });
      
      bookings.push(booking as unknown as BookingData);
    }

    return bookings;
  };

  const downloadTemplate = () => {
    const template = [
      'checkIn,checkOut,status,totalPrice,deposit,guestCount,paymentStatus,paymentDate,paymentAmount,paymentCurrency,notes,propertyName,propertyDescription,propertyLocation,propertyPrice,propertySize,propertyBedrooms,propertyBathrooms,propertyParking,propertyAmenities,propertyWifi,propertyFeatures,propertyStatus,propertyType,propertyDeposit,propertyImageUrl,landlordName,landlordWalletAddress,landlordVerified,landlordAvatarUrl,hackerNames,hackerWalletAddresses,hackerGithubUrls,hackerTwitterUrls,hackerAvatarUrls',
      '2024-01-15,2024-01-20,confirmed,500,100,2,paid,2024-01-10,500,USD,Great stay,Sunset Apartments,Beautiful apartment in downtown,San Francisco CA,200,1200,2,1,1,Gym Pool,true,Air conditioning,available,apartment,200,https://example.com/property.jpg,John Landlord,0x123456789,true,https://example.com/landlord.jpg,Alice Hacker Bob Developer,0xabc 0xdef,https://github.com/alice https://github.com/bob,https://twitter.com/alice https://twitter.com/bob,https://example.com/alice.jpg https://example.com/bob.jpg'
    ].join('\n');

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'booking-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Bulk Upload Bookings
        </h2>
        <p className="text-gray-600">
          Upload multiple bookings at once using CSV or JSON files. This is perfect for importing existing booking data.
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

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="space-y-6">
          {/* file upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Supported formats: CSV, JSON. Maximum file size: 10MB.
            </p>
          </div>

          {/* progress */}
          {uploadProgress && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Upload Progress</span>
                <span className="text-sm text-gray-500">
                  {uploadProgress.current} / {uploadProgress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* template download */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">File Format</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">CSV Format</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Use comma-separated values with headers. Each row represents one booking with all related entities.
                </p>
                <button
                  onClick={downloadTemplate}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download CSV Template
                </button>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">JSON Format</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Use an array of booking objects. Each object should contain all booking, property, landlord, and hacker data.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-xs text-gray-600 overflow-x-auto">
{`[
  {
    "checkIn": "2024-01-15",
    "checkOut": "2024-01-20",
    "status": "confirmed",
    "totalPrice": 500,
    "propertyName": "Sunset Apartments",
    "landlordName": "John Landlord",
    "hackerNames": "Alice Hacker, Bob Developer",
    ...
  }
]`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* instructions */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• <strong>Required fields:</strong> checkIn, checkOut, totalPrice, propertyName, landlordName, hackerNames</p>
              <p>• <strong>Multiple hackers:</strong> Separate names with commas (e.g., "Alice, Bob, Charlie")</p>
              <p>• <strong>Boolean values:</strong> Use "true" or "false" for wifi and landlordVerified</p>
              <p>• <strong>Dates:</strong> Use YYYY-MM-DD format</p>
              <p>• <strong>Images:</strong> Provide full URLs for property and avatar images</p>
              <p>• <strong>Large files:</strong> Consider splitting into smaller batches for better performance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
