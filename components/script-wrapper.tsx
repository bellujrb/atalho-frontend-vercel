"use client"

import Script from 'next/script';

export function ScriptWrapper() {
  return (
    <Script
      src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
      strategy="beforeInteractive"
    />
  );
}
