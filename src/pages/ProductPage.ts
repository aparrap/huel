import { Page, Locator, expect } from '@playwright/test';

export default (page: Page) => {
    const elements = {
        oneTimePurchaseOption: page.getByTestId('order-type-onetime'),
        addToCartButton: page.getByTestId('add-to-cart-button'),
        goToBasketPopupButton: page.getByRole('button', { name: 'Go to basket' }),
        goToCartPopupButton: page.getByRole('button', { name: 'Go to cart' }),
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
        await elements.oneTimePurchaseOption.check({ force: true });
    }

    const addToBasket = async () => {
        await elements.addToCartButton.click();
    }


    const proceedToBasketFromPopup = async () => {
        console.log('Waiting to see if Upsell Popup renders...');
        try {
            await elements.goToBasketPopupButton.waitFor({ state: 'visible', timeout: 3000 });   
            console.log('Upsell Popup detected! Clicking "Go to basket"...');
            await elements.goToBasketPopupButton.click();
        } catch (error) {
            console.log('No Upsell Popup detected (CI Environment). Proceeding directly to Cart Drawer validation...');
            await elements.goToCartPopupButton.waitFor({ state: 'visible', timeout: 3000 }); 
            await elements.goToCartPopupButton.click();
        }
    }

    return {
        addFlavorQuantity,
        selectOneTimePurchase,
        addToBasket,
        proceedToBasketFromPopup,
    }
}