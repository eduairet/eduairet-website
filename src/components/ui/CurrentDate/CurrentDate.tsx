'use client';

export default function CurrentDate() {
  return <time>{new Date().getFullYear()}</time>;
}
