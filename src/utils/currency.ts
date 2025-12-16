// Currency conversion utilities with API integration and caching

export interface ExchangeRates {
  [currency: string]: number;
}

export interface CachedRates {
  rates: ExchangeRates;
  timestamp: number;
  base: string;
}

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const CACHE_KEY = 'goalsave_exchange_rates';

// Popular currencies to support
export const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CELO', name: 'Celo', symbol: 'CELO' },
];

const DEFAULT_BASE = 'USD';

/**
 * Fetch exchange rates from a free API
 * Using exchangerate-api.com which provides free tier
 */
async function fetchExchangeRates(baseCurrency: string = DEFAULT_BASE): Promise<ExchangeRates> {
  try {
    // Using exchangerate-api.com free tier
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    
    // Fallback to a static rates object if API fails
    return {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110,
      CAD: 1.25,
      AUD: 1.35,
      CHF: 0.92,
      CNY: 6.45,
      INR: 74.5,
      CELO: 1.2, // Approximate CELO to USD rate
    };
  }
}

/**
 * Get cached exchange rates or fetch new ones
 */
export async function getExchangeRates(baseCurrency: string = DEFAULT_BASE): Promise<ExchangeRates> {
  try {
    const cached = getCachedRates();
    
    if (cached && isCacheValid(cached) && cached.base === baseCurrency) {
      return cached.rates;
    }
    
    const rates = await fetchExchangeRates(baseCurrency);
    cacheRates(rates, baseCurrency);
    return rates;
  } catch (error) {
    console.error('Error getting exchange rates:', error);
    // Return cached rates if available, even if expired
    const cached = getCachedRates();
    if (cached) {
      return cached.rates;
    }
    // Return fallback rates
    return {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110,
      CAD: 1.25,
      AUD: 1.35,
      CHF: 0.92,
      CNY: 6.45,
      INR: 74.5,
      CELO: 1.2,
    };
  }
}

/**
 * Cache exchange rates with timestamp
 */
function cacheRates(rates: ExchangeRates, base: string): void {
  const cacheData: CachedRates = {
    rates,
    timestamp: Date.now(),
    base,
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
}

/**
 * Get cached rates from localStorage
 */
function getCachedRates(): CachedRates | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    return JSON.parse(cached);
  } catch (error) {
    console.error('Error reading cached rates:', error);
    return null;
  }
}

/**
 * Check if cached rates are still valid
 */
function isCacheValid(cached: CachedRates): boolean {
  return Date.now() - cached.timestamp < CACHE_DURATION;
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates?: ExchangeRates
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  const exchangeRates = rates || await getExchangeRates();
  
  // If converting from the base currency
  if (fromCurrency === DEFAULT_BASE) {
    const rate = exchangeRates[toCurrency];
    return rate ? amount * rate : amount;
  }
  
  // If converting to the base currency
  if (toCurrency === DEFAULT_BASE) {
    const rate = exchangeRates[fromCurrency];
    return rate ? amount / rate : amount;
  }
  
  // Converting between two non-base currencies
  const fromRate = exchangeRates[fromCurrency];
  const toRate = exchangeRates[toCurrency];
  
  if (!fromRate || !toRate) {
    console.warn(`Exchange rates not available for ${fromCurrency} or ${toCurrency}`);
    return amount;
  }
  
  // Convert to base currency first, then to target currency
  const amountInBase = amount / fromRate;
  return amountInBase * toRate;
}

/**
 * Format currency amount with proper symbol and formatting
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
  const symbol = currency?.symbol || currencyCode;
  
  // Format number with appropriate decimal places
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
    maximumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
  }).format(amount);
  
  // For currencies where symbol comes after (like CAD, AUD)
  const afterSymbol = ['CAD', 'AUD'];
  
  if (afterSymbol.includes(currencyCode)) {
    return `${formattedAmount} ${symbol}`;
  }
  
  return `${symbol}${formattedAmount}`;
}

/**
 * Get currency display name
 */
export function getCurrencyDisplayName(currencyCode: string): string {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
  return currency?.name || currencyCode;
}

/**
 * Check if currency is supported
 */
export function isCurrencySupported(currencyCode: string): boolean {
  return SUPPORTED_CURRENCIES.some(c => c.code === currencyCode);
}

/**
 * Clear cached exchange rates (useful for testing or force refresh)
 */
export function clearExchangeRateCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error('Error clearing exchange rate cache:', error);
  }
}

/**
 * Get cache status information
 */
export function getCacheStatus(): { hasCache: boolean; isValid: boolean; age: number } {
  const cached = getCachedRates();
  if (!cached) {
    return { hasCache: false, isValid: false, age: 0 };
  }
  
  const age = Date.now() - cached.timestamp;
  return {
    hasCache: true,
    isValid: isCacheValid(cached),
    age
  };
}