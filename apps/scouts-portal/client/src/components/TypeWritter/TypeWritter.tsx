"use client"
import { useEffect, useState } from "react";

interface TypewriterProps {
  text: string;
  speed?: number; // Speed of typing in milliseconds (optional, defaults to 100)
}

export default function Typewriter({ text, speed = 100 }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (!isDeleting && index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      } else if (isDeleting && index > 0) {
        setDisplayedText((prev) => prev.slice(0, -1));
        setIndex((prev) => prev - 1);
      } else if (index === text.length && !isDeleting) {
        setTimeout(() => setIsDeleting(true), 1000); // Pause before deleting
      } else if (isDeleting && index === 0) {
        setIsDeleting(false);
      }
    }, speed);

    return () => clearInterval(typingInterval);
  }, [index, isDeleting, text, speed]);

  return (
    <div className="typewriter flex h-4">
      <i className="text-5xl font-poppins font-semibold">{displayedText}</i>
    </div>
  );
}
