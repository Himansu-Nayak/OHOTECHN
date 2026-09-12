'use client';

import React from 'react';

interface FlippingTextProps {
  text: string;
  className?: string;
}

/**
 * FlippingText
 * 
 * Recreates the iconic Bearplus / unitedcarriers.com hover text roll.
 * On hover, the word slides up, revealing its clone from underneath with
 * high-precision cubic-bezier easing.
 */
export function FlippingText({ text, className = '' }: FlippingTextProps) {
  return (
    <span data-flipping-text className={`inline-block select-none ${className}`}>
      <span>{text}</span>
    </span>
  );
}

export default FlippingText;
