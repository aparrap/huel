import { test as base, expect } from '@playwright/test';
import  HomePage  from '../pages/HomePage';
import  CollectionsPage  from '../pages/CollectionsPage';
import  ProductPage  from '../pages/ProductPage';
import  CartDrawer  from '../pages/CartDrawer';
import PromoPopUp from '../pages/PromoPopUp';

export type Pages = {
    homePage: ReturnType<typeof HomePage>; 
    collectionsPage: ReturnType<typeof CollectionsPage>;
    productPage: ReturnType<typeof ProductPage>;   
    cartDrawer: ReturnType<typeof CartDrawer>;
    promoPopUp: ReturnType<typeof PromoPopUp>;
};
export const test = base.extend<{
  pages: Pages;
}>({
  page: async ({ page }, use) => {
    // Instantiate the popup object just to access its locators for the handler
    const popup = PromoPopUp(page);
    
    // Add the global listener using your specific close button locator
    // Note: Adjust 'popup.closePopupButton' if you named the locator differently in your PromoPopUp file
    await page.addLocatorHandler(
      popup.elements.closePopupButton, 
      async () => {
        console.log('Intercepted Promo PopUp. Closing it to resume test execution...');
        // Click the close button
        await popup.closePopup();
        
        // Wait for the popup to actually disappear from the DOM before resuming the test
        await expect(popup.elements.closePopupButton).toBeHidden();
      },
      { times: 1 } // Only handle the first occurrence of the popup to avoid unintended interactions later in the test
    );
    await use(page);
},
pages: async ({ page }, use) => {
    await use({
        homePage: HomePage(page),
        collectionsPage: CollectionsPage(page),
        productPage: ProductPage(page),
        cartDrawer: CartDrawer(page),
        promoPopUp: PromoPopUp(page),
    });
  },
});

export { expect } from '@playwright/test';