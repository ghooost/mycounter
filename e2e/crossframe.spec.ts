import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test('Counter should work in a frame with another origin', async ({ page }) => {
  const requests: URLSearchParams[] = [];
  let done: any;
  const check = new Promise((resolve) => {
    done = resolve;
  });

  page.route('**/frame.html', (route) => {
    route.fulfill({
      status: 200,
      body: fs.readFileSync(path.resolve(__dirname, './frame.html')),
    });
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
    if (requests.length > 1) {
      done();
    }
    route.fulfill({
      status: 200,
    });
  });
  await page.goto('http://counter.other.domain/frame.html', {
    referer: 'http://counter.other.domain/frame-previous.html',
  });
  await expect(page).toHaveTitle(/Frame test/);
  await check;
  requests.forEach((params) => {
    expect(params.get('labels')).toMatch(/frame|simple/);
    expect(params.get('a')).toBe('p-jsengchallange');
    expect(params.get('r').length).toBe(9);
    expect(params.get('fpa')).toMatch(/P0-\d+-\d+/);
    expect(params.get('fpan')).toMatch(/0|1/);
    expect(params.get('url')).toBe('http://counter.other.domain/frame.html');
    expect(params.get('ref')).toBe(
      'http://counter.other.domain/frame-previous.html',
    );
  });
});
