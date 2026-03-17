import { test, expect } from '../fixtures/AppFixtures';

test.describe('E2E: Huel Powder Purchase Journeys', () => {

    test('Happy Path: Guest User configures product, adds to basket, and validates cart totals', async ({ homePage, productPage, cartDrawer }) => {
        
        // Step 1: Land on the Homepage
        await test.step('Navigate to Homepage', async () => {
            await homePage.navigateToHome();
        });

        // Step 1.5: Handle GDPR / Cookie Consent
        // We use a try/catch in the POM so this won't fail if the banner doesn't load
        await test.step('Accept Cookies if presented', async () => {
            await homePage.acceptCookies();
        });

        // Step 2: Navigate to Product Page via main menu
        await test.step('Navigate to Huel Powder Product Page', async () => {
            await homePage.navigateToPowderViaMenu();
        });

        // Step 3: Configure the product
        let capturedProductPrice = '';
        await test.step('Select Single Purchase, choose flavor, and capture price', async () => {
            // Ensure we are selecting a single purchase to avoid subscription auth walls
            await productPage.selectSubscriptionType('Single');
            
            // Wait for price calculation scripts to settle after changing subscription type
            await productPage.page.waitForLoadState('networkidle');
            
            // Capture the exact price shown on the page before adding to basket
            capturedProductPrice = await productPage.priceLabel.first().innerText();
            expect(capturedProductPrice).not.toBeNull();
            console.log(`Captured Product Price: ${capturedProductPrice}`);
        });

        // Step 4: Add to basket and wait for the async drawer to open
        await test.step('Add to basket and wait for drawer', async () => {
            await productPage.addToBasket();
            await cartDrawer.waitForDrawerToOpen();
        });

        // Step 5: Assertions - Validate Cart Integrity
        await test.step('Validate Cart Drawer data', async () => {
            // Verify correct quantity
            await cartDrawer.validateCartItemCount('1');
            
            // Verify the price passed into the drawer matches the product page price
            await cartDrawer.validateSubtotal(capturedProductPrice);
            
            // Verify the user can proceed to checkout
            await expect(cartDrawer.checkoutButton).toBeVisible();
            await expect(cartDrawer.checkoutButton).toBeEnabled();
        });
    });

    test('Negative Scenario: Attempt to add 0 items to cart', async ({ homePage, productPage }) => {
        
        await test.step('Navigate directly to Product Page', async () => {
            // Bypassing the homepage journey to speed up execution for edge cases
            await productPage.navigateToHuelPowder();
            await homePage.acceptCookies(); 
        });

        await test.step('Attempt to set quantity to 0', async () => {
            // Force quantity to 0. A robust UI should either prevent this input entirely
            // or disable the "Add to Basket" button.
            await productPage.quantitySelector.fill('0');
            
            // Trigger blur event to ensure UI reacts to the input change
            await productPage.quantitySelector.blur();
        });

        await test.step('Validate Add to Basket button is disabled or handles error', async () => {
            // The assertion depends on specific implementation, but typically the button disables
            await expect(productPage.addToCartButton).toBeDisabled();
        });
    });
});