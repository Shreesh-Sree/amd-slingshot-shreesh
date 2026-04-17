import { test, expect } from '@playwright/test';

test.describe('Zero Trust Secure Shopping Flow', () => {
  // Hackathon Rapid Smoke Test
  test('unauthorized users are bounced from checkout enclosure', async ({ page }) => {
    await page.goto('/shop/checkout');
    // Without a secure __session cookie, the Zero Trust Next.js middleware routes 
    // them to the edge fallback login screen.
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('discover page strictly labels local sustainable inventory', async ({ page }) => {
    await page.goto('/shop/discover');
    
    // Validate semantic product matches are dynamically mapped
    const productTitle = page.locator('text=Curated for the Mountain.');
    await expect(productTitle).toBeVisible();

    // Verify Framer Motion/Glassmorphic cards rendered
    const cards = page.locator('article');
    await expect(cards).not.toHaveCount(0);

    // Verify the Haversine geo-radius math successfully attached the green badge
    const localFirstSticker = page.locator('text=Local In-Stock');
    await expect(localFirstSticker).toBeVisible();
  });
});
