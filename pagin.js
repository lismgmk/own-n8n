export default async () => {
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
    comission_approved: 0,
    comission_open: 0,
  };
  await page.type('input[id="username"]', login);
  await page.type('input[id="password"]', password);
  await page.click('input[name="submitLogin"]');
  await page.waitForTimeout(3000);
  let currentPage = 1;
  
  const repeatAdd = async (currentField) => {
    currentPage++;
    await page.evaluate((currentPage) => {
      let list = Array.from(document.querySelectorAll('ul.pagination > li'));
      let li = list.find((li) => +li.textContent.trim() === currentPage);

      if (li) {
        let a = li.querySelector('a');

        if (a) (a as HTMLElement).click();
      }
    }, currentPage);

    await page.waitForTimeout(8000);

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
      } 
    }

  };
  await checkElement(
    `https://affiliate.tradetracker.com/affiliateTransaction/sales?virtualPath=sales&virtualConversionType=5&desc=1&outputType=4&c=&r=0&p[t]=1&${startDate}&${endDate}&submit_period_p=Apply&limit=${limit}&offset=0&f=1`,
    'comission_open'
  );

  await checkElement(
    `https://affiliate.tradetracker.com/affiliateTransaction/sales?virtualPath=sales&virtualConversionType=5&desc=1&outputType=4&c=&r=0&p[t]=1&${startDate}&${endDate}&submit_period_p=Apply&limit=${limit}&offset=0&f=2`,
    'comission_approved'
  );

  return {
    data,
  };
};
export default async ({ page, browser }: { page: Page, browser: Browser }) => {
    // const { login, password, startDate, comission } = context;
const login = "fairsavings.es";
const password = "4fuS4pw7";
const child = 8;

  await page.goto('https://affiliate.tradetracker.com/user/login', {
    waitUntil: 'networkidle2',
  });
 await page.waitForTimeout(3000);
 
  const startDate = "p[fd]=1&p[fm]=4&p[fy]=2024";
  const endDate = "p[td]=30&p[tm]=4&p[ty]=2024";
  const limit = 1000;
  const data = {
    comission_approved: 0,
    comission_open: 0,
  };
  await page.type('input[id="username"]', login);
  await page.type('input[id="password"]', password);
  await page.click('input[name="submitLogin"]');
 await page.waitForTimeout(3000);
  let currentPage = 1;
  
  const parseAndRoundNumber = (elementFullData) => {
    return Number(elementFullData.replace(',', '').replace('€', '').replace('MX$', ''));
  }

  const repeatAdd = async (currentField) => {
    currentPage++;
    await page.evaluate((currentPage) => {
      let list = Array.from(document.querySelectorAll('ul.pagination > li'));
      let li = list.find((li) => +li.textContent.trim() === currentPage);

      if (li) {
        let a = li.querySelector('a');

        a.click();
      }
    }, currentPage);

    await page.waitForTimeout(8000);

    const elementFullData = await page.evaluate((child) => {
      const element = document.querySelector(
        `#list-view-27-right > tfoot > tr > td:nth-child(${child}) > span`
      );
      return element ? element.textContent.trim() : null;
    }, child);
    const currentNumber = parseAndRoundNumber(elementFullData);

    data[currentField] = currentNumber + data[currentField];

    const currentElementPagination = await page.evaluate(() => {
      return !!document.querySelector('a > span.ico-right-open');
    });

    if (currentElementPagination) {
      await repeatAdd(currentField);
    } else {
      return;
    }
  };

  const checkElement = async (url, field) => {
    await page.goto(url, { waitUntil: 'networkidle2' });
 await page.waitForTimeout(3000);
await page.click('a[id="listview-27-export-xml"]');
  // await fetch("https://affiliate.tradetracker.com/affiliateTransaction/sales?p[t]=11&virtualPath=sales&virtualConversionType=5&desc=1&offset=0&outputType=3&generate=1&rand=k9449ad", {
  //       method: 'GET',
  //       credentials: 'include'
  //     });
  await page.waitForTimeout(1000);
  const res = await fetch("https://affiliate.tradetracker.com/affiliateTransaction/sales?p[t]=11&virtualPath=sales&virtualConversionType=5&desc=1&offset=0&outputType=3&generate=2", {
        method: 'GET',
        credentials: 'include'
      }).then(r => r.text());
 console.log(res, '++')
// const [response] = await Promise.all([
 
//   await page.click('a[id="listview-27-export-csv"]')
// ]);


  // const linkHandler = await page.$x("//a[@title='Export to CSV']");

  // if (linkHandler.length > 0) {
    // const href = await page.evaluate(el => el.href, linkHandler[0]);
    // await linkHandler[0].click();
// console.log('+++++++', linkHandler)
    // const res = await page.evaluate((href) => {
    //   return fetch("https://affiliate.tradetracker.com/affiliateTransaction/sales?p[t]=11&virtualPath=sales&virtualConversionType=5&desc=1&offset=0&outputType=3&generate=1&rand=l9449ad", {
    //     method: 'GET',
    //     credentials: 'include'
    //   }).then(r => r.text());
    // });

  // } else {
  //   throw new Error("Link not found");
  // }

 

    // await page.waitForTimeout(4000);

    // const elementPagination = await page.evaluate(() => {
    //   return !!document.querySelector('a > span.ico-right-open');
    // });

    // const elementNoData = await page.evaluate(() => {
    //   const element = document.querySelector('tr.table-row-empty > td');
    //   return element &&
    //     element.textContent.trim() ===
    //       'There are no rows that match your search.'
    //     ? 0.0
    //     : null;
    // });

    // const elementFullData = await page.evaluate((child) => {
    //   const element = document.querySelector(
    //     `#list-view-27-right > tfoot > tr > td:nth-child(${child}) > span`
    //   );
    //   return element ? element.textContent.trim() : null;
    // }, child);

    // if (elementNoData !== null) {
    //   data[field] += elementNoData;
    //   return;
    // }

    // if (elementFullData !== null) {
    //   const currentNumber = parseAndRoundNumber(elementFullData);
    //   data[field] = currentNumber;
    //   if (elementPagination) {
    //     await repeatAdd(field);
    //   } 
    // }
	
  };
  await checkElement(
    `https://affiliate.tradetracker.com/affiliateTransaction/sales?virtualPath=sales&virtualConversionType=5&desc=1&outputType=4&c=&r=0&p[t]=1&${startDate}&${endDate}&submit_period_p=Apply&limit=${limit}&offset=0&f=1`,
    'comission_open'
  );

  // await checkElement(
  //   `https://affiliate.tradetracker.com/affiliateTransaction/sales?virtualPath=sales&virtualConversionType=5&desc=1&outputType=4&c=&r=0&p[t]=1&${startDate}&${endDate}&submit_period_p=Apply&limit=${limit}&offset=0&f=2`,
  //   'comission_approved'
  // );

    await page.waitForSelector('#listview-27-export-xml'); // ожидание появления элемента на странице
  await page.click('#listview-27-export-xml'); 
console.log(data)
  return { 
    data   
  };
};