import {
  convertCurrency,
  formatCurrency,
  getCurrencyDisplayName,
  isCurrencySupported,
  SUPPORTED_CURRENCIES
} from '../currency';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock as unknown as Storage;

// Mock fetch
global.fetch = jest.fn();

describe('Currency Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  describe('convertCurrency', () => {
    it('should return same amount when converting from and to same currency', async () => {
      const result = await convertCurrency(100, 'USD', 'USD');
      expect(result).toBe(100);
    });

    it('should convert USD to EUR using provided rates', async () => {
      const mockRates = {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
      };

      const result = await convertCurrency(100, 'USD', 'EUR', mockRates);
      expect(result).toBeCloseTo(85, 2);
    });

    it('should convert EUR to USD using provided rates', async () => {
      const mockRates = {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
      };

      const result = await convertCurrency(85, 'EUR', 'USD', mockRates);
      expect(result).toBeCloseTo(100, 2);
    });

    it('should handle unsupported currencies gracefully', async () => {
      const mockRates = {
        USD: 1,
        EUR: 0.85,
      };

      const result = await convertCurrency(100, 'USD', 'INVALID', mockRates);
      expect(result).toBe(100); // Should return original amount
    });
  });

  describe('formatCurrency', () => {
    it('should format USD currency correctly', () => {
      const result = formatCurrency(1234.56, 'USD');
      expect(result).toBe('$1,234.56');
    });

    it('should format EUR currency correctly', () => {
      const result = formatCurrency(1234.56, 'EUR');
      expect(result).toBe('€1,234.56');
    });

    it('should format JPY without decimals', () => {
      const result = formatCurrency(1234, 'JPY');
      expect(result).toBe('¥1,234');
    });

    it('should format CAD with symbol after amount', () => {
      const result = formatCurrency(1234.56, 'CAD');
      expect(result).toBe('1,234.56 C$');
    });

    it('should format AUD with symbol after amount', () => {
      const result = formatCurrency(1234.56, 'AUD');
      expect(result).toBe('1,234.56 A$');
    });
  });

  describe('getCurrencyDisplayName', () => {
    it('should return display name for USD', () => {
      const result = getCurrencyDisplayName('USD');
      expect(result).toBe('US Dollar');
    });

    it('should return currency code for unsupported currency', () => {
      const result = getCurrencyDisplayName('INVALID');
      expect(result).toBe('INVALID');
    });
  });

  describe('isCurrencySupported', () => {
    it('should return true for supported currencies', () => {
      expect(isCurrencySupported('USD')).toBe(true);
      expect(isCurrencySupported('EUR')).toBe(true);
      expect(isCurrencySupported('GBP')).toBe(true);
    });

    it('should return false for unsupported currencies', () => {
      expect(isCurrencySupported('INVALID')).toBe(false);
      expect(isCurrencySupported('BTC')).toBe(false);
    });
  });

  describe('SUPPORTED_CURRENCIES', () => {
    it('should contain expected currencies', () => {
      const codes = SUPPORTED_CURRENCIES.map(c => c.code);
      expect(codes).toContain('USD');
      expect(codes).toContain('EUR');
      expect(codes).toContain('GBP');
      expect(codes).toContain('CELO');
    });

    it('should have name and symbol for all currencies', () => {
      SUPPORTED_CURRENCIES.forEach((currency) => {
        expect(currency.code).toBeDefined();
        expect(currency.name).toBeDefined();
        expect(currency.symbol).toBeDefined();
      });
    });
  });
});