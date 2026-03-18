import { Page, Locator, expect } from '@playwright/test';

export default (page: Page) => {
    const elements = {
    checkoutButton: page.getByTestId('cart-checkout-button'),
    }

    const waitForDrawerToOpen = async () => {
        await expect(elements.checkoutButton).toBeVisible({ timeout: 15000 });
        await page.waitForLoadState('networkidle');
    }

    /**
     * Validates that the cart contains the correct product line item with the right flavor.
     */
    const validateCartItem = async (productName: string, flavorName: string) => {
        // Scope to the specific line item container that has our product text
        const lineItemContainer = page.locator('[class*="LineItem_LineItem__content"]').filter({ hasText: productName }).first();
        
        // Assert the Product Title matches
        const titleLocator = lineItemContainer.getByRole('heading', { name: productName });
        await expect(titleLocator).toBeVisible();

        // Assert the Flavor Variant matches. 
        // We use a CSS wildcard `[class*="..."]` to protect against CSS module hashes changing (e.g., __zOhdq)
        const flavorLocator = lineItemContainer.locator('p[class*="LineItem_LineItem__variant"]');
        await expect(flavorLocator).toHaveText(flavorName);
    }

    const validateCheckoutIsReady = async () => {
        await expect(elements.checkoutButton).toBeVisible();
        await expect(elements.checkoutButton).toBeEnabled();
    }

    return {
        waitForDrawerToOpen,
        validateCartItem,
        validateCheckoutIsReady,
    }
}