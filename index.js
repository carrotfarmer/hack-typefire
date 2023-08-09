import puppeteer from "puppeteer";
import "dotenv/config";

import path from "path";
import { fileURLToPath } from "url";

const main = async () => {
	const __dirname = path.dirname(fileURLToPath(import.meta.url));

	const EMAIL = process.env.EMAIL;
	const PASSWORD = process.env.PASSWORD;

	console.log(`Logging in as: ${EMAIL}`);

	const browser = await puppeteer.launch();
	console.log("Launched Chrome!")

	const page = await browser.newPage();
	await page.setViewport({ width: 2560, height: 1600 });
	await page.goto("https://typefire.xyz/")

	const signInButton = await page.waitForSelector(
		'text/Sign in with email'
	)
	await signInButton.click()

	await page.type("input#ui-sign-in-email-input", EMAIL);

	// click on next button
	const nextBtn = await page.waitForSelector('text/Next');
	await nextBtn.click();

	// HACK: idk why it doesnt work without this
	// It's fine though, this screenshot gets replaced by the 
	// one in the end (game over).
	await page.screenshot({ path: "screenshot.png" });

	await page.type("input#ui-sign-in-password-input", `${PASSWORD}\n`);
	console.log("Successfully signed in!");

	// click on div#focus-error to focus on the words div
	await page.click("div#focus-error");

	const words = await page.$$("div#words > div");
	for (const word of words) {
		const letters = await word.$$("span");

		for (const letter of letters) {
			const text = await letter.evaluate(node => node.textContent);
			await page.type("div#words", text);
		}

		await page.keyboard.press("Space");
	}
	await page.screenshot({ path: "screenshot.png" });
	await browser.close();

	console.log(`Completed game! Screenshot saved in ${__dirname}`);
}

main();
