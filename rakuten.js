async ({ page, browser }: { page: Page, browser: Browser }) => {
  const login = 'rakuten@takeads.com';
  const password = 'gIUFe4%i]Z^0FHhk%jm';

  const startDate = '2024-01-01';
  const endDate = '2024-01-31';

  await page.goto('https://cli.linksynergy.com/cli/common/login.php', {
    waitUntil: 'networkidle2',
  });
  await page.waitForSelector('input[name="username"]');

  await page.type('input[name="username"]', login);
  await page.type('input[name="password"]', password);

  await page.click('button[name="login"]');
  await page.waitForTimeout(3000);

  const url1 = `https://publisher.rakutenadvertising.com/api/payments?sort=&order=ASC&page=1&pageSize=10000&query=&download=false&srcCurrency=&period=thisYear&startDate=${startDate}&endDate=${endDate}`;

  const response = await page.goto(url1, {
    waitUntil: 'networkidle2',
  });
  const generallArr = await response.json();

  const cookies = await page.cookies();
  let cookie_str = '';
  for (var i = 0; i < cookies.length; i += 1) {
    const a = cookies[i];
    cookie_str += a.name + '=' + a.value + ';';
  }
  await page.waitForTimeout(3000);

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
            links[paymentId].push({
              link: `https://publisher.rakutenadvertising.com/api/vat-invoices?file=${currentAdv.filePath}&advertiserID=${currentAdv.advertiserID}`,
            });
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
  console.log(links, 'alll', cookie_str);

  return { data: { links, cookies: cookie_str } };
};
