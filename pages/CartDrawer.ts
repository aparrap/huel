import { Page, Locator, expect } from '@playwright/test';

export class CartDrawer {
    readonly page: Page;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkoutButton = page.getByTestId('cart-checkout-button');
    }

    async waitForDrawerToOpen() {
        await expect(this.checkoutButton).toBeVisible({ timeout: 15000 });
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Validates that the cart contains the correct product line item with the right flavor.
     */
    async validateCartItem(productName: string, flavorName: string) {
        // Scope to the specific line item container that has our product text
        const lineItemContainer = this.page.locator('[class*="LineItem_LineItem__content"]').filter({ hasText: productName }).first();
        
        // Assert the Product Title matches
        const titleLocator = lineItemContainer.getByRole('heading', { name: productName });
        await expect(titleLocator).toBeVisible();

        // Assert the Flavor Variant matches. 
        // We use a CSS wildcard `[class*="..."]` to protect against CSS module hashes changing (e.g., __zOhdq)
        const flavorLocator = lineItemContainer.locator('p[class*="LineItem_LineItem__variant"]');
        await expect(flavorLocator).toHaveText(flavorName);
    }

    async validateCheckoutIsReady() {
        await expect(this.checkoutButton).toBeVisible();
        await expect(this.checkoutButton).toBeEnabled();
    }
}