# Currency Conversion Feature

This document describes the currency conversion functionality added to the GoalSave application.

## Overview

The currency conversion feature allows users to view their goal amounts in multiple currencies for better reference and understanding. This is particularly useful for users who want to track their savings goals in their local currency or in commonly used currencies like USD, EUR, etc.

## Features

### 1. Exchange Rate API Integration
- Uses the free exchangerate-api.com API for real-time exchange rates
- Falls back to static rates if the API is unavailable
- Caches exchange rates locally to improve performance and reduce API calls

### 2. Currency Selector
- Dropdown component for selecting target currency
- Supports 10 major currencies: USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, CELO
- Each currency shows symbol, name, and code

### 3. Currency Display
- Shows original amount alongside converted amount
- Real-time conversion with loading states
- Error handling for API failures
- Responsive design for mobile devices

### 4. Exchange Rate Caching
- Stores rates in localStorage for 1 hour
- Reduces API calls and improves performance
- Validates cache freshness before using cached data

## Implementation

### Core Components

#### `src/utils/currency.ts`
Main utility file containing:
- `getExchangeRates()` - Fetches and caches exchange rates
- `convertCurrency()` - Converts between currencies
- `formatCurrency()` - Formats currency amounts with proper symbols
- `SUPPORTED_CURRENCIES` - List of supported currencies

#### `src/components/CurrencySelector.tsx`
Dropdown component for selecting target currency.

#### `src/components/CurrencyDisplay.tsx`
Main display component that shows currency conversions.

#### `src/GoalList.tsx`
Updated to include currency conversion display for each goal.

### CSS Styles
- `src/components/CurrencySelector.css` - Styling for currency selector
- `src/components/CurrencyDisplay.css` - Styling for currency display

### Tests
- `src/utils/__tests__/currency.test.ts` - Comprehensive test suite

## Supported Currencies

| Code | Name | Symbol | Notes |
|------|------|--------|-------|
| USD | US Dollar | $ | Base currency |
| EUR | Euro | € | |
| GBP | British Pound | £ | |
| JPY | Japanese Yen | ¥ | No decimals |
| CAD | Canadian Dollar | C$ | Symbol after amount |
| AUD | Australian Dollar | A$ | Symbol after amount |
| CHF | Swiss Franc | CHF | |
| CNY | Chinese Yuan | ¥ | |
| INR | Indian Rupee | ₹ | |
| CELO | Celo | CELO | Approximate rate |

## API Usage

The feature uses the exchangerate-api.com free tier:
- Endpoint: `https://api.exchangerate-api.com/v4/latest/USD`
- No API key required for free tier
- Rate limit: ~1000 requests per month
- Fallback to static rates if API unavailable

## Cache Strategy

- **Duration**: 1 hour (configurable via `CACHE_DURATION`)
- **Storage**: localStorage
- **Key**: `goalsave_exchange_rates`
- **Structure**: `{ rates: {...}, timestamp: number, base: string }`

## Error Handling

1. **API Failures**: Falls back to static exchange rates
2. **Network Issues**: Uses cached rates if available, even if expired
3. **Unsupported Currencies**: Returns original amount unchanged
4. **Invalid Rates**: Graceful degradation with fallback values

## Performance Considerations

- Lazy loading of exchange rates
- Efficient caching to minimize API calls
- Responsive UI updates with loading states
- Error boundaries for graceful failures

## Security

- No sensitive data stored in localStorage
- API calls use HTTPS
- Input validation for currency codes
- Error sanitization to prevent XSS

## Future Enhancements

- Add more currencies
- Historical exchange rate charts
- Manual rate refresh option
- Offline mode with cached rates
- Custom base currency selection
- Push notifications for rate changes

## Testing

Run tests with:
```bash
npm test src/utils/__tests__/currency.test.ts
```

Tests cover:
- Currency conversion logic
- Formatting functions
- Currency support validation
- Error handling scenarios
- Cache functionality

## Browser Compatibility

- Modern browsers with localStorage support
- ES2020+ features used
- Responsive design for mobile devices