import { useEffect, useState } from 'react';

export default function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(
    (): (() => void) => {
      const handler = setTimeout(
        (): void => {
          setDebouncedValue(value);
        },
        delay,
      );

      return (): void => {
        clearTimeout(handler);
      };
    },
    [
      delay,
      value,
    ],
  );

  return debouncedValue;
}
