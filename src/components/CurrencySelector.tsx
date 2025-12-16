import React from 'react';
import './CurrencySelector.css';
import { SUPPORTED_CURRENCIES } from '../utils/currency';

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
  className?: string;
  disabled?: boolean;
}

export function CurrencySelector({
  value,
  onChange,
  className = '',
  disabled = false
}: CurrencySelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`currency-selector ${className}`}
      disabled={disabled}
    >
      {SUPPORTED_CURRENCIES.map((currency) => (
        <option key={currency.code} value={currency.code}>
          {currency.symbol} - {currency.name} ({currency.code})
        </option>
      ))}
    </select>
  );
}