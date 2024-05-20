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
  // Директория для сохранения скриншота
  const downloadDir = path.join(__dirname, folderName);

  // Если папка не существует, создаем ее
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
  }

  // Генерируем имя файла
  const fileName = `screenshot_${Date.now()}.png`;

  // Путь к файлу для сохранения скриншота
  const filePath = path.join(downloadDir, fileName);

  // Сохраняем скриншот в файл
  fs.writeFileSync(filePath, screenshot);

  console.log(`Screenshot saved to: ${filePath}`);
};

const scrapePage = async () => {
  try {
    // Установка соединения с WebSocket сервером
    const browser = await puppeteer.connect({
      browserWSEndpoint: 'ws://localhost:3000?token=CEA6J8PTLND9',
    });

    // Создание новой страницы

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

    // Получаем все куки с текущей страницы
    const cookies = await page.cookies();

 const headers = await page.evaluate(() => {
   const headers = {};
   for (const [name, value] of Object.entries(window.document)) {
     if (name.toLowerCase() === 'headers') {
       for (const [headerName, headerValue] of Object.entries(value)) {
         headers[headerName] = headerValue;
       }
       break; // Выходим из цикла, как только найдем объект заголовков
     }
   }
   return headers;
 });

    // Получаем локатор страницы
    const locator = await page.url();

    // Переходим по ссылке на PDF с использованием куки, заголовков и локатора
    const url =
      'https://publisher.rakutenadvertising.com/api/vat-invoices?file=/home/httpd/invoice/affvat/20240201/37205/VAT_37205_2126220_20240201.pdf&advertiserID=37205';
    try {
      await page.goto(url, { waitUntil: [`domcontentloaded`, `networkidle0`] });
      const pdfBuffer = await page.pdf({ pageRanges: `1-1` });
      await fs.writeFile('file.pdf', pdfBuffer);
    } catch (e) {
      console.log(e.message);
    }
 await page.goto(url, { waitUntil: [`domcontentloaded`, `networkidle0`] });
    // Закрытие браузера
    await browser.close();

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
