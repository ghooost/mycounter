import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test('Counter should work at a page', async ({ page }) => {
  const requests: URLSearchParams[] = [];
  let done: any;
  const check = new Promise((resolve) => {
    done = resolve;
  });
  page.route('**/simple.html', (route) => {
    route.fulfill({
      status: 200,
      body: fs.readFileSync(path.resolve(__dirname, './simple.html')),
    });
  });
  page.route('**/measurement.js', (route) => {
    route.fulfill({
      status: 200,
      body: fs.readFileSync(path.resolve(__dirname, '../build/measurement.js')),
    });
  });
  page.route('**/pixel?**', async (route, request) => {
    const url = new URL(request.url());
    const params = new URLSearchParams(url.search);
    requests.push(params);
    done();
    route.fulfill({
      status: 200,
    });
  });
  await page.goto('http://counter.info/simple.html', {
    referer: 'http://counter.info/simple-previous.html',
  });
  await expect(page).toHaveTitle(/Simple test/);
  await check;
  requests.forEach((params) => {
    expect(params.get('labels')).toMatch(/simple/);
    expect(params.get('a')).toBe('p-jsengchallange');
    expect(params.get('r').length).toBe(9);
    expect(params.get('fpa')).toMatch(/P0-\d+-\d+/);
    expect(params.get('fpan')).toMatch(/0/);
    expect(params.get('url')).toBe('http://counter.info/simple.html');
    expect(params.get('ref')).toBe('http://counter.info/simple-previous.html');
  });
});
