import { test, expect } from '../fixtures/AppFixtures';

test.describe('E2E: Huel Powder Purchase Flow', () => {

    test('User navigates from Home, selects Berry Powder, and validates Cart', async ({ 
        pages
    }) => {
        
        const PRODUCT_TYPE = 'Powder';
        const FLAVOR = 'Berry';

        // Step 1: Land on Home and handle consent
        await test.step('Navigate to Homepage and Accept Cookies', async () => {
            await pages.homePage.navigateToHome();
            await pages.homePage.acceptCookies();
        });

        // Step 2: Navigate to Collections via top menu
        await test.step('Navigate to Powdered Meals Collection', async () => {
            await pages.homePage.navigateToPowderedMealsViaMenu();
        });

        // Step 3: Select the specific product card from the collection
        await test.step(`Select ${PRODUCT_TYPE} from the collection grid`, async () => {
            await pages.collectionsPage.selectProduct(PRODUCT_TYPE);
        });

        // Step 4: Configure the product (Flavor + Plan)
        await test.step(`Select ${FLAVOR} flavor and One-Time purchase`, async () => {
            await pages.productPage.addFlavorQuantity(FLAVOR);
            await pages.productPage.selectOneTimePurchase();
        });

        // Step 5: Add to basket and handle popup
        await test.step('Add to basket and proceed via popup', async () => {
            await pages.productPage.addToBasket();
            await pages.productPage.proceedToBasketFromPopup();
        });

        // Step 6: Validate the side cart drawer
        await test.step('Validate Cart Drawer contents and checkout availability', async () => {
            await pages.cartDrawer.waitForDrawerToOpen();
            
            // Assert Product Type and Flavor match
            await pages.cartDrawer.validateCartItem(PRODUCT_TYPE, FLAVOR);
            
            // Assert Checkout button exists per requirements
            await pages.cartDrawer.validateCheckoutIsReady();
        });
    });
});