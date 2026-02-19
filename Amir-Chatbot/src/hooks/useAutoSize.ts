import { useState, useLayoutEffect, useRef, type RefObject } from 'react';

function useAutosize(value:string): RefObject<HTMLTextAreaElement | null> {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [borderWidth, setBorderWidth] = useState<number>(0);

  useLayoutEffect(() => {
    if (ref.current) {
      const style = window.getComputedStyle(ref.current);
      setBorderWidth(
        parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)
      );
    }
  }, []);

    
    

  useLayoutEffect(() => {
    if (ref.current) {
        ref.current.style.height = 'inherit';
    ref.current.style.height = `${ref.current.scrollHeight + borderWidth}px`;
    }
  }, [value, borderWidth]);

  return ref;
}

export default useAutosize;