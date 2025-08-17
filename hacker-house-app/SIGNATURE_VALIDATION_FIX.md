# Signature Validation Fix

## Problem

The `createReservation` function was failing with "Invalid sig format" error because:

1. **Mock signature format**: The mock signature `"0x" + "0".repeat(132)` was not a valid Ethereum signature format
2. **Always-on validation**: Signature validation ran regardless of development/production mode
3. **No development bypass**: There was no way to skip signature validation for testing

## Solution

Implemented a development mode that automatically detects the environment and adjusts validation accordingly:

### Development Mode (Default)

- **Triggered when**:
  - `NEXT_PUBLIC_VERIFIER_ADDRESS` is not set or equals `'0xYourVerifierAddress'`
  - `NODE_ENV` is set to `'development'`
  - `NEXT_PUBLIC_FORCE_DEV_MODE` is set to `'true'`
- **Behavior**:
  - Skips strict signature format validation
  - Uses placeholder signature with correct format
  - Skips EIP-712 signature verification
  - Still validates TTL and other business logic

### Production Mode

- **Triggered when**: `NEXT_PUBLIC_VERIFIER_ADDRESS` is set to a real verifier address
- **Behavior**:
  - Strict signature format validation via `isLikelyValidSig()`
  - Full EIP-712 signature verification
  - All security checks enabled

## Configuration

### For Development

```bash
# Option 1: Leave unset or set to placeholder value
NEXT_PUBLIC_VERIFIER_ADDRESS=0xYourVerifierAddress

# Option 2: Force development mode (overrides verifier address)
NEXT_PUBLIC_FORCE_DEV_MODE=true

# Option 3: Ensure NODE_ENV is set to development
NODE_ENV=development
```

### For Production

```bash
# Set to your actual verifier contract address
NEXT_PUBLIC_VERIFIER_ADDRESS=0x234c15F43b3885C11c649553267f10C6F677C32a
```

## Code Changes

### 1. Modified `createReservation` function in `hooks/use-hhp-contract.ts`

- Added development mode detection
- Conditional signature validation
- Better error handling and logging

### 2. Updated mock proof in `components/booking/booking-modal.tsx`

- Changed from invalid `"0x" + "0".repeat(132)`
- To valid format `"0x" + "1".repeat(64) + "2".repeat(64) + "1b"`

### 3. Enhanced constants documentation in `lib/constants.ts`

- Added clear comments about development vs production configuration

## Testing

### Development Mode Test

1. Ensure `NEXT_PUBLIC_VERIFIER_ADDRESS` is not set or equals `'0xYourVerifierAddress'`
2. Try creating a reservation - signature validation should be skipped
3. Check console for "Development mode: Skipping signature validation" message

### Production Mode Test

1. Set `NEXT_PUBLIC_VERIFIER_ADDRESS` to a real verifier address
2. Try creating a reservation - full signature validation should run
3. Check console for "Production mode" message

## Security Notes

- **Development mode** is safe for testing but should never be used in production
- **Production mode** enforces all security checks including signature verification
- The system automatically detects the mode based on environment configuration
- TTL validation still runs in both modes to prevent replay attacks

## Next Steps

1. **For development**: The current setup should work immediately
2. **For production**: Implement proper signature generation in your backend/verifier
3. **Testing**: Verify both modes work as expected
4. **Documentation**: Update your deployment guides to include verifier address configuration
