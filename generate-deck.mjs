#!/usr/bin/env node
/**
 * generate-deck.mjs
 * Converts a rendered HTML deck to a PDF using Puppeteer.
 *
 * Usage:
 *   node generate-deck.mjs <input.html> <output.pdf>
 *
 * Example:
 *   node generate-deck.mjs output/booking-com-2025-01-15-deck.html output/booking-com-2025-01-15-deck.pdf
 */

import puppeteer from 'puppeteer';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Args ---
const [,, inputArg, outputArg] = process.argv;

if (!inputArg || !outputArg) {
  console.error('Usage: node generate-deck.mjs <input.html> <output.pdf>');
  process.exit(1);
}

const inputPath  = resolve(process.cwd(), inputArg);
const outputPath = resolve(process.cwd(), outputArg);

if (!existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

// --- Generate ---
(async () => {
  console.log(`Generating PDF from: ${inputPath}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Load the HTML file directly (file:// protocol so relative assets work)
    await page.goto(`file://${inputPath}`, { waitUntil: 'networkidle0' });

    // Wait for Google Fonts to load if present
    await new Promise(r => setTimeout(r, 1500));

    // Each slide is 1280×720px. PDF page size matches exactly.
    await page.pdf({
      path: outputPath,
      width:  '1280px',
      height: '720px',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    console.log(`PDF saved: ${outputPath}`);
  } finally {
    await browser.close();
  }
})();
