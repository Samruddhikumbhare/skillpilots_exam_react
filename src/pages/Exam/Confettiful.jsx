// start on 13 March 2025 by medha

import React, { useEffect, useRef } from "react";

const Confettiful = ({ containerClass = "confetti-container" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const confettiColors = ["#EF2964", "#00C09D", "#2D87B0", "#48485E", "#EFFF1D"];
    const confettiAnimations = ["slow", "medium", "fast"];

    const createConfetti = () => {
      const confettiEl = document.createElement("div");
      const confettiSize = `${Math.floor(Math.random() * 3) + 7}px`;
      const confettiBackground = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      const confettiLeft = `${Math.floor(Math.random() * container.offsetWidth)}px`;
      const confettiAnimation = confettiAnimations[Math.floor(Math.random() * confettiAnimations.length)];

      confettiEl.classList.add("confetti", `confetti--animation-${confettiAnimation}`);
      confettiEl.style.left = confettiLeft;
      confettiEl.style.width = confettiSize;
      confettiEl.style.height = confettiSize;
      confettiEl.style.backgroundColor = confettiBackground;

      container.appendChild(confettiEl);

      setTimeout(() => {
        confettiEl.remove();
      }, 3000);
    };

    const confettiInterval = setInterval(createConfetti, 25);

    return () => clearInterval(confettiInterval);
  }, []);

  return <div ref={containerRef} className={containerClass}></div>;
};

export default Confettiful;
