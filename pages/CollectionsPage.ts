import { Page, Locator } from '@playwright/test';

export default (page: Page) => {
    /**
     * Selects a product from the collection grid.
     * @param productName - The exact aria-label of the product article (e.g., 'Powder')
     */
    const selectProduct = async (productName: string) => {
        // Targets: <article aria-label="Powder" ...>
        const productArticle = page.getByRole('article', { name: productName, exact: true });
        
        // Targets: <a aria-label="Navigate to huel" href="/products/huel">
        const viewProductLink = productArticle.getByRole('link', { name: 'Navigate to huel' });

        await viewProductLink.scrollIntoViewIfNeeded();
        await viewProductLink.click();
        
        // Validate transition to the Product Detail Page (PDP)
        await page.waitForURL(/.*\/products\/.*/, { timeout: 15000 });
    }

    return {
        selectProduct,
    }
}