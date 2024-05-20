module.exports = async ({ page, context }) => {
  await page.goto('https://affiliate.tradetracker.com/user/login', {
    waitUntil: 'networkidle2',
  });
  await page.waitForTimeout(3000);
  const login = 'coupons-e';
  const password = 'wA5gM44ORN@';
  const data = {
    acceptedDate: '',
    underEvaluationDate: '',
  };

  await page.type('input[id="username"]', login);
  await page.type('input[id="password"]', password);
  await page.click('input[name="submitLogin"]');
  await page.waitForTimeout(3000);

  //   await page.goto(
  //     'https://affiliate.tradetracker.com/affiliateTransaction/sales?virtualPath=sales&virtualConversionType=5&desc=1&outputType=4&c=&r=0&p[t]=1&p[fd]=1&p[fm]=1&p[fy]=2024&p[td]=31&p[tm]=1&p[ty]=2024&submit_period_p=Apply&limit=1000&offset=0&f=2',
  //     { waitUntil: 'networkidle2' }
  //   );
  //   await page.waitForTimeout(8000);
  const checkElement = async (url, field, child) => {
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(8000);
    const elementNoDataAccepted = await page.evaluate(() => {
      const element = document.querySelector('tr.table-row-empty > td');
	  element.textContent.trim() === 'There are no rows that match your search.' ? '0.00' : null;
    });

    const elementFullDataAccepted = await page.evaluate(() => {
      const element = document.querySelector(
        `#list-view-27-right > tfoot > tr > td:nth-child(${child}) > span`
      );
      return element ? element.textContent.trim() : null;
    });

    if (elementFullDataAccepted) {
      field = elementFullDataAccepted;
    }
    if (elementNoDataAccepted) {
      field = elementNoDataAccepted;
    }
  };
  await checkElement(
    'https://affiliate.tradetracker.com/affiliateTransaction/sales?virtualPath=sales&virtualConversionType=5&desc=1&outputType=4&c=&r=0&p[t]=1&p[fd]=1&p[fm]=1&p[fy]=2024&p[td]=31&p[tm]=1&p[ty]=2024&submit_period_p=Apply&limit=1000&offset=0&f=2',
    data.acceptedDate,
    7
  );
  await checkElement(
    'https://affiliate.tradetracker.com/affiliateTransaction/sales?virtualPath=sales&virtualConversionType=5&desc=1&outputType=4&c=&r=0&p[t]=1&p[fd]=1&p[fm]=1&p[fy]=2024&p[td]=31&p[tm]=1&p[ty]=2024&submit_period_p=Apply&limit=1000&offset=0&f=1',
    data.underEvaluationDate,
    7
  );
  //   const elementNoDataAccepted = await page.evaluate(() => {
  //     const element = document.querySelector('tr.table-row-empty');
  //     return element ? element.textContent.trim() : null;
  //   });

  //   const elementFullDataAccepted = await page.evaluate(() => {
  //     const element = document.querySelector(
  //       '#list-view-27-right > tfoot > tr > td:nth-child(7) > span'
  //     );
  //     return element ? element.textContent.trim() : null;
  //   });

  //   if (elementFullDataAccepted) {
  //     data.acceptedDate = elementFullData;
  //   }
  //   if (elementNoDataAccepted) {
  //     data.acceptedDate = '0.00';
  //   }
  //   const acceptedDate = await page.evaluate(() => {
  //     return document
  //       .querySelector(
  //         '#list-view-27-right > tfoot > tr > td:nth-child(7) > span'
  //       )
  //       .textContent.trim();
  //   });

//   await page.goto(
//     'https://affiliate.tradetracker.com/affiliateTransaction/sales?virtualPath=sales&virtualConversionType=5&desc=1&outputType=4&c=&r=0&p[t]=1&p[fd]=1&p[fm]=1&p[fy]=2024&p[td]=31&p[tm]=1&p[ty]=2024&submit_period_p=Apply&limit=1000&offset=0&f=1',
//     { waitUntil: 'networkidle2' }
//   );
//   await page.waitForTimeout(8000);
//   const underEvaluationDate = await page.evaluate(() => {
//     return document
//       .querySelector(
//         '#list-view-27-right > tfoot > tr > td:nth-child(7) > span'
//       )
//       .textContent.trim();
//   });

  return {
    data,
  };
};

