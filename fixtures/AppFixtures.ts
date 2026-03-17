import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartDrawer } from '../pages/CartDrawer';

type AppFixtures = {
    homePage: HomePage;
    productPage: ProductPage;
    cartDrawer: CartDrawer;
};

export const test = base.extend<AppFixtures>({
    // Global setup for every page instance
    page: async ({ page }, use) => {
        // Automatically handle the OneTrust/Cookie consent banner if it appears
        await page.addLocatorHandler(
            page.locator('#onetrust-banner-sdk'),
            async () => {
                console.log('Intercepted Cookie Banner. Accepting...');
                await page.locator('#onetrust-accept-btn-handler').click();
            }
        );

        // Automatically handle promotional newsletter popups
        await page.addLocatorHandler(
            page.locator('[data-testid="newsletter-popup"]'), // Mock selector
            async () => {
                console.log('Intercepted Newsletter popup. Closing...');
                await page.getByLabel('Close dialog').click();
            }
        );

        await use(page);
    },

    // Instantiate Page Objects via Fixtures
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    cartDrawer: async ({ page }, use) => {
        await use(new CartDrawer(page));
    }
});

export { expect } from '@playwright/test';