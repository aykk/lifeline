"use client";

import dynamic from "next/dynamic";

const Threads = dynamic(() => import("./threads"), { ssr: false });

export default function ThreadsBg() {
  return (
    <div className="absolute inset-0 pointer-events-none translate-y-64">
      <Threads
        amplitude={1.2}
        distance={0.3}
        enableMouseInteraction={false}
        color={[0.45, 0.45, 0.45]}
      />
    </div>
  );
}
