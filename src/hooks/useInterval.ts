import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<null | (() => void)>(null);
  // 마지막 콜백함수 저장
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  //  반복함수
  useEffect(() => {
    function tick(): void {
      if (savedCallback.current) savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      };
    }
  }, [delay]);
}