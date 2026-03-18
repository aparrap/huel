import { Page, Locator, expect } from '@playwright/test';

export default (page: Page) => {
    const elements = {
        acceptCookiesButton: page.locator('#onetrust-accept-btn-handler').or(page.getByRole('button', { name: /Accept All Cookies/i })),
        shopMainNavButton: page.getByRole('button', { name: /Shop/i }).first(),
        powderedMealsLink: page.getByLabel('Shop by Collection', { exact: true }).getByRole('link', { name: 'Powdered Meals' }),
    }

    const navigateToHome = async() => {
        await page.goto('https://uk.huel.com/');
        await expect(elements.shopMainNavButton).toBeVisible({ timeout: 15000 });
    }

    const acceptCookies = async() => {
        try {
            await elements.acceptCookiesButton.waitFor({ state: 'visible', timeout: 5000 });
            await elements.acceptCookiesButton.click();
            await elements.acceptCookiesButton.waitFor({ state: 'hidden', timeout: 5000 });
        } catch (error) {
            console.log('Cookie banner did not appear within timeout. Proceeding...');
        }
    }

    const navigateToPowderedMealsViaMenu = async() => {
        // Hover opens the mega-menu
        await elements.shopMainNavButton.hover();
        
        // Click the specific collection link based on your provided locator
        await elements.powderedMealsLink.click();
        
        // Validate navigation to collections page
        await page.waitForURL(/.*\/collections\/huel-powder.*/, { timeout: 15000 });
    }

    return {
        navigateToHome,
        acceptCookies,
        navigateToPowderedMealsViaMenu,
    }
}