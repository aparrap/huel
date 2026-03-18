import { Page, Locator, expect } from '@playwright/test';
export default (page: Page) => {
    const elements = {
        closePopupButton: page.getByRole('button', { name: 'Close' }),
    }

    const closePopup = async () => {
        await elements.closePopupButton.click();
    }

    return {
        closePopup,
        elements,
    }

}