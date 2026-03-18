import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly acceptCookiesButton: Locator;
    readonly shopMainNavButton: Locator;
    readonly powderedMealsLink: Locator;

    constructor(page: Page) {
        this.page = page;
        
        this.acceptCookiesButton = page.locator('#onetrust-accept-btn-handler').or(page.getByRole('button', { name: /Accept All Cookies/i }));
        
        // Navigation locators
        this.shopMainNavButton = page.getByRole('button', { name: /Shop/i }).first();
        this.powderedMealsLink = page.getByLabel('Shop by Collection', { exact: true }).getByRole('link', { name: 'Powdered Meals' });
    }

    async navigateToHome() {
        await this.page.goto('https://uk.huel.com/');
        await expect(this.shopMainNavButton).toBeVisible({ timeout: 15000 });
    }

    async acceptCookies() {
        try {
            await this.acceptCookiesButton.waitFor({ state: 'visible', timeout: 5000 });
            await this.acceptCookiesButton.click();
            await this.acceptCookiesButton.waitFor({ state: 'hidden', timeout: 5000 });
        } catch (error) {
            console.log('Cookie banner did not appear within timeout. Proceeding...');
        }
    }

    async navigateToPowderedMeals() {
        // Hover opens the mega-menu
        await this.shopMainNavButton.hover();
        
        // Click the specific collection link based on your provided locator
        await this.powderedMealsLink.click();
        
        // Validate navigation to collections page
        await this.page.waitForURL(/.*\/collections\/huel-powder.*/, { timeout: 15000 });
    }
}