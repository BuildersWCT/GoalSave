import React, { useState, useEffect } from 'react';
import './CurrencyDisplay.css';
import { formatCurrency, convertCurrency, getExchangeRates } from '../utils/currency';
import { CurrencySelector } from './CurrencySelector';

interface CurrencyDisplayProps {
  amount: number;
  originalCurrency: string;
  className?: string;
}

export function CurrencyDisplay({ amount, originalCurrency, className = '' }: CurrencyDisplayProps) {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performConversion = async () => {
      if (selectedCurrency === originalCurrency) {
        setConvertedAmount(amount);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const rates = await getExchangeRates();
        const converted = await convertCurrency(amount, originalCurrency, selectedCurrency, rates);
        setConvertedAmount(converted);
      } catch {
        setError('Failed to convert currency');
        setConvertedAmount(null);
      } finally {
        setIsLoading(false);
      }
    };

    performConversion();
  }, [amount, originalCurrency, selectedCurrency]);

  return (
    <div className={`currency-display ${className}`}>
      <div className="currency-conversion">
        <span className="original-amount">
          {formatCurrency(amount, originalCurrency)}
        </span>
        <span className="conversion-arrow">→</span>
        <div className="converted-section">
          <CurrencySelector
            value={selectedCurrency}
            onChange={setSelectedCurrency}
            className="currency-selector-inline"
          />
          <span className="converted-amount">
            {isLoading ? (
              <span className="loading">Converting...</span>
            ) : error ? (
              <span className="error">{error}</span>
            ) : convertedAmount !== null ? (
              formatCurrency(convertedAmount, selectedCurrency)
            ) : (
              'N/A'
            )}
          </span>
        </div>
      </div>
    </div>
  );
}