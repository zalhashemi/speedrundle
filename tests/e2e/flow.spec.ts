import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Never hit the real game sites from tests: answer every external request with a stub page.
test.beforeEach(async ({ context }) => {
  await context.route(/^https?:\/\/(?!localhost)/, (route) => route.fulfill({ contentType: "text/html", body: "<title>stub</title>" }));
});

async function axe(page: Page, label: string) {
  await page.evaluate(() => Promise.allSettled(document.getAnimations().filter((a) => a.effect?.getTiming().iterations !== Infinity).map((a) => a.finished)));
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(serious.map((v) => `${label}: ${v.id} ${v.nodes.map((n) => n.target).join(" ")}`)).toEqual([]);
}

test("onboarding → first run → results → persistence", async ({ page, context }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /played as one speedrun/ })).toBeVisible();
  await axe(page, "intro");

  await page.getByRole("button", { name: "Pick my games" }).click();
  await page.getByRole("button", { name: /^Wordle/ }).click();
  await page.getByRole("button", { name: /^Connections/ }).click();
  await expect(page.getByRole("button", { name: /^Wordle/ })).toHaveAttribute("aria-pressed", "true");

  // "Other" form validates and can add several.
  await page.getByRole("button", { name: /^Other game/ }).click();
  await page.getByLabel("Game name").fill("Framed");
  await page.getByLabel("Link").fill("javascript:alert(1)");
  await page.getByRole("button", { name: "Add game" }).click();
  await expect(page.getByText(/doesn't look like a web link/)).toBeVisible();
  await page.getByLabel("Link").fill("framed.wtf");
  await page.getByRole("button", { name: "Add game" }).click();
  await expect(page.getByRole("status")).toHaveText("Framed added.");
  await axe(page, "picker");

  await page.getByRole("button", { name: "Continue (3)" }).click();
  await expect(page.getByRole("heading", { name: "Here's your dashboard." })).toBeVisible();

  // Start opens game 1 in a new tab.
  const [wordleTab] = await Promise.all([context.waitForEvent("page"), page.getByRole("button", { name: /Start my first run/ }).click()]);
  expect(wordleTab.url()).toContain("nytimes.com/games/wordle");
  await wordleTab.close();
  await expect(page.getByRole("heading", { name: "Wordle" })).toBeVisible();
  await expect(page.getByText("We can't see the game, so tap Done when you finish.")).toBeVisible();
  await axe(page, "run");

  const [connTab] = await Promise.all([context.waitForEvent("page"), page.getByRole("button", { name: "Done, open Connections" }).click()]);
  await connTab.close();
  const [framedTab] = await Promise.all([context.waitForEvent("page"), page.getByRole("button", { name: "Done, open Framed" }).click()]);
  expect(framedTab.url()).toContain("framed.wtf");
  await framedTab.close();

  await page.getByRole("button", { name: "Done, finish run" }).click();
  await expect(page.getByRole("heading", { name: "Run complete!" })).toBeVisible();
  await expect(page.getByText(/this is your PB to beat/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your records live only in this browser" })).toBeVisible();
  await axe(page, "results");

  // Undo finish puts you back on the last game, then finish again.
  await page.getByRole("button", { name: /undo last split/i }).click();
  await expect(page.getByRole("heading", { name: "Framed" })).toBeVisible();
  await page.getByRole("button", { name: "Done, finish run" }).click();
  await page.getByRole("button", { name: "Later" }).click();
  await page.getByRole("button", { name: "Back to dashboard" }).click();

  await expect(page.getByText(/Today's run is done in/)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/Today's run is done in/)).toBeVisible();
  await expect(page.getByText("1", { exact: true }).first()).toBeVisible();
  await axe(page, "dashboard");

  // Returning visitors skip onboarding.
  await page.goto("/");
  await expect(page).toHaveURL(/\/dashboard/);
});

test("mid-run: resume after reload, pause, undo, skip, reset", async ({ page, context }) => {
  context.on("page", (p) => p.close());
  await page.goto("/");
  await page.getByRole("button", { name: "Pick my games" }).click();
  await page.getByRole("button", { name: /^Globle/ }).click();
  await page.getByRole("button", { name: /^Bandle/ }).click();
  await page.getByRole("button", { name: /^Spotle/ }).click();
  await page.getByRole("button", { name: "Continue (3)" }).click();
  await page.getByRole("button", { name: "Look around first" }).click();

  await page.getByRole("button", { name: /Start today's run/ }).click();
  await page.getByRole("button", { name: "Done, open Bandle" }).click();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Bandle" })).toBeVisible(); // resumed

  await page.getByRole("button", { name: "Pause" }).click();
  const frozen = await page.getByRole("timer").textContent();
  await page.waitForTimeout(400);
  await expect(page.getByRole("timer")).toHaveText(frozen!);
  await expect(page.getByRole("button", { name: /^Done/ })).toBeDisabled();
  await page.getByRole("button", { name: "Resume" }).click();

  await page.getByRole("button", { name: "Undo last split" }).click();
  await expect(page.getByRole("heading", { name: "Globle" })).toBeVisible();

  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page.getByRole("heading", { name: "Bandle" })).toBeVisible();

  await page.getByRole("button", { name: "Reset run" }).click();
  await page.getByRole("button", { name: "Keep going" }).click();
  await page.getByRole("button", { name: "Reset run" }).click();
  await page.getByRole("button", { name: "Yes, reset" }).click();
  await expect(page.getByRole("button", { name: /Start today's run/ })).toBeVisible();
});

test("reorder games with arrows and see settings/about", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pick my games" }).click();
  await page.getByRole("button", { name: /^Wordle/ }).click();
  await page.getByRole("button", { name: /^NYT Mini/ }).click();
  await page.getByRole("button", { name: "Continue (2)" }).click();
  await page.getByRole("button", { name: "Look around first" }).click();
  await page.getByRole("link", { name: /Edit games/ }).click();
  await page.getByRole("button", { name: "Move NYT Mini up" }).click();
  await axe(page, "games");
  await page.getByRole("link", { name: /^Dashboard/ }).click();
  await expect(page.getByText(/starting with NYT Mini/)).toBeVisible();

  await page.getByRole("link", { name: "Settings" }).click();
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  await axe(page, "settings");
  await page.goto("/about");
  await axe(page, "about");
});
