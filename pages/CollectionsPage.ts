import { Page, Locator } from '@playwright/test';

export default (page: Page) => {
    const elements = {
        viewProductButton: (productName: string): Locator => {
            return page.getByLabel(productName, { exact: true }).locator('a').filter({ hasText: 'View product' });
        }
    }
    
    /**
     * Selects a product from the collection grid.
     * @param productName - The exact aria-label of the product article (e.g., 'Powder')
     */
    const selectProduct = async (productName: string) => {
        
        await elements.viewProductButton(productName).click();
        
        // Validate transition to the Product Detail Page (PDP)
        await page.waitForURL(/.*\/products\/huel/, { timeout: 15000 });
    }

    return {
        selectProduct,
    }
}