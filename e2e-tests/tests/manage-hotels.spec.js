const { test, expect } = require('@playwright/test')
const path = require('path')

const UI_URL = "http://localhost:5173/"

test.beforeEach(async ({page}) => {
    await page.goto(UI_URL)

    // get the sign in button
    await page.getByRole("link", {name: "Sign In"}).click()

    await expect(page.getByRole("heading", {name: "Sign In"})).toBeVisible()

    await page.locator("[name=email]").fill("sam@gmail.com")
    await page.locator("[name=password]").fill("israel333")

    await page.getByRole("button", {name: "Login"}).click()

    await expect(page.getByText("Sign in Successful")).toBeVisible()
})

test("Should allow user to add a hotel", async ({ page }) => {
    await page.goto(`${UI_URL}add-hotel`)

    await page.locator('[name="name"]').fill("Dublin Resort")
    await page.locator('[name="city"]').fill("Dublin")
    await page.locator('[name="country"]').fill("Ireland")
    await page.locator('[name="description"]').fill("This is a description for the test hotel")
    await page.locator('[name="pricePerNight"]').fill("100")
    
    await page.selectOption('select[name="starRating"]', "3")
    
    await page.getByText("Budget").click()
    
    await page.getByLabel("Free Wifi").check()
    await page.getByLabel("Parking").check()

    await page.locator('[name="adultCount"]').fill("2")
    await page.locator('[name="childCount"]').fill("4")

    await page.setInputFiles('[name="imageFiles"]', [
        path.join(__dirname, "files", "1.jpg"),
        path.join(__dirname, "files", "2.jpeg"),
        path.join(__dirname, "files", "3.jpg"),
        path.join(__dirname, "files", "3.jpg"),
    ])    
    await page.getByRole("button", {name: "Save"}).click()

    await expect(page.getByText("Hotel Saved!")).toBeVisible({ timeout: 20000 })
})

test("should display hotels", async ({ page }) => {
    await page.goto(`${UI_URL}my-hotels`)

    await expect(page.getByText("Dublin Resort")).toBeVisible()

    await expect(page.getByText("This is a description for the test hotel")).toBeVisible()

    await expect(page.getByText("Dublin, Ireland")).toBeVisible()
    await expect(page.getByText("Budget")).toBeVisible()
    await expect(page.getByText("$100 per Night")).toBeVisible()
    await expect(page.getByText("2 adults, 4 children")).toBeVisible()
    await expect(page.getByText("3 Star Rating")).toBeVisible()

    await expect(page.getByRole("link", { name: "View Details"})).toBeVisible()
    await expect(page.getByRole("link", { name: "Add Hotel"})).toBeVisible()
})