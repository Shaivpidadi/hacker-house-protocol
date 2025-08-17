# HHP Booking System

This document explains how the HackerHouseProtocol (HHP) booking system works and how to set it up.

## Overview

The HHP booking system allows users to:

1. **Create Reservations**: Book properties with date selection and guest management
2. **Fund Reservations**: Pay for their bookings using ETH
3. **Add Guests**: Invite other users to join their reservations
4. **Manage Payments**: Handle payment splits between multiple payers

## Smart Contract Integration

### Contract Functions Used

- **`createReservation`**: Creates a new reservation with eligibility proof
- **`fundReservation`**: Funds a reservation with ETH payment
- **`addGuest`**: Adds a guest to an existing reservation
- **`getReservation*`**: View functions to get reservation details

### Contract Parameters

#### CreateReservationArgs

```typescript
{
  listingId: number,        // The property listing ID
  startDate: number,        // Unix timestamp for check-in
  endDate: number,          // Unix timestamp for check-out
  nights: number,           // Number of nights
  payers: string[],         // Array of wallet addresses for payment
  bps: number[],            // Basis points for payment splits (10000 = 100%)
}
```

#### EligibilityProof

```typescript
{
  expiry: number,           // Unix timestamp when proof expires
  nonce: number,            // Unique nonce for the proof
  sig: string,              // ECDSA signature from verifier
}
```

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file with the following variables:

```bash
# HHP Protocol Configuration
NEXT_PUBLIC_HHP_ADDRESS=0xYourDeployedHHPContractAddress
NEXT_PUBLIC_CHAIN_ID=421614
NEXT_PUBLIC_TREASURY_ADDRESS=0xYourTreasuryAddress
NEXT_PUBLIC_VERIFIER_ADDRESS=0xYourVerifierAddress
```

### 2. Contract Deployment

Deploy the HHP smart contract to Arbitrum Sepolia (chain ID: 421614) or your preferred testnet.

### 3. Verifier Setup

Set up a backend service to generate eligibility proofs. The verifier should:

- Validate user credentials
- Generate ECDSA signatures
- Handle proof expiration and nonce management

## Usage Flow

### 1. User Books Property

1. User clicks "Book Now" on a property
2. Selects check-in and check-out dates
3. Optionally adds guest wallet addresses
4. System calculates total cost and payment splits

### 2. Create Reservation

1. System calls `createReservation` with:
   - Date range and guest information
   - Mock eligibility proof (replace with real verification)
2. Smart contract creates reservation and returns reservation ID
3. User sees confirmation with next steps

### 3. Fund Reservation

1. User clicks "Fund Reservation"
2. System calls `fundReservation` with ETH payment
3. Transaction includes the reservation amount
4. Reservation becomes active upon successful funding

### 4. Add Guests (Optional)

1. After reservation creation, users can add guests
2. Call `addGuest` with reservation ID and guest wallet address
3. Guests can then contribute to funding or access property details

## Components

### BookingModal

- **Location**: `components/booking/booking-modal.tsx`
- **Purpose**: Main interface for creating and managing reservations
- **Features**: Date selection, guest management, payment flow

### useHHPContract Hook

- **Location**: `hooks/use-hhp-contract.ts`
- **Purpose**: Smart contract interaction layer
- **Features**: Contract calls, transaction handling, error management

## Payment Handling

### ETH Payments

- All payments are made in ETH (native token)
- Amounts are converted to Wei for smart contract calls
- Payment splits are calculated in basis points (10000 = 100%)

### Payment Splits

- Automatically calculated based on number of guests
- Equal splits by default
- Adjustable through the `bps` parameter

## Error Handling

### Common Issues

1. **Wallet Not Connected**: User must connect wallet before booking
2. **Insufficient Balance**: User needs enough ETH for payment
3. **Invalid Dates**: Check-out must be after check-in
4. **Guest Limit**: Cannot exceed property's maximum guest capacity

### Error Messages

- User-friendly error messages via toast notifications
- Detailed error logging for debugging
- Graceful fallbacks for failed transactions

## Security Considerations

### Eligibility Proofs

- **Current**: Mock proofs for development
- **Production**: Real ECDSA signatures from verified backend
- **Expiration**: Proofs have time-limited validity

### Access Control

- Only reservation creators can add guests
- Payment verification through smart contract
- Blockchain-based reservation ownership

## Testing

### Testnet Setup

1. Use Arbitrum Sepolia for development
2. Get test ETH from faucet
3. Deploy test contracts
4. Test full booking flow

### Mock Data

- Mock eligibility proofs for development
- Test property listings
- Sample guest addresses

## Future Enhancements

### Planned Features

1. **Real Eligibility Verification**: Backend integration for proof generation
2. **ERC-20 Support**: Payment in other tokens
3. **Advanced Guest Management**: Guest permissions and access control
4. **Reservation Modifications**: Date changes and cancellations
5. **Dispute Resolution**: Smart contract-based conflict resolution

### Integration Points

1. **Backend API**: User verification and proof generation
2. **Payment Gateways**: Alternative payment methods
3. **Property Management**: Host dashboard and listing management
4. **Analytics**: Booking metrics and revenue tracking

## Troubleshooting

### Common Problems

1. **Contract Not Found**: Check contract address and network
2. **Transaction Failures**: Verify wallet balance and gas settings
3. **Date Selection Issues**: Ensure proper date validation
4. **Guest Addition Failures**: Check wallet address format

### Debug Information

- Console logging for contract calls
- Transaction hash tracking
- Error message details
- Network status monitoring

## Support

For issues or questions:

1. Check the console for error messages
2. Verify environment configuration
3. Test with simple transactions first
4. Review smart contract logs
5. Check network connectivity and gas settings
