"use client";

import React from "react";

type Props = {
  size?: number; // px (defaults to 224)
  height?: number; // px (defaults to 224)
  color?: string; // Tailwind color class (applies to text/arc), default "text-gray-700"
};

export default function RotationSticker({ size = 40, height=40, color = "text-gray-700" }: Props) {
  // ensure at least a numeric size
  const s = size;
  const h = height;


  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] ${color}`}
      style={{
        width: s,
        height: h,
        // subtle sticker look tilt / perspective
        transform: "perspective(600px) rotateX(2deg)",
      }}
      aria-hidden
    >
     <span className="text-[14px] font-extrabold text-black select-none
             drop-shadow-[6px_6px_8px_rgba(0,0,0,0.5)]
             relative">
  360°
</span>
    </div>
  );
}
