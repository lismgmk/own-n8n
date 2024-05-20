export default async ({ page, browser }: { page: Page, browser: Browser }) => {
  await page.goto('https://soicos.com', {
    waitUntil: 'networkidle2',
  });
  await page.setViewport({ width: 1280, height: 800 });

  await page.waitForTimeout(3000);
  const login = {{ $json.login }};
  const password = {{ $json.password }};
  const startDate = {{ $json.startDate }};
  const endDate = {{ $json.endDate }};
  const statPage = `https://soicos.com/publisher/dashboard?ds_date_from=${startDate}&ds_date_to=${endDate}`;
  const data = {
    comission_open: 0,
    comission_approved: 0,
  };

  await page.click('button[id="accept_cookies"]');

  await page.click('#login-form-trg #navbarDropdown');

  await page.type('input[id="login-form-email"]', login);
  await page.type('input[id="login-form-password"]', password);
  await page.click('button[id="login-submit"]');
  await page.waitForTimeout(3000);

  await page.goto(statPage, {
    waitUntil: 'networkidle2',
  });
  await page.setViewport({ width: 1280, height: 800 });

  async function getValueByText(page, text) {
    const element = await page.evaluate((text) => {
      const elements = Array.from(document.querySelectorAll('a'));
      const targetElement = elements.find(
        (element) => element.title.trim() === text.trim()
      );

      if (targetElement) {
        const parentElement = targetElement.parentElement;
        const fullText = parentElement.textContent;
        const value = fullText.split(':')[1].trim();
        return value;
      }
    }, text);

    return element;
  }

  const comission_approved = await getValueByText(page, 'Approved balance');
  const comission_open = await getValueByText(page, 'Pending approval');

  function extractNumber(str) {
    const number = parseFloat(
      str.replace('USD', '').replace(/\./g, '').replace(',', '.').trim()
    );
    return number;
  }
  data.comission_approved = extractNumber(comission_approved);
  data.comission_open = extractNumber(comission_open);

  return {
    data,
  };
};
