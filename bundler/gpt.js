import express from 'express';
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import https from 'https';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const saveFile = (
  url,
  fileName,
  userAgent,
  cookies,
  folderName = 'downloads'
) => {
  console.log(url, '++++');
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      const filePath = path.join(folderName, fileName);

      const options = {
        headers: {
          'User-Agent': userAgent,
          Cookie: cookies,
          Connection: 'keep-alive',
          'Content-Type': 'application/json',
        },
      };

      const file = fs.createWriteStream(filePath);
      const request = https.get(url, options, (response) => {
        response.pipe(file);

        file.on('finish', () => {
          file.close(() => {
            console.log(`File saved to: ${filePath}`);
            resolve();
          });
        });
      });

      request.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete the file async on error
        console.error(`Error downloading the file: ${err.message}`);
        reject(err);
      });
    }, 2000); // 1000ms delay
  });
};

function getFileNameFromPath(path) {
  const regex = /[^/]*$/;
  const match = path.match(regex);
  if (match) {
    return match[0];
  }
  return null;
}
const scrapePage = async () => {
  try {
    const browser = await puppeteer.connect({
      browserWSEndpoint: 'ws://localhost:3000?token=CEA6J8PTLND9',
    });

    const login = 'rakuten@takeads.com';
    const password = 'gIUFe4%i]Z^0FHhk%jm';

    const startDate = '2024-04-01';
    const endDate = '2024-04-30';

    const page = await browser.newPage();
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
    const cookies = await page.cookies();
    let cookie_str = '';
    for (const cookie of cookies) {
      cookie_str += `${cookie.name}=${cookie.value}; `;
    }

    const links = {};
    const arrr = [];

    const downloadDir = path.join(__dirname, 'downloads');

    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir);
    }
    for (let i = 0; i < 1; i++) {
      // for (let i = 0; i < generallArr.data.length; i++) {
      if (generallArr.data[i]) {
        const url3 = `https://publisher.rakutenadvertising.com/api/payments/${generallArr.data[i].id}/invoices`;
        const paymentId = generallArr.data[i].id;
        const response = await page.goto(url3, {
          waitUntil: 'networkidle2',
        });

        const result = await response.json();
console.log('---', result.length);
        if (result[i] && result[i].filePath) {
          const url4 = `https://publisher.rakutenadvertising.com/api/invoices/${result[0].id}`;
          const res = await page.goto(url4, {
            waitUntil: 'networkidle2',
          });

          const currentAdv = await res.json();
          links[paymentId] = [];

          for (let k = 0; k < 2; k++) {
            // for (let k = 0; k < result.length; k++) {
            if (result[k]) {
              const filePath = path.join(downloadDir, result[k].filePath);
              const url1 = `https://publisher.rakutenadvertising.com/api/vat-invoices?file=${result[k].filePath}&advertiserID=${currentAdv.advertiserID}`;
              console.log('88888', url1);
              // await saveFile(
              //   url1,
              //   getFileNameFromPath(result[k].filePath),
              //   userAgent,
              //   cookie_str
              // );
            }
          }
        } else {
          arrr.push({ id: generallArr.data[i].id, result: result[0] });
          console.log(result[0], 'result[0]');
        }
      } else {
        console.log(generallArr.data[i], 'generallArr.data[i]');
      }
    }

    // const fileUrl =
    //   'https://publisher.rakutenadvertising.com/api/vat-invoices?file=/home/httpd/invoice/affvat/20240201/45537/VAT_45537_2126220_20240201.pdf&advertiserID=45537';
    // const fileName = getFileNameFromPath(fileUrl);
    // saveFile(fileUrl, fileName, userAgent, cookie_str, downloadDir);

    await browser.close();
  } catch (error) {
    console.error('Error:', error);
  }
};

scrapePage();
