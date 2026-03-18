import { Page, Locator, expect } from '@playwright/test';

export default (page: Page) => {
    // 1. Add the cookie button to your elements repository
    const elements = {
        shopMainNavButton: page.getByRole('button', { name: /Shop/i }).first(),
        powderedMealsLink: page.getByLabel('Shop by Collection', { exact: true }).getByRole('link', { name: 'Powdered Meals' }),
        acceptCookiesButton: page.locator('#onetrust-accept-btn-handler').or(page.getByRole('button', { name: /Accept All Cookies/i })),
    };

    const acceptCookies = async () => {
        console.log('Checking for cookie banner...');
        try {
            // 1. Wait up to 5 seconds for the banner to appear
            await elements.acceptCookiesButton.waitFor({ state: 'visible', timeout: 5000 });
            
            // 2. Click to accept
            console.log('Cookie banner detected. Accepting...');
            await elements.acceptCookiesButton.click();
            
            // 3. THE CRITICAL STEP: Completely block test execution until the banner 
            // finishes its fade-out animation and is gone from the DOM.
            await elements.acceptCookiesButton.waitFor({ state: 'hidden', timeout: 5000 });
            console.log('Cookie banner successfully dismissed.');
            
        } catch (error) {
            // If it times out, the banner didn't load (or was already accepted). Safe to proceed.
            console.log('No cookie banner appeared. Proceeding...');
        }
    }

    const navigateToHome = async () => {
        // 3. Arm the handler right before navigation
        await page.goto('https://uk.huel.com/');
        await expect(elements.shopMainNavButton).toBeVisible({ timeout: 15000 });
    };

    const navigateToPowderedMealsViaMenu = async () => {
        // Hover opens the mega-menu
        await elements.shopMainNavButton.hover();
        
        // Click the specific collection link based on your provided locator
        await elements.powderedMealsLink.click();
        
        // Validate navigation to collections page
        await page.waitForURL(/.*\/collections\/huel-powder.*/, { timeout: 15000 });
    };

    return {
        navigateToHome,
        navigateToPowderedMealsViaMenu,
        acceptCookies,
    };
};