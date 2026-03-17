import { Page, Locator, expect } from '@playwright/test';

export class CartDrawer {
    readonly page: Page;
    readonly drawerContainer: Locator;
    readonly cartItemCountBadge: Locator;
    readonly subtotalPrice: Locator;
    readonly checkoutButton: Locator;
    readonly closeDrawerButton: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Using an OR selector strategy for resilience against DOM changes 
        // (Assuming typical Shopify/E-comm test-id or semantic HTML)
        this.drawerContainer = page.locator('[data-testid="cart-drawer"], #mini-cart, aside').filter({ hasText: /Cart|Basket/i }).first();
        
        this.cartItemCountBadge = this.drawerContainer.locator('[data-testid="cart-count"], .cart-count').first();
        this.subtotalPrice = this.drawerContainer.locator('[data-testid="cart-subtotal"], .subtotal-price').first();
        
        this.checkoutButton = this.drawerContainer.getByRole('button', { name: /Checkout|Secure Checkout/i });
        this.closeDrawerButton = this.drawerContainer.getByRole('button', { name: /Close/i });
    }

    /**
     * Waits for the slide-out drawer animation to complete and data to load.
     */
    async waitForDrawerToOpen() {
        // Wait for visual presence
        await expect(this.drawerContainer).toBeVisible({ timeout: 10000 });
        
        // Critical for SPA/React sites: Wait for background network requests to settle
        // to ensure the price and item count have finished updating from the server.
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Validates that the number of items shown in the cart matches expectations.
     */
    async validateCartItemCount(expectedCount: string) {
        await expect(this.cartItemCountBadge).toHaveText(expectedCount);
    }

    /**
     * Validates the subtotal. We use a regex extraction pattern in case
     * the UI renders "Subtotal: £55.00" but we only captured "£55.00".
     */
    async validateSubtotal(expectedPrice: string) {
        const actualSubtotalText = await this.subtotalPrice.innerText();
        
        // Strip out whitespace/newlines for a clean comparison
        const normalizedActual = actualSubtotalText.replace(/\s/g, '');
        const normalizedExpected = expectedPrice.replace(/\s/g, '');
        
        expect(normalizedActual).toContain(normalizedExpected);
    }

    /**
     * Validates checkout button is actionable and proceeds.
     */
    async proceedToCheckout() {
        await expect(this.checkoutButton).toBeEnabled();
        await this.checkoutButton.click();
        
        // Verify navigation to the checkout domain/page
        await this.page.waitForURL(/.*\/checkout.*/, { timeout: 15000 });
    }
}