import { chromium } from "playwright";
import path from "node:path";

const [, , htmlFile, outPng] = process.argv;
if (!htmlFile || !outPng) {
  console.error("usage: node capture.mjs <html> <out.png>");
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 2752, height: 1536 },
  deviceScaleFactor: 1,
});
await page.goto("file://" + path.resolve(htmlFile));
const el = await page.$("#fig");
if (!el) {
  console.error("no #fig element in " + htmlFile);
  await browser.close();
  process.exit(2);
}
await el.screenshot({ path: outPng });
await browser.close();
console.log("wrote " + outPng);
