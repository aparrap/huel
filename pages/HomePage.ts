import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly acceptCookiesButton: Locator;
    readonly shopMainNavButton: Locator;
    readonly huelPowderProductLink: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Typical OneTrust button selector, fallback to accessible role
        this.acceptCookiesButton = page.locator('#onetrust-accept-btn-handler').or(page.getByRole('button', { name: /Accept All Cookies/i }));
        
        this.shopMainNavButton = page.getByRole('button', { name: /Shop/i }).first();
        this.huelPowderProductLink = page.getByRole('link', { name: /Huel Powder/i, exact: false }).first();
    }

    /**
     * Navigates to the homepage and waits for the core layout to stabilize.
     */
    async navigateToHome() {
        await this.page.goto('https://uk.huel.com/');
        await expect(this.shopMainNavButton).toBeVisible({ timeout: 15000 });
    }

    /**
     * Attempts to accept cookies if the banner appears.
     * Uses a soft wait so the test doesn't fail if the banner is already dismissed.
     */
    async acceptCookies() {
        try {
            // Wait up to 5 seconds for the banner to appear
            await this.acceptCookiesButton.waitFor({ state: 'visible', timeout: 5000 });
            await this.acceptCookiesButton.click();
            
            // Ensure the banner actually disappears before moving on
            await this.acceptCookiesButton.waitFor({ state: 'hidden', timeout: 5000 });
            console.log('Cookie banner accepted and dismissed.');
        } catch (error) {
            // If it times out, we assume the banner didn't load or was already accepted
            console.log('Cookie banner did not appear within the timeout. Proceeding...');
        }
    }

    /**
     * Simulates a user navigating from the homepage to the specific product page.
     */
    async navigateToPowderViaMenu() {
        await this.shopMainNavButton.hover();
        await this.huelPowderProductLink.click();
        await this.page.waitForURL(/.*\/products\/huel.*/, { timeout: 15000 });
    }
}