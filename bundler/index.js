
import express from 'express';
import puppeteer from 'puppeteer';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const browserWSEndpoint = 'http://localhost:3000/?token=CEA6J8PTLND9';
const app = express();

const getBrowser = async () =>
  IS_PRODUCTION ? puppeteer.connect({ browserWSEndpoint }) : puppeteer.launch();

app.get('/image', async (req, res) => {
  let browser = null;

  await getBrowser()
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
      await page.wait_for_timeout(3000);
      const url3 =
        'https://publisher.rakutenadvertising.com/api/vat-invoices?file=/home/httpd/invoice/affvat/20240201/37205/VAT_37205_2126220_20240201.pdf&advertiserID=37205';

      // await newPage.goto(url3);

      await page.goto(url3, {
        waitUntil: 'networkidle2',
      });


      const screenshot = await page.screenshot();
      res.end(screenshot, 'binary');
    })
    .catch((error) => {
      if (!res.headersSent) {
        res.status(400).send(error.message);
      }
    })
    .finally(() => browser && browser.close());
});

app.listen(8080, () => console.log('Listening on PORT: 8080'));


