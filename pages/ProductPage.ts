import { Page, Locator, expect } from '@playwright/test';

export class ProductPage {
    readonly page: Page;
    readonly addToCartButton: Locator;
    readonly quantitySelector: Locator;
    readonly priceLabel: Locator;

    constructor(page: Page) {
        this.page = page;
        // Using robust selectors (getByRole, getByTestId) instead of brittle CSS
        this.addToCartButton = page.getByRole('button', { name: /Add to basket/i });
        this.quantitySelector = page.getByLabel('Quantity');
        this.priceLabel = page.locator('.product-price'); // Assuming this class exists
    }

    async navigateToHuelPowder() {
        await this.page.goto('https://uk.huel.com/products/huel');
        // Validate page loaded correctly
        await expect(this.addToCartButton).toBeVisible({ timeout: 10000 });
    }

    async selectSubscriptionType(type: 'Subscribe' | 'Single') {
        await this.page.getByText(type, { exact: false }).click();
    }

    async addToBasket() {
        // Wait for network idle to ensure background pricing scripts have loaded
        await this.page.waitForLoadState('networkidle');
        await this.addToCartButton.click();
    }
}