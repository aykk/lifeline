"use client";

import { useEffect, useRef } from "react";

const waves = [
  { amp: 10, freq: 0.008,  freq2: 0.003, speed: 0.004, alpha: 0.12, bottom: 72 },
  { amp: 14, freq: 0.011,  freq2: 0.005, speed: 0.007, alpha: 0.22, bottom: 52 },
  { amp: 18, freq: 0.014,  freq2: 0.006, speed: 0.010, alpha: 0.32, bottom: 28 },
];

export default function Waveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ts = waves.map(() => 0);

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      waves.forEach((wave, i) => {
        const midY = h - wave.bottom;

        ctx.beginPath();
        ctx.strokeStyle = "#a1a1aa";
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = wave.alpha;

        for (let x = 0; x <= w; x++) {
          const y = midY
            + Math.sin(x * wave.freq + ts[i]) * wave.amp
            + Math.sin(x * wave.freq2 + ts[i] * 0.6) * (wave.amp * 0.35);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }

        ctx.stroke();
        ts[i] += wave.speed;
      });

      frameRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute bottom-0 left-0 right-0 w-full h-40 pointer-events-none"
    />
  );
}
