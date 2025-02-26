import { test, expect } from '@playwright/test'

test.describe('Country data', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('is the text visible', async ({ page }) => {
    const textElement = page.locator('text=find countries:')

    await expect(textElement).toBeVisible()
  })

  test('is the input bar visible', async ({ page }) => {
    const searchInput = page.locator('input')

    await expect(searchInput).toBeVisible()
  })

  test('should allow typing in the input bar', async ({ page }) => {
    const searchInput = page.locator('input')

    await searchInput.fill('sweden')

    await expect(searchInput).toHaveValue('sweden')
  })
})
