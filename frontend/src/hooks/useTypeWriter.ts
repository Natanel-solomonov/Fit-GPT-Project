import { useEffect, useState } from 'react';

const useTypewriter = (text: string, speed: number = 50) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeoutId);
    }
  }, [index, text, speed]);

  useEffect(() => {
    setDisplayedText('');
    setIndex(0);
  }, [text]);

  return displayedText;
};

export default useTypewriter;