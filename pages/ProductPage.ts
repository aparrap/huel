import { Page, Locator, expect } from '@playwright/test';

export class ProductPage {
    readonly page: Page;
    readonly oneTimePurchaseOption: Locator;
    readonly addToCartButton: Locator;
    readonly goToBasketPopupButton: Locator;

    constructor(page: Page) {
        this.page = page;
        
        this.oneTimePurchaseOption = page.getByTestId('order-type-onetime');
        this.addToCartButton = page.getByTestId('add-to-cart-button');
        
        // Post-add to cart popup button
        this.goToBasketPopupButton = page.getByRole('button', { name: 'Go to basket' });
    }

    /**
     * Dynamically selects the quantity for a specific flavor using the data-testid
     */
    async addFlavorQuantity(flavorName: string) {
        // e.g., 'increase-Berry-quantity'
        const increaseButton = this.page.getByTestId(`increase-${flavorName}-quantity`);
        
        // Ensure the flavor is visible before interacting
        await increaseButton.scrollIntoViewIfNeeded();
        await increaseButton.click();
    }

    async selectOneTimePurchase() {
        await this.oneTimePurchaseOption.scrollIntoViewIfNeeded();
        await this.oneTimePurchaseOption.click();
    }

    async addToBasket() {
        await this.addToCartButton.click();
    }

    async proceedToBasketFromPopup() {
        // Wait for the upsell popup to appear and click through
        await expect(this.goToBasketPopupButton).toBeVisible({ timeout: 10000 });
        await this.goToBasketPopupButton.click();
    }
}