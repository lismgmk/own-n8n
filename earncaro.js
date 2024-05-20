// export default async ({ page, browser }: { page: Page, browser: Browser }) => {
//   await page.goto('https://earnkaro.com/login', {
//     waitUntil: 'networkidle2',
//   });

//   await page.waitForTimeout(3000);
//   const login = 's.magomedov@admitad.com';
//   const password = '8BIbiwdbu/';
//   const startDate = '2024-02-01';
//   const endDate = '2024-02-28';
//   const status = 'pending';

//   const data = {
//     status,
//     comission: 0,
//   };

//   await page.type('input[id="uname"]', login);
//   await page.click('button[data-from="EmailForm"]');
//   await page.waitForTimeout(3000);

//   await page.type('input[id="pwd"]', password);
//   await page.click('button[id="btnLayoutSignInPass"]');
//   await page.waitForTimeout(3000);

//   let total = 0;

//   async function scrapeAndSum(pageNumber: number) {
//     const statPage = `https://earnkaro.com/my-earnings/order-details?paging=${pageNumber}&filter[status]=${status}&filter[fromdate]=${startDate}&filter[todate]=${endDate}`;
//     await page.goto(statPage, {
//       waitUntil: 'networkidle2',
//     });
//     await page.setViewport({ width: 1280, height: 800 });

//     const result = await page.evaluate(() => {
//       let pageTotal = 0;
//       const pTags = Array.from(
//         document.querySelectorAll('p[id^=CashBackAmount]')
//       );
//       pTags.forEach((pTag) => {
//         const text = pTag.textContent;
//         const number = parseFloat(text.replace('₹', '').trim());
//         if (!isNaN(number)) {
//           pageTotal += number;
//         }
//       });
//       return { pageTotal, length: pTags.length };
//     });

//     total += result.pageTotal;

//     if (result.length !== 0) {
//       await scrapeAndSum(pageNumber + 1);
//     }
//   }

//   await scrapeAndSum(1);

//   data.comission = parseFloat(total.toFixed(2));
//   return {
//     data,
//   };
// };
module.exports = async ({ page, context }) => {
  const { login, password, startDate, endDate, status } = context;
  const data = {
    status,
    comission: 0,
  };

  await page.goto('https://earnkaro.com/login', {
    waitUntil: 'networkidle2',
  });

  await page.waitForTimeout(3000);

   await page.type('input[id="uname"]', login);
  await page.click('button[data-from="EmailForm"]');
  await page.waitForTimeout(3000);

  await page.type('input[id="pwd"]', password);
  await page.click('button[id="btnLayoutSignInPass"]');
  await page.waitForTimeout(3000);

  let total = 0;

  async function scrapeAndSum(pageNumber) {
    const statPage = `https://earnkaro.com/my-earnings/order-details?paging=${pageNumber}&filter[status]=${status}&filter[fromdate]=${startDate}&filter[todate]=${endDate}`;
    await page.goto(statPage, {
      waitUntil: 'networkidle2',
    });
    await page.setViewport({ width: 1280, height: 800 });
   
    const result = await page.evaluate(() => {
      let pageTotal = 0;
      const pTags = Array.from(
        document.querySelectorAll('p[id^=CashBackAmount]')
      );
      pTags.forEach((pTag) => {
        const text = pTag.textContent;
        const number = parseFloat(text.replace('₹', '').trim());

        pageTotal += number;
      });
      return { pageTotal, length: pTags.length };
    });

    total += result.pageTotal;

    if (result.length !== 0) {
      await scrapeAndSum(pageNumber + 1);
    }
  }

  await scrapeAndSum(1);

  data.comission = parseFloat(total.toFixed(2));
  return {
    data,
  };
};
