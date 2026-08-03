import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { PREVIEW_IDS } from "../site/module-previews.js";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const harnessUrl = (id, beat = 0) => `/tests/preview-harness.html?module=${encodeURIComponent(id)}&beat=${beat}`;

async function assertGeometry(page) {
  return page.evaluate(() => {
    const root = document.querySelector("[data-harness-stage]");
    const viewport = { width: window.innerWidth, height: window.innerHeight, documentHeight: document.documentElement.scrollHeight };
    const visible = [...root.querySelectorAll("[data-beat]")].filter((item) => {
      const style = getComputedStyle(item);
      return style.opacity !== "0" && style.visibility !== "hidden";
    });
    const boxes = visible.map((item) => ({ name: item.className, rect: item.getBoundingClientRect() }));
    const overflow = boxes.filter(({ rect }) => rect.left < -1 || rect.right > viewport.width + 1 || rect.top < -1 || rect.bottom > viewport.documentHeight + 1).length;
    const collisions = [];
    for (let i = 0; i < boxes.length; i += 1) for (let j = i + 1; j < boxes.length; j += 1) {
      const a = boxes[i].rect, b = boxes[j].rect;
      if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2) collisions.push([i, j]);
    }
    return { overflow, collisions, nodeCount: root.querySelectorAll("*").length, title: root.dataset.module };
  });
}

for (const viewport of viewports) {
  test(`todos os previews cabem em ${viewport.name}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    for (const id of PREVIEW_IDS) {
      await page.goto(harnessUrl(id), { waitUntil: "domcontentloaded" });
      await expect(page.locator("[data-harness-stage]")).toHaveAttribute("data-module", id);
      const geometry = await assertGeometry(page);
      expect(geometry.title).toBe(id);
      expect(geometry.overflow, `${id} overflowed at ${viewport.name}`).toBe(0);
      expect(geometry.collisions, `${id} has overlapping active cards at ${viewport.name}`).toEqual([]);
      expect(geometry.nodeCount, `${id} exceeds DOM budget`).toBeLessThanOrEqual(120);
      if (process.env.UPDATE_PREVIEW_SCREENSHOTS === "1") {
        await mkdir(testInfo.outputPath("screenshots"), { recursive: true });
        await page.screenshot({ path: testInfo.outputPath(`screenshots/${id.replaceAll(".", "-")}-${viewport.name}.png`), fullPage: true });
      }
    }
    expect(errors).toEqual([]);
  });
}

test("Polls percorre os cinco beats sem perder a narrativa", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (let beat = 0; beat < 5; beat += 1) {
    await page.goto(harnessUrl("management.polls", beat), { waitUntil: "domcontentloaded" });
    await expect(page.locator("[data-harness-stage]")).toHaveAttribute("data-module", "management.polls");
    await expect(page.locator("[data-beat].is-active")).toHaveCount(1);
    await page.screenshot({ path: testInfo.outputPath(`poll-beat-${beat}.png`), fullPage: true });
  }
});

test("o modal suporta reprodução, pausa, repetição, fecho e foco", async ({ page }) => {
  await page.goto(harnessUrl("management.polls"), { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-harness-stage]")).toHaveAttribute("data-module", "management.polls");
  const trigger = page.locator("#open-preview");
  await trigger.focus();
  await trigger.click();
  await expect(page.locator("#vozen-simulation-modal")).toBeVisible();
  await page.locator(".vozen-preview-playback").click();
  await expect(page.locator("#vozen-simulation-modal")).toHaveAttribute("data-playback", "playing");
  await page.locator(".vozen-preview-playback").click();
  await expect(page.locator("#vozen-simulation-modal")).toHaveAttribute("data-playback", "paused");
  await page.locator(".vozen-preview-replay").click();
  await expect(page.locator("#vozen-simulation-modal")).toHaveAttribute("data-playback", "replaying");
  await page.keyboard.press("Escape");
  await expect(page.locator("#vozen-simulation-modal")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("movimento reduzido abre diretamente o estado final", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(harnessUrl("management.polls"), { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-harness-stage]")).toHaveAttribute("data-module", "management.polls");
  await page.locator("#open-preview").click();
  await expect(page.locator("#vozen-simulation-modal")).toHaveAttribute("data-playback", "completed");
  await expect(page.locator("[aria-valuenow='100']")).toHaveCount(1);
  await context.close();
});
