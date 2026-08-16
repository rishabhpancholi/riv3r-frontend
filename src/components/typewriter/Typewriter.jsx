"use client";

import { useTypewriter, Cursor } from "react-simple-typewriter";

const TAGLINES = [
  "Connect with vetted talent",
  "Hire resources on demand",
  "Find work that moves you",
  "Where work flows seamlessly",
];

export default function Typewriter() {
  const [text] = useTypewriter({
    words: TAGLINES,
    loop: true,
    typeSpeed: 60,
    deleteSpeed: 30,
    delaySpeed: 1800,
  });

  return (
    <span>
      {text}
      <Cursor cursorColor="#71717a" />
    </span>
  );
}