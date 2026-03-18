import { test as base, expect } from '@playwright/test';
import  HomePage  from '../pages/HomePage';
import  CollectionsPage  from '../pages/CollectionsPage';
import  ProductPage  from '../pages/ProductPage';
import  CartDrawer  from '../pages/CartDrawer';

export type Pages = {
    homePage: ReturnType<typeof HomePage>; 
    collectionsPage: ReturnType<typeof CollectionsPage>;
    productPage: ReturnType<typeof ProductPage>;   
    cartDrawer: ReturnType<typeof CartDrawer>;
};
export const test = base.extend<{
  pages: Pages;
}>({
  pages: async ({ page }, use) => {
    await use({
        homePage: HomePage(page),
        collectionsPage: CollectionsPage(page),
        productPage: ProductPage(page),
        cartDrawer: CartDrawer(page),
    });
  },
});

export { expect } from '@playwright/test';