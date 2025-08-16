# HHP Protocol Integration

This document explains how the Hacker House Protocol (HHP) has been integrated into the CryptoReal application.

## Overview

The HHP integration provides users with the ability to interact with the Hacker House Protocol smart contract directly from the application. Users can create reservations, fund them, add guests, and manage their bookings through a user-friendly interface.

## Features Implemented

### 1. Contract Actions (`components/hhp-actions.tsx`)

**Create Reservation**

- Users can create new reservations by specifying listing ID, start date, and end date
- Automatically calculates the number of nights
- Integrates with the eligibility proof system
- Handles both proof-required and non-proof listings

**Fund Reservation**

- Users can fund their reservations with ERC-20 tokens
- Includes automatic token approval flow
- Shows real-time transaction status
- Handles payment token detection from listings

**Add Guest**

- Add additional guests to existing reservations
- Validates guest addresses
- Provides immediate feedback on success/failure

**Withdraw (Builder Only)**

- Allows builders to withdraw funds from completed reservations
- Restricted to reservation builders only
- Handles withdrawal to specified address

### 2. Reservation Management (`components/reservation-manager.tsx`)

- **View Reservations**: Display all user reservations with status
- **Reservation Details**: Expandable view showing full reservation information
- **Quick Actions**: Direct access to fund, add guest, and withdraw functions
- **Status Tracking**: Real-time updates on reservation status and payment

### 3. Smart Contract Integration

**Ethers v6 Integration**

- Uses the recommended Privy → getEthereumProvider → ethers v6 BrowserProvider pattern
- Proper network switching and validation
- Secure signer management

**Contract ABI**

- Minimal ABI containing only necessary functions
- Includes view functions for data retrieval
- Event definitions for better UX

## Configuration

### Environment Variables

```bash
# HHP Protocol Configuration
NEXT_PUBLIC_HHP_ADDRESS=0xYourDeployedAddress
NEXT_PUBLIC_CHAIN_ID=421614  # Arbitrum Sepolia by default
```

### Supported Networks

- **Arbitrum Sepolia** (421614) - Default testnet
- **Arbitrum One** (42161) - Mainnet
- **Sepolia** (11155111) - Ethereum testnet
- **Ethereum Mainnet** (1) - Production

## Usage Flow

### 1. Wallet Connection

- Users must connect their wallet through Privy
- Automatic network switching to the correct chain
- Validation of wallet connection state

### 2. Creating a Reservation

1. Select listing ID from available properties
2. Choose start and end dates
3. System calculates nights automatically
4. Submit transaction with optional proof verification

### 3. Funding a Reservation

1. Enter reservation ID and amount
2. Approve token spending (automatic)
3. Fund the reservation
4. Receive confirmation

### 4. Managing Reservations

- View all active and completed reservations
- Expand details for each reservation
- Access quick actions based on reservation status

## Security Features

### 1. Authentication

- All actions require connected wallet
- Privy handles wallet authentication
- Server-side token verification for API calls

### 2. Input Validation

- Address format validation
- Date range validation
- Numeric input sanitization

### 3. Transaction Safety

- Network validation before transactions
- Proper error handling and user feedback
- Transaction confirmation tracking

## API Endpoints

### Eligibility Proof (`/api/eligibility`)

- Generates proof for listings requiring verification
- Currently returns mock data (ready for real implementation)
- Supports listing-specific eligibility checks

## Error Handling

### User-Friendly Messages

- Clear error descriptions
- Actionable feedback
- Loading states for all operations

### Transaction Monitoring

- Real-time status updates
- Success/failure notifications
- Detailed error logging

## Future Enhancements

### 1. Real Blockchain Integration

- Replace mock data with actual contract calls
- Implement proper event listening
- Add transaction history tracking

### 2. Advanced Features

- Batch operations for multiple reservations
- Advanced filtering and search
- Integration with IPFS for metadata

### 3. Analytics and Reporting

- Reservation analytics
- Payment tracking
- User behavior insights

## Development Notes

### Dependencies

- `ethers@^6.11.1` - Blockchain interaction
- `@privy-io/react-auth` - Wallet management
- Custom hooks for state management

### File Structure

```
lib/
  ├── eth.ts          # Ethers integration
  ├── abi.ts          # Contract ABI
  └── constants.ts    # Configuration
components/
  ├── hhp-actions.tsx        # Main contract actions
  └── reservation-manager.tsx # Reservation management
app/
  ├── hhp/page.tsx           # HHP dashboard
  └── api/eligibility/       # Proof generation
```

### Testing

- All components include proper error boundaries
- Mock data for development and testing
- Comprehensive error handling

## Troubleshooting

### Common Issues

1. **Wrong Network**

   - Ensure wallet is connected to the correct chain
   - Use the network switching function

2. **Transaction Failures**

   - Check gas fees and wallet balance
   - Verify contract address and ABI
   - Ensure proper token approvals

3. **Proof Verification**
   - Check eligibility API endpoint
   - Verify proof format and expiry
   - Ensure listing requires proof

### Debug Mode

Enable detailed logging by setting:

```bash
NEXT_PUBLIC_PRIVY_DEBUG=true
```

## Support

For technical support or questions about the HHP integration:

- Check the console for detailed error messages
- Verify environment variable configuration
- Ensure all dependencies are properly installed
- Test with a known working wallet and network

## Integration Status

✅ **Complete**

- Contract action components
- Reservation management
- Wallet integration
- Error handling
- User interface

🔄 **Ready for Enhancement**

- Real blockchain data
- Advanced proof verification
- Transaction history
- Analytics dashboard
