import { expect, test } from "@playwright/test";

test("percorre a jornada principal de demonstração", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: /entrar na demonstração/i }).click();
  await expect(page).toHaveURL(/\/catalogo$/);
  await page.getByRole("link", { name: /ver MacBook Pro/i }).click();
  await page.getByRole("button", { name: "Solicitar equipamento" }).click();
  await page.getByRole("button", { name: "Confirmar", exact: true }).click();
  await expect(page).toHaveURL(/\/meus-emprestimos$/);
  await expect(page.getByText('MacBook Pro 14"')).toBeVisible();
});
