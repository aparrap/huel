# HUEL
QA Technical Assessment

Document covering points 1, 3 and 4 is located in the root of this folder, file named TESTPLAN.md

# Huel QA Automation Assessment - Playwright Framework

## 🎯 Overview
This repository contains the automated E2E testing framework for the Huel web platform. It is built using **Playwright** and **TypeScript**, designed with scalability, speed, and resilience in mind.

## 🏗️ Framework Architecture & The Fixture Pattern

This framework utilizes the **Page Object Model (POM)** wrapped heavily in **Playwright Fixtures**. 

### Why Fixtures?
In traditional POM, you often have to instantiate page objects inside every test (`const homePage = new HomePage(page);`), which leads to boilerplate code and tight coupling. Playwright Fixtures solve this by acting as a Dependency Injection system.
1.  **Encapsulation & Clean Setup:** Fixtures handle the setup and teardown of page objects behind the scenes. The test simply asks for what it needs (e.g., `test('checkout', async ({ cartPage }) => {...}`).
2.  **Isolated State:** Every test gets a completely fresh, isolated browser context and fixture instance. This guarantees tests do not bleed state into one another, allowing for aggressive parallel execution.
3.  **Global Handlers:** We use fixtures to set up global listeners, such as `page.addLocatorHandler()`, which automatically dismisses unexpected cookie banners or newsletter pop-ups across *all* tests without cluttering the test logic.

## 📂 Folder Structure
```text
huel-automation/
├── .github/
│   └── workflows/        # CI/CD pipeline definitions (GitHub Actions)
├── src/
│   ├── pages/            # Page Object Model classes (Locators and Actions)
│   ├── fixtures/         # Playwright custom fixtures (Dependency Injection)
├── tests/
│   ├── e2e/              # End-to-End user journeys (e.g., Guest Checkout)
│   └── component/        # Isolated component tests (e.g., Cart Drawer functionality)
├── playwright.config.ts  # Global Playwright configuration (Browsers, Viewports, Retries)
├── package.json          # Project dependencies and scripts
└── README.md             # This file
```

## 🚀 Setup & Execution Instructions

### Prerequisites
* **Node.js**: v18 or higher
* **Package Manager**: npm (or yarn)

### Installation
1. Clone the repository:
```bash
   git clone https://github.com/aparrap/huel.git
   cd huel-automation
```
2. Install project dependencies:
```bash
    npm install
```
3. Install Playwright browsers and OS-level dependencies:
```bash
    npx playwright install --with-deps
```
### Running the Tests
We execute tests based on the analytics of our most heavily used platforms (e.g., Mobile Safari and Desktop Chrome).

```bash
    # Run all tests headlessly (Default pipeline behavior)
    npx playwright test

    # Run tests in UI mode (Highly recommended for debugging and time-traveling)
    npx playwright test --ui

    # Run tests specifically for Mobile Web emulation
    npx playwright test --project="Mobile Safari"

    # View the detailed HTML Test Report after execution
    npx playwright show-report
```

## ⚙️ CI/CD Integration
This repository is designed to integrate seamlessly with CI/CD tools like GitHub Actions. The pipeline strategy is tiered to balance rapid developer feedback with comprehensive test coverage:

Pull Request Pipeline (Smoke / Tier 1): A targeted subset of critical path tests (e.g., Add to Cart, Navigation, Guest Checkout) runs on every Pull Request. This pipeline acts as a gatekeeper, failing the build if core revenue-generating flows break.

Target execution time: < 3 minutes.

Nightly Pipeline (Regression / Tier 2): The full cross-browser, cross-device suite runs nightly against the Staging environment to catch edge-case regressions and assess overall platform health.

Post-Deployment Pipeline (Sanity / Tier 3): Read-only, synthetic tests execute against the Production environment immediately after a release to ensure the live environment is stable.

## 📈 Scalability & Continuous Improvement Plan
As the product grows, the automation framework must scale from tens of tests to hundreds without becoming a maintenance burden or slowing down the release cycle. The following improvements are part of our continuous engineering roadmap:

API Data Seeding (Shift-Left Setup): Currently, some tests rely on the UI to set up state. To scale execution speed, we will integrate backend API calls directly into our fixtures to seed the cart or create user accounts programmatically. This bypasses slow UI navigation steps for test setup.

Visual Regression Testing (VRT): Integrating Playwright's native snapshot testing (expect(page).toHaveScreenshot()) for critical, static UI components (like the navigation header, promotional banners, and product cards) to catch CSS/layout regressions that functional tests might miss.

Environment Agnosticism: Expanding the playwright.config.ts to consume .env variables cleanly. This allows the exact same test suite to run against localhost, staging, or production seamlessly by simply passing an environment flag in the CLI.

Test Case Priority Matrix Tags: Utilizing Playwright's grep tagging system (e.g., @P0-Critical, @P1-High, @Mobile-Only) to dynamically construct test suites based on deployment risk levels and environment targets.