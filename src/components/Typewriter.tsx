import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number; // custom speed in ms per character
  className?: string;
  doneClassName?: string;
  style?: React.CSSProperties;
  doneStyle?: React.CSSProperties;
  as?: 'h1' | 'p' | 'span';
}

export default function Typewriter({ 
  text, 
  delay = 0, 
  speed = 125, // slower, elegant, cinematic speed defaulted to 125ms per character
  className = "", 
  doneClassName = "", 
  style = {}, 
  doneStyle = {}, 
  as = 'span' 
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    setDisplayText("");
    setIsDone(false);
    
    const startTimeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setIsDone(true);
        }
      }, speed); // perfect slower narrative typing speed
      
      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(startTimeout);
  }, [text, delay]);

  const Component = as;

  return (
    <Component 
      className={`${className} transition-all duration-[1200ms] ${isDone ? doneClassName : ''}`}
      style={{
        ...style,
        ...(isDone ? doneStyle : {})
      }}
    >
      {displayText}
      {!isDone && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-1.5 h-[1em] bg-primary-brown ml-1.5 align-middle rounded-full shadow-[0_0_8px_rgba(212,143,56,0.8)]"
        />
      )}
    </Component>
  );
}
