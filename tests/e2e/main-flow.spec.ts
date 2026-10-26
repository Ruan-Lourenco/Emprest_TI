import { expect, test } from "@playwright/test";

test("protege o catálogo e valida o formulário de login", async ({ page }) => {
  await page.goto("/catalogo");
  await expect(page).toHaveURL(/\/login$/);
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
  await expect(page.getByText("Informe um e-mail válido.")).toBeVisible();
  await expect(page.getByText("Informe a senha.")).toBeVisible();
});
