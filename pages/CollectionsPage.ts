import { Page, Locator } from '@playwright/test';

export class CollectionsPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Selects a product from the collection grid.
     * @param productName - The exact aria-label of the product article (e.g., 'Powder')
     */
    async selectProduct(productName: string) {
        // Targets the specific article block, then clicks the associated 'View product' button inside it
        const productArticle = this.page.getByRole('article', { name: productName });
        await productArticle.getByRole('link', { name: 'View product' }).click();
        
        // Validate transition to the PDP (Product Detail Page)
        await this.page.waitForURL(/.*\/products\/.*/, { timeout: 15000 });
    }
}