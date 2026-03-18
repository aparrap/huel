import { Page, Locator, expect } from '@playwright/test';

export default (page: Page) => {
    const elements = {
        oneTimePurchaseOption: page.getByTestId('order-type-onetime'),
        addToCartButton: page.getByTestId('add-to-cart-button'),
        goToBasketPopupButton: page.getByRole('button', { name: 'Go to basket' }),
    }

    /**
     * Dynamically selects the quantity for a specific flavor using the data-testid
     */
    const addFlavorQuantity = async (flavorName: string) => {
        // e.g., 'increase-Berry-quantity'
        const increaseButton = page.getByTestId(`increase-${flavorName}-quantity`);
        
        // Ensure the flavor is visible before interacting
        await increaseButton.click();
    }

    const selectOneTimePurchase = async () => {
        await elements.oneTimePurchaseOption.scrollIntoViewIfNeeded();
        await elements.oneTimePurchaseOption.click();
    }

    const addToBasket = async () => {
        await elements.addToCartButton.click();
    }

    const proceedToBasketFromPopup = async () => {
        // Wait for the upsell popup to appear and click through
        await expect(elements.goToBasketPopupButton).toBeVisible({ timeout: 10000 });
        await elements.goToBasketPopupButton.click();
    }

    return {
        addFlavorQuantity,
        selectOneTimePurchase,
        addToBasket,
        proceedToBasketFromPopup,
    }
}