# Fund Reservation Implementation

## Overview

The `fundReservation` function has been completely rewritten to properly handle both ETH and ERC-20 token payments for the HackerHouse Protocol.

## Key Features

### 1. **Dual Payment Support**

- **ETH Payments**: Direct ETH transfers when `paymentToken` is `address(0)`
- **ERC-20 Token Payments**: Token approvals and transfers for other payment tokens

### 2. **Smart Validation**

- Checks if reservation can be funded (must be inactive initially)
- Calculates exact remaining amount needed
- Prevents over-funding by using remaining amount exactly
- Automatically activates when fully funded

### 3. **Enhanced Error Handling**

- Contract revert error decoding
- User-friendly error messages
- Comprehensive logging for debugging

## Implementation Details

### Payment Flow

#### ETH Payment (Native Token)

```typescript
if (isETH) {
  const amountWei = ethers.parseEther(amount);
  const tx = await contract.fundReservation(
    BigInt(reservationId),
    amountWei,
    { value: amountWei } // Send ETH with transaction
  );
}
```

#### ERC-20 Token Payment

```typescript
// 1. Check current allowance
const currentAllowance = await erc20Contract.allowance(
  walletAddress,
  contractAddress
);

// 2. Approve if needed
if (currentAllowance < amountWei) {
  const approveTx = await erc20Contract.approve(contractAddress, amountWei);
  await approveTx.wait();
}

// 3. Fund reservation
const tx = await contract.fundReservation(BigInt(reservationId), amountWei);
```

### Validation Logic

1. **Reservation Status**: Ensures reservation is inactive (ready for funding)
2. **Balance Check**: Calculates exact remaining amount needed
3. **Amount Calculation**: Uses remaining amount to prevent over-funding
4. **Payment Token**: Automatically detects ETH vs ERC-20
5. **Activation Detection**: Monitors ReservationFunded events for activation

### Activation Flow

1. **Create Reservation**: `active = false` (needs funding)
2. **Fund Reservation**: Adds to `amountPaid`
3. **Auto-Activation**: When `amountPaid >= totalDue`, sets `active = true`
4. **Event Emission**: `ReservationFunded(..., activated=true)` when fully funded

### Error Handling

The function includes comprehensive error handling for:

- Contract reverts
- Insufficient allowances
- Invalid amounts
- Network errors
- User rejections

## Usage

### Basic Usage

```typescript
const { fundReservation } = useHHPContract();

const success = await fundReservation(
  reservationId, // number
  amount.toString() // string (in ETH/token units)
);
```

### Advanced Usage with Details

```typescript
const { fundReservation, getReservationDetails } = useHHPContract();

// Get reservation details first
const details = await getReservationDetails(reservationId);
console.log("Reservation:", details.reservation);
console.log("Listing:", details.listing);

// Then fund
const success = await fundReservation(reservationId, amount);
```

## New Functions Added

### `getReservationDetails(reservationId: number)`

Returns comprehensive reservation and listing information:

- Reservation details (dates, amounts, status)
- Listing details (payment token, rates, builder)
- Useful for UI display and validation

## Configuration

### Environment Variables

- `NEXT_PUBLIC_HHP_ADDRESS`: Contract address
- `NEXT_PUBLIC_CHAIN_ID`: Network ID
- `NEXT_PUBLIC_FORCE_DEV_MODE`: Force development mode

### Network Requirements

- Supports Arbitrum Sepolia (chain ID: 421614)
- Compatible with MetaMask and other Web3 wallets
- Handles both ETH and ERC-20 tokens

## Testing

### Development Mode

- Set `NEXT_PUBLIC_FORCE_DEV_MODE=true` in `.env.local`
- Signature validation is skipped
- Mock data can be used for testing

### Production Mode

- Set `NEXT_PUBLIC_VERIFIER_ADDRESS` to real verifier address
- Full signature validation enabled
- Real token approvals and transfers

## Error Scenarios

### Common Errors

1. **"Reservation is not active"**: Reservation has been cancelled or completed
2. **"Reservation is already fully funded"**: No remaining balance to pay
3. **"Funding amount exceeds remaining balance"**: Trying to pay more than owed
4. **"Insufficient allowance"**: Token approval needed
5. **"Insufficient funds"**: Wallet doesn't have enough tokens/ETH

### Debugging

- Check console logs for detailed transaction information
- Verify wallet has sufficient balance
- Ensure proper network connection
- Check token allowances for ERC-20 payments

## Security Features

- **Reentrancy Protection**: Contract-level protection against reentrancy attacks
- **Amount Validation**: Prevents over-funding and negative amounts
- **Status Checks**: Ensures only active reservations can be funded
- **Token Approvals**: Secure ERC-20 token handling

## Next Steps

1. **Test ETH Payments**: Verify native ETH transfers work correctly
2. **Test ERC-20 Payments**: Test with various token types
3. **UI Integration**: Update booking modal to show payment progress
4. **Error Handling**: Add user-friendly error messages in UI
5. **Payment Tracking**: Implement payment status monitoring
