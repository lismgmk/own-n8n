import express from 'express';
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const app = express();
const scrapePage = async () => {
  await puppeteer
    .launch()
    .then(async (browser) => {
      const login = 'rakuten@takeads.com';
      const password = 'gIUFe4%i]Z^0FHhk%jm';
      const page = await browser.newPage();
      await page.goto('https://cli.linksynergy.com/cli/common/login.php', {
        waitUntil: 'networkidle2',
      });
      await page.waitForSelector('input[name="username"]');

      await page.type('input[name="username"]', login);
      await page.type('input[name="password"]', password);

      await page.click('button[name="login"]');

      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      const url =
        'https://publisher.rakutenadvertising.com/api/vat-invoices?file=/home/httpd/invoice/affvat/20240201/37205/VAT_37205_2126220_20240201.pdf&advertiserID=37205';
      await page.goto(url, {
        waitUntil: [`domcontentloaded`, `networkidle0`],
      });
      const pdfBuffer = await page.pdf({ pageRanges: `1-1` });
      await fs.writeFile('file.pdf', pdfBuffer);
    })
    .catch((error) => {
		console.log(error)
     
    })
    // .finally(() => browser && browser.close());
};

app.listen(8080, async () => await scrapePage());
