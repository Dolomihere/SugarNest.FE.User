import { useState, useEffect } from 'react';

export const useDebouncedSearch = (delay, onDebouncedValue) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      onDebouncedValue(inputValue);
    }, delay);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  return {
    inputValue,
    setInputValue,
  };
};
