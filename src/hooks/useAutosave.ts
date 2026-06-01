import { useState, useCallback, useRef, useEffect } from 'react';

export function useAutosave<T>(
  data: T,
  saveFunction: (data: T) => Promise<void>,
  delay: number = 1000
) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<string>('');

  const save = useCallback(async (dataToSave: T) => {
    const dataString = JSON.stringify(dataToSave);
    if (dataString === previousDataRef.current) return;

    setIsSaving(true);
    try {
      await saveFunction(dataToSave);
      setLastSaved(new Date());
      previousDataRef.current = dataString;
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  }, [saveFunction]);

  useEffect(() => {
    const dataString = JSON.stringify(data);
    if (dataString === previousDataRef.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      save(data);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, save]);

  return { isSaving, lastSaved };
}
