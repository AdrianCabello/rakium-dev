import { expect, test } from '@playwright/test';

const apiUrl = process.env.E2E_API_URL ?? 'http://localhost:3000/api';
const adminEmail = process.env.E2E_ADMIN_EMAIL ?? 'admin@rakium.com';
const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? 'admin123';

test.beforeAll(async ({ request }) => {
  const docsResponse = await request.get(apiUrl);
  expect(docsResponse.ok()).toBeTruthy();

  const loginResponse = await request.post(`${apiUrl}/auth/login`, {
    data: {
      email: adminEmail,
      password: adminPassword,
    },
  });
  expect(loginResponse.ok()).toBeTruthy();
});

test('public home loads against the backend without app errors', async ({ page }) => {
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];
  const failedApiResponses: string[] = [];

  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  page.on('requestfailed', (request) => {
    const url = request.url();
    if (url.startsWith(apiUrl)) {
      failedRequests.push(url);
    }
  });
  page.on('response', (response) => {
    const url = response.url();
    if (url.startsWith(apiUrl) && response.status() >= 400) {
      failedApiResponses.push(`${response.status()} ${url}`);
    }
  });

  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Transformamos tu visi/i })).toBeVisible();
  await expect(page.getByRole('navigation')).toContainText('Portafolio');
  await expect(page.locator('#projects')).toBeVisible();
  await expect(page.getByText('Proyecto Ejemplo')).toBeVisible();

  expect(pageErrors).toEqual([]);
  expect(failedRequests).toEqual([]);
  expect(failedApiResponses).toEqual([]);
});

test('admin can log in and reach the projects dashboard', async ({ page }) => {
  await page.goto('/login');

  await page.getByPlaceholder('admin@rakium.com').fill(adminEmail);
  await page.locator('input[type="password"]').fill(adminPassword);
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByText(/Gestiona tus proyectos/i)).toBeVisible();
  await expect(page.getByText('Proyecto Ejemplo')).toBeVisible();
});
