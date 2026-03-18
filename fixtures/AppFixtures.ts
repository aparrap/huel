import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CollectionsPage } from '../pages/CollectionsPage';
import { ProductPage } from '../pages/ProductPage';
import { CartDrawer } from '../pages/CartDrawer';

type AppFixtures = {
    homePage: HomePage;
    collectionsPage: CollectionsPage;
    productPage: ProductPage;
    cartDrawer: CartDrawer;
};

export const test = base.extend<AppFixtures>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    collectionsPage: async ({ page }, use) => {
        await use(new CollectionsPage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    cartDrawer: async ({ page }, use) => {
        await use(new CartDrawer(page));
    }
});

export { expect } from '@playwright/test';