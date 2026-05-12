#!/usr/bin/env node
// Smoke test: POST to a running /api/generate and print a slice of the result.
//
//   node test-local.js                       → tests brex.com, mercury.com, petco.com
//   node test-local.js brex.com              → tests just brex.com
//   PROXY=https://your-deploy.vercel.app node test-local.js brex.com
//
// Default PROXY is http://localhost:3000 (where `vercel dev` listens).

const PROXY = process.env.PROXY || 'http://localhost:3000';

const FIXTURES = {
  'brex.com': {
    title: 'Brex | The financial stack for growing businesses',
    description: 'Brex is the modern financial stack — corporate cards, expense management, bill pay, and travel, all in one platform.',
    navLabels: ['Products', 'Solutions', 'Resources', 'Pricing', 'Customers'],
    category: 'finance',
    brandColors: ['#ff5a1f', '#1a1a1a'],
  },
  'mercury.com': {
    title: 'Mercury — Banking built for ambitious companies',
    description: 'Mercury offers business checking and savings, payments, and corporate cards designed for startups.',
    navLabels: ['Banking', 'Credit Cards', 'Capital', 'Resources', 'Pricing'],
    category: 'finance',
    brandColors: ['#5b3df5', '#ffffff'],
  },
  'petco.com': {
    title: 'Petco | Pet Supplies, Pet Food, and Pet Products',
    description: 'Shop pet supplies, food, treats, toys, and more at Petco. Plus, in-store services for dogs, cats, and other pets.',
    navLabels: ['Dog', 'Cat', 'Fish', 'Reptile', 'Bird', 'Small Pet', 'Pharmacy', 'Services'],
    category: 'retail',
    brandColors: ['#005192', '#ffe600'],
  },
};

async function callProxy(domain) {
  const fixture = FIXTURES[domain];
  if (!fixture) {
    console.error(`No fixture for ${domain}. Edit test-local.js to add one, or pick from: ${Object.keys(FIXTURES).join(', ')}`);
    process.exitCode = 1;
    return;
  }
  const body = { domain, ...fixture };
  const t0 = Date.now();
  let res, json;
  try {
    res = await fetch(`${PROXY}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': 'http://localhost:8085' },
      body: JSON.stringify(body),
    });
    json = await res.json();
  } catch (e) {
    console.error(`[${domain}] network error:`, e.message);
    return;
  }
  const ms = Date.now() - t0;
  if (!res.ok) {
    console.error(`[${domain}] ${res.status} in ${ms}ms:`, JSON.stringify(json).slice(0, 300));
    return;
  }
  const len = (json.html || '').length;
  console.log(`[${domain}] ok in ${ms}ms · cached=${json.cached} · model=${json.model} · ${len} chars`);
  console.log('  preview:', (json.html || '').replace(/\s+/g, ' ').slice(0, 220), '...');
  console.log('');
}

(async () => {
  const args = process.argv.slice(2);
  const domains = args.length ? args : Object.keys(FIXTURES);
  console.log(`Testing proxy at ${PROXY}\n`);
  for (const d of domains) {
    await callProxy(d);
  }
})();
