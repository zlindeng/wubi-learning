import { expect, test } from "@playwright/test";

test("keyboard learning prototype displays 25 root keys", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "认识五笔键盘" })).toBeVisible();
  await expect(page.getByRole("button", { name: "G 键，键名 王，横区" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Z", exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: "G 键，键名 王，横区" }).click();
  await expect(page.getByText("王 · 横区")).toBeVisible();
});
