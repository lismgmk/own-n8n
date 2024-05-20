import express from 'express';
import puppeteer from 'puppeteer';
const app = express();
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const saveScreenshot = async (screenshot, folderName = 'screenshots') => {
  const downloadDir = path.join(__dirname, folderName);

  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
  }

  const fileName = `screenshot_${Date.now()}.png`;

  const filePath = path.join(downloadDir, fileName);

  fs.writeFileSync(filePath, screenshot);

  console.log(`Screenshot saved to: ${filePath}`);
};

const scrapePage = async () => {
  try {
    // Установка соединения с WebSocket сервером
    const browser = await puppeteer.connect({
      browserWSEndpoint: 'ws://localhost:3000?token=CEA6J8PTLND9',
    });
    const login = 'rakuten@takeads.com';
    const password = 'gIUFe4%i]Z^0FHhk%jm';

    const startDate = '2024-04-01';
    const endDate = '2024-04-03';

    const page = await browser.newPage();
    await page.goto('https://cli.linksynergy.com/cli/common/login.php', {
      waitUntil: 'networkidle2',
    });

    await page.goto('https://cli.linksynergy.com/cli/common/login.php', {
      waitUntil: 'networkidle2',
    });
    await page.waitForSelector('input[name="username"]');

    await page.type('input[name="username"]', login);
    await page.type('input[name="password"]', password);

    await page.click('button[name="login"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    const url1 = `https://publisher.rakutenadvertising.com/api/payments?sort=&order=ASC&page=1&pageSize=10000&query=&download=false&srcCurrency=&period=thisYear&startDate=${startDate}&endDate=${endDate}`;

    const response = await page.goto(url1, {
      waitUntil: 'networkidle2',
    });
    const generallArr = await response.json();
    const userAgent = await page.evaluate(() => navigator.userAgent);

    console.log(userAgent);
    const cookies = await page.cookies();
    let cookie_str = '';
    for (var i = 0; i < cookies.length; i += 1) {
      const a = cookies[i];
      cookie_str += a.name + '=' + a.value + ';';
    }

    const links = {};

    const arrr = [];
    for (let i = 1; i <= generallArr.data.length; i++) {
      if (generallArr.data[i]) {
        const url3 = `https://publisher.rakutenadvertising.com/api/payments/${generallArr.data[i].id}/invoices`;
        const paymentId = generallArr.data[i].id;
        const response = await page.goto(url3, {
          waitUntil: 'networkidle2',
        });

        const result = await response.json();

        if (result[i] && result[i].filePath) {
          const url4 = `https://publisher.rakutenadvertising.com/api/invoices/${result[i].id}`;

          const res = await page.goto(url4, {
            waitUntil: 'networkidle2',
          });

          const currentAdv = await res.json();

          links[paymentId] = [];
          for (let k = 1; k <= result.length; k++) {
            if (result[k]) {
              links[paymentId].push(
                `https://publisher.rakutenadvertising.com/api/vat-invoices?file=${currentAdv.filePath}&advertiserID=${currentAdv.advertiserID}`
              );
            }
          }
        } else {
          arrr.push({ id: generallArr.data[i].id, 'result[i]': result[i] });
          console.log(result[i], 'result[i]');
        }
      } else {
        console.log(generallArr.data[i], 'generallArr.data[i]');
      }
    }
    console.log(links, 'alll');
    await browser.close();

    data = { links, cookies: cookie_str, userAgent };
const file = await fetch(
  'https://publisher.rakutenadvertising.com/api/vat-invoices?file=/home/httpd/invoice/affvat/20231001/47920/VAT_47920_2126220_20231001.pdf&advertiserID=47920'
);
    // // Директория для сохранения скриншота
    // const downloadDir = path.join(__dirname, 'download');

    // // Если папка download не существует, создать ее
    // if (!fs.existsSync(downloadDir)) {
    //   fs.mkdirSync(downloadDir);
    // }

    // // Генерация имени файла
    // const fileName = `screenshot_${Date.now()}.png`;

    // // Путь к файлу для сохранения скриншота
    // const filePath = path.join(downloadDir, fileName);

    // // Сохранение скриншота в файл
    // fs.writeFileSync(filePath, screenshot);

    // console.log(`Screenshot saved to: ${filePath}`);

    // return filePath;
  } catch (error) {
    console.error('Error during scraping:', error);
    throw error;
  }
};

app.listen(8080, async () => {
  console.log('Server is running on http://localhost:8080');
  try {
    await scrapePage();
  } catch (error) {
    console.error('Error during initial scraping:', error);
    process.exit(1); // Завершение процесса с кодом ошибки
  }
});