export default async ({ page }: { page: Page }) => {
  await page.goto('https://affiliate.tradetracker.com/user/login', {
    waitUntil: 'networkidle2',
  });
  await page.waitForTimeout(3000);
  const login = 'coupons-e';
  const password = 'wA5gM44ORN@';
  const child = 7;
  const startDate = 'p[fd]=1&p[fm]=1&p[fy]=2024';
  const endDate = 'p[td]=31&p[tm]=1&p[ty]=2024';
  const limit = 100;
  const data = {
    acceptedDate: 0,
    underEvaluationDate: 0,
  };
  await page.type('input[id="username"]', login);
  await page.type('input[id="password"]', password);
  await page.click('input[name="submitLogin"]');
  await page.waitForTimeout(3000);
let currentPage = 1;
  const repeatAdd = async (currentField) => {

 

currentPage++;

   console.log(currentPage, 'currentElementPagination');
      await page.waitForTimeout(3000);

await page.evaluate((currentPage) => {
    let lis = Array.from(document.querySelectorAll('ul.pagination > li'));
    let li = lis.find(li => +li.textContent.trim() === currentPage);
    
    if (li) {
        let a = li.querySelector('a');
        
        if (a) (a as HTMLElement).click();
    }
}, currentPage);

    await page.waitForTimeout(3000);

    
    const elementFullData = await page.evaluate((child) => {
      const element = document.querySelector(
        `#list-view-27-right > tfoot > tr > td:nth-child(${child}) > span`
      );
      return element ? element.textContent.trim() : null;
    }, child);
    const currentNumber = Number(
      elementFullData.replace(',', '').replace('€', '').replace('MX$', '')
    );
 
    data[currentField] = currentNumber + data[currentField];

const currentElementPagination = await page.evaluate(() => {
        return !!document.querySelector('a > span.ico-right-open');
      });
 
 if (currentElementPagination) {
        await repeatAdd('underEvaluationDate');
      } else {
        return;
      }
  };

  const checkElement = async (url, field) => {
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(8000);

const elementPagination = await page.evaluate(() => {
        return !!document.querySelector('a > span.ico-right-open');
      });
  
    const elementNoData = await page.evaluate(() => {
      const element = document.querySelector('tr.table-row-empty > td');
      return element &&
        element.textContent.trim() ===
          'There are no rows that match your search.'
        ? 0.0
        : null;
    });

    const elementFullData = await page.evaluate((child) => {
      const element = document.querySelector(
        `#list-view-27-right > tfoot > tr > td:nth-child(${child}) > span`
      );
      return element ? element.textContent.trim() : null;
    }, child);

    if (elementNoData !== null) {
      data[field] += elementNoData;
      return;
    }

    if (elementFullData !== null) {
      const currentNumber = Number(
        elementFullData.replace(',', '').replace('€', '').replace('MX$', '')
      );

      data[field] = currentNumber; 
 
      if (elementPagination) {
        await repeatAdd(field);
      } else {
        return;
      }
    }
  };
  await checkElement(
    `https://affiliate.tradetracker.com/affiliateTransaction/sales?virtualPath=sales&virtualConversionType=5&desc=1&outputType=4&c=&r=0&p[t]=1&${startDate}&${endDate}&submit_period_p=Apply&limit=${limit}&offset=0&f=1`,
    'underEvaluationDate'
  );

  await checkElement(
    `https://affiliate.tradetracker.com/affiliateTransaction/sales?virtualPath=sales&virtualConversionType=5&desc=1&outputType=4&c=&r=0&p[t]=1&${startDate}&${endDate}&submit_period_p=Apply&limit=${limit}&offset=0&f=2`,
    'acceptedDate'
  );

  return {
    data,
  };
};