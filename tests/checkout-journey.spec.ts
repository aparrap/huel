import { test, expect } from '../fixtures/AppFixtures';

test.describe('E2E: Huel Powder Purchase Flow', () => {

    test('User navigates from Home, selects Berry Powder, and validates Cart', async ({ 
        homePage, 
        collectionsPage, 
        productPage, 
        cartDrawer 
    }) => {
        
        const PRODUCT_TYPE = 'Powder';
        const FLAVOR = 'Berry';

        // Step 1: Land on Home and handle consent
        await test.step('Navigate to Homepage and Accept Cookies', async () => {
            await homePage.navigateToHome();
            await homePage.acceptCookies();
        });

        // Step 2: Navigate to Collections via top menu
        await test.step('Navigate to Powdered Meals Collection', async () => {
            await homePage.navigateToPowderedMeals();
        });

        // Step 3: Select the specific product card from the collection
        await test.step(`Select ${PRODUCT_TYPE} from the collection grid`, async () => {
            await collectionsPage.selectProduct(PRODUCT_TYPE);
        });

        // Step 4: Configure the product (Flavor + Plan)
        await test.step(`Select ${FLAVOR} flavor and One-Time purchase`, async () => {
            await productPage.addFlavorQuantity(FLAVOR);
            await productPage.selectOneTimePurchase();
        });

        // Step 5: Add to basket and handle popup
        await test.step('Add to basket and proceed via popup', async () => {
            await productPage.addToBasket();
            await productPage.proceedToBasketFromPopup();
        });

        // Step 6: Validate the side cart drawer
        await test.step('Validate Cart Drawer contents and checkout availability', async () => {
            await cartDrawer.waitForDrawerToOpen();
            
            // Assert Product Type and Flavor match
            await cartDrawer.validateCartItem(PRODUCT_TYPE, FLAVOR);
            
            // Assert Checkout button exists per requirements
            await cartDrawer.validateCheckoutIsReady();
        });
    });
});